import User from "../../models/user.model";
import Currency from "../../models/currency.model";
import Product from "../../models/product/product.model";
import { Stripe } from "stripe";
import { generateUid } from "../../utils/helpers";
import PaymentMethod from "../../models/paymentMethod.model";
import Order from "../../models/product/order.model";
import { couponCheck } from "./coupon.controller";
import UsedCoupon from "../../models/product/used_coupon.model";
import Cart from "../../models/product/cart.model";
import paypal, { order } from "paypal-rest-sdk";
import SSLCommerzPayment from 'sslcommerz-lts'
import Razorpay from "razorpay";
import Mollie from '@mollie/api-client';
import Notification from "../../models/notification.model";

export const postOrder = async (req, res) => {
    try {        
        const { body } = req;
        const currency = await Currency.findOne({
            code: body.currency
        });
        if (!currency) {
            return res.status(404).json({
                message: 'Currency not found'
            });
        }

        let user = await User.findOne({ _id: res.locals.user._id });
        if(user){
            if(user?.role==='employee' || user?.role==='trainer' || user?.role==='admin'){
                return res.status(400).json({
                    error: true,
                    message: 'You are not allowed to place order'
                })
            }
        }
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let total_amount = 0;
        const items = await Promise.all(body.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            // Get product name based on langCode
            const productName = product.name.get(body.langCode);
            let price = product.price;
            let variant;
            if (item.variantId) {
                variant = product.variants.id(item.variantId);
                if (!variant) {
                    throw new Error(`Variant not found: ${item.variantId}`);
                }
                price = variant.price;
            }

            const total = price * item.quantity;
            total_amount += total;
            return {
                productId: item.productId,
                variantId: item.variantId,
                price: price*currency?.rate,
                quantity: item.quantity,
                total:total*currency?.rate,
                productName
            };
        }));
        
        
        let uid = await generateUid('O-', Product);
        let discount_amount = 0;
        if (!!body?.discount_coupon) {
            const data = await couponCheck({
                sub_total: total_amount,
                code: body?.discount_coupon
            }, req, res, true);
           
            discount_amount = +data?.saved_money;
            if ((+body?.subtotal) !== (+(data?.current_subtotal*currency?.rate))) {
                return res.status(404).json({
                    error: true,
                    msg: data?.msg ? data?.msg : "Wrong Input, please check price, quantity or subtotal",
                    // subTotal,
                    // data
                })
            }
        } else {
            if ((+body?.subtotal) !== (total_amount*currency?.rate)) {
                return res.status(404).json({
                    error: true,
                    msg: "Wrong Input, please check price, quantity or subtotal"
                })
            }
        }

        const orderData = {
            uid,
            userId: user._id,
            name: body.name,
            phone: body.phone,
            location: body.location,
            city: body.city,
            zip_code: body.zip_code,
            items: items,
            subTotal: total_amount * currency?.rate,
            discount_coupon: body?.discount_coupon,
            discount_amount: discount_amount * currency?.rate,
            status: 'pending',
            payment: {
                method: body.method,
                status: 'pending',
                amount: (total_amount - discount_amount) * currency?.rate,
                currency: body.currency
            }
        };
        if (body.method === 'stripe') {
            try {
                const productId = body.items[0]?.productId;
                if (!productId) {
                    return res.status(400).json({
                        message: 'Product ID is required for Stripe payment'
                    });
                }

                let product = await Product.findById(productId);
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                let session;

                let stripeConfig = await PaymentMethod.findOne({ type: 'stripe' });
                if (!stripeConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Stripe configuration not found for this user',
                    });
                }
                const stripeClient = new Stripe(stripeConfig?.config?.clientSecret);

                const amountInCents = Math.round(orderData.payment.amount * 100);

                const successUrl = `${process.env.FRONTEND_URL}/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`;
                const cancelUrl = `${process.env.FRONTEND_URL}/payment/failed`;

                session = await stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: body.currency,
                            product_data: {
                                name: product.name.get(body.langCode),
                            },
                            unit_amount: amountInCents,
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                });

                // save data in order table
                const order = new Order(orderData);
                order.payment.transaction_id = session.id;
                order.payment.amount = orderData?.payment?.amount;
                await order.save();
                // delete cart
                const cart = await Cart.findOne({ user: user._id });
                if (cart) {
                    await Cart.findOneAndDelete({ _id: cart._id });
                }

                return res.status(200).json({
                    error: false,
                    msg: 'Order created successfully. Please complete the payment.',
                    data: session.url,
                });
            } catch (error) {
                return res.status(500).json({
                    error: true,
                    msg: "Internal Server Error"
                })
            }
        }
        if (body.method === 'paypal') {
            try {
                const productId = body.items[0]?.productId;
                if (!productId) {
                    return res.status(400).json({
                        message: 'Product ID is required for PayPal payment'
                    });
                }

                let product = await Product.findById(productId);
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }

                let paypalConfig = await PaymentMethod.findOne({ type: 'paypal' });
                if (!paypalConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'PayPal configuration not found for this user',
                    });
                }

                paypal.configure({
                    'mode': paypalConfig.config.mode,
                    'client_id': paypalConfig.config.clientId,
                    'client_secret': paypalConfig.config.clientSecret
                });

                const totalAmount = (total_amount - discount_amount).toFixed(2);

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `${process.env.FRONTEND_URL}/payment/paypal/success`,
                        "cancel_url": `${process.env.FRONTEND_URL}/payment/failed`
                    },
                    "transactions": [{
                        "item_list": {
                            "items": items.map(item => ({
                                "name": item.productName,
                                "sku": item.productId,
                                "price": (item.total / item.quantity).toFixed(2),
                                "currency": body.currency || 'USD',
                                "quantity": item.quantity
                            }))
                        },
                        "amount": {
                            "currency": body.currency || 'USD',
                            "total": totalAmount
                        },
                        "description": `Order for ${body.name}`
                    }]
                };

                paypal.payment.create(create_payment_json, async (error, payment) => {
                    if (error) {
                        return res.status(500).json({
                            error: true,
                            msg: 'Error creating PayPal payment'
                        });
                    } else {
                        const order = new Order(orderData);
                        order.payment.transaction_id = payment.id;
                        order.payment.amount = totalAmount;
                        await order.save();

                        const cart = await Cart.findOne({ user: user._id });
                        if (cart) {
                            await Cart.findOneAndDelete({ _id: cart._id });
                        }

                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                return res.status(200).json({
                                    error: false,
                                    msg: 'Order created successfully. Please complete the payment.',
                                    data: payment.links[i].href
                                });
                            }
                        }
                    }
                });

            } catch (error) {
                return res.status(500).json({
                    error: true,
                    msg: "Internal Server Error"
                });
            }
        }
        if (body.method === 'sslcommerz') {
            try {
                if (body.currency.toLowerCase() !== 'bdt') {
                    return res.status(400).send({
                        error: true,
                        msg: 'SSLCommerz only supports BDT currency',
                    });
                }
                let sslCommerzConfig = await PaymentMethod.findOne({ type: 'sslcommerz' });

                if (!sslCommerzConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'SSLCommerz configuration not found for this user',
                    });
                }

                const store_id = sslCommerzConfig?.config?.clientId;
                const store_passwd = sslCommerzConfig?.config?.clientSecret;
                const is_live = sslCommerzConfig?.config?.is_live

                const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

                const data = {
                    total_amount: orderData.payment.amount,
                    currency: body.currency,
                    tran_id: uid,
                    success_url: `${process.env.BACKEND_URL}/api/order/sslcommerz/success?session_id=${uid}`,
                    fail_url: `${process.env.FRONTEND_URL}/payment/failed`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/failed`,
                    emi_option: 0,
                    cus_name: body.name,
                    cus_email: body.email,
                    cus_add1: body.location,
                    cus_city: body.city,
                    cus_postcode: body.zip_code,
                    cus_country: 'Bangladesh',
                    cus_phone: body.phone,
                    shipping_method: 'NO',
                    multi_card_name: '',
                    num_of_item: items.length,
                    product_name: items.map(item => item.productName).join(", "),
                    product_category: 'General',
                    product_profile: 'general',
                    product_amount: items.reduce((total, item) => total + item.total, 0),
                    vat: 0,
                    discount_amount: discount_amount,
                };
                const apiResponse = await sslcz.init(data);
                if (apiResponse?.GatewayPageURL) {
                    const order = new Order(orderData);
                    order.payment.transaction_id = uid;
                    await order.save();

                    const cart = await Cart.findOne({ user: user._id });
                    if (cart) {
                        await Cart.findOneAndDelete({ _id: cart._id });
                    }

                    return res.status(200).json({
                        error: false,
                        msg: 'Order created successfully. Please complete the payment.',
                        data: apiResponse?.GatewayPageURL
                    });
                } else {
                    return res.status(500).json({
                        error: true,
                        msg: 'Error creating SSLCommerz payment'
                    });
                }

            } catch (error) {
                return res.status(500).json({
                    error: true,
                    msg: "Internal Server Error"
                });

            }
        }
        if (body.method === 'razorpay') {
            try {
                const body = req.body;                
                const razorpayConfig = await PaymentMethod.findOne({ type: 'razorpay' });
                if (!razorpayConfig) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Razorpay configuration not found for this user',
                    });
                }
        
                const razorpay = new Razorpay({
                    key_id: razorpayConfig.config.clientId,
                    key_secret: razorpayConfig.config.clientSecret
                });        
                const amountInPaise = orderData.subTotal * 100; 
                const linkData = {
                    amount: amountInPaise,
                    currency: body.currency || 'INR',  
                    description: "Order Payment",
                    customer: {
                        name: user.name || 'Guest',   
                        email: user.email,
                        contact: user.phone || "+999999999999", 
                    },
                    callback_url: `${process.env.FRONTEND_URL}/payment/razorpay/success?session_id=${uid}`,
                    callback_method: 'get',
                };
        
        
                const link = await razorpay.paymentLink.create(linkData);
        
                const order = new Order(orderData);
                order.payment.transaction_id = uid;
                await order.save();
                const cart = await Cart.findOne({ user: user._id });
                if (cart) {
                    await Cart.findOneAndDelete({ _id: cart._id });
                }
                return res.status(200).json({
                    error: false,
                    msg: 'Order created successfully. Please complete the payment.',
                    data: link.short_url, 
                });
            } catch (error) {        
                return res.status(500).json({
                    error: true,
                    msg: error.message || "Internal Server Error"
                });
            }
        }
        if(body.method === 'mollie') {
            try {
                let mollieConfig = await PaymentMethod.findOne({ type: 'mollie' });

                if (!mollieConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Mollie configuration not found for this user',
                    });
                }
                const formattedPrice = orderData.payment.amount.toFixed(2);

                const mollie = Mollie({ apiKey: mollieConfig.config.clientId });
                const payment = await mollie.payments.create({
                    amount: {
                        value: formattedPrice,
                        currency: body.currency || 'EUR',
                    },
                    description: 'Payment for order',
                    redirectUrl: `${process.env.FRONTEND_URL}/payment/mollie/success?session_id=${uid}`,
                    metadata: {
                        order_id: uid,
                    },
                })
                const order = await Order.create(
                    {
                   ...orderData,
                    payment: {
                        method: 'mollie',
                        status: 'pending',
                        transaction_id: payment.id,
                        amount: total_amount - discount_amount,
                   }
                })
                const cart = await Cart.findOne({ user: user._id });
                if (cart) {
                    await Cart.findOneAndDelete({ _id: cart._id });
                }

                res.status(200).json({
                    error: false,
                    msg: 'Order created successfully. Please complete the payment.',
                    data: payment.getCheckoutUrl()
                });
                
            }catch (error) {
                return res.status(500).json({
                    error: true,
                    msg: error.message || "Internal Server Error"
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
};


// stripe payment success
export const stripePaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const session_id = query.session_id;
        if (!session_id) {
            return res.status(400).json({
                message: 'Session ID is required'
            });
        }

        let stripeConfig = await PaymentMethod.findOne({ type: 'stripe' });
        if (!stripeConfig) {
            return res.status(400).send({
                error: true,
                msg: 'Stripe configuration not found for this user',
            });
        }
        const stripeClient = new Stripe(stripeConfig?.config?.clientSecret);

        const session = await stripeClient.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({
                message: 'Session not found'
            });
        }

        const order = await Order.findOne({ 'payment.transaction_id': session_id });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        if(order.payment.status === 'completed'){
            return res.status(200).json({
                error: false,
                msg: 'Payment already completed',
                data: order
            });
        }

        order.payment.status = 'completed';
        order.status = 'accepted';
        if (order.discount_coupon) {
            await UsedCoupon.create({
                user: order.userId,
                code: order.discount_coupon,
                value: order.discount_amount,
                discount_type: 'order'
            });
        }
        await order.save();
        if(order){
            const notification = await Notification.create({
                title: "New Product Order Placed", 
                message: `A new product order has been placed.`,
                isRead: false,
                data: {
                    type: "order",
                    orderId: order._id
                }
           });
           res.locals.io.emit('newNotification', { notification: notification });
        }
        return res.status(200).json({
            error: false,
            msg: 'Payment successful',
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
}

//stripe payment cancel
export const stripePaymentCancel = async (req, res) => {
    try {
        const { query } = req;
        const session_id = query.session_id;
        if (!session_id) {
            return res.status(400).json({
                message: 'Session ID is required'
            });
        }

        const order = await Order.findOne({ 'payment.transaction_id': session_id });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            error: false,
            msg: 'Payment cancelled',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        })
    }
}

//paypal payment success
export const paypalPaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const paymentId = query.paymentId;
        const payerId = query.payerId;
        if (!paymentId || !payerId) {
            return res.status(400).json({
                message: 'Payment ID and Payer ID are required'
            });
        }

        let paypalConfig = await PaymentMethod.findOne({ type: 'paypal' });
        if (!paypalConfig) {
            return res.status(400).send({
                error: true,
                msg: `PayPal configuration not found`,
            });

        }

        const order = await Order.findOne({ 'payment.transaction_id': paymentId });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        if(order.payment.status === 'completed'){
            return res.status(200).json({
                error: false,
                msg: 'Payment already completed',
                data: order
            });
        }

        order.payment.status = 'completed';
        order.status = 'accepted';

        await order.save();
        if(order){
            const notification = await Notification.create({
                title: "New Product Order Placed", 
                message: `A new product order has been placed.`,
                isRead: false,
                data: {
                    type: "order",
                    orderId: order._id
                }
           });
           res.locals.io.emit('newNotification', { notification: notification });
        }

        return res.status(200).json({
            error: false,
            msg: 'Payment successful',
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
}

export const paypalPaymentCancel = async (req, res) => {
    try {
        const { query } = req;
        const paymentId = query.paymentId;
        const token = query.token;
        if (!paymentId) {
            return res.status(400).json({
                message: 'Payment ID is required'
            });
        }

        const order = await Order.findOne({ 'payment.transaction_id': paymentId });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        order.cancel_token = token;
        await order.save();

        return res.status(200).json({
            error: false,
            msg: 'Payment cancelled',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        })
    }
}

// user order list
export const orderList = async (req, res) => {
    try {
        const { query } = req;
        const userId = res.locals.user._id;

        const filter = { userId: userId };

        if (query.status) {
            filter['status'] = query.status;
        }

        if (query.search && query.langCode) {
            const langCode = query.langCode;
            filter[`name.${langCode}`] = { $regex: query.search, $options: 'i' };
        }

        const orders = await Order.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            lean: true,
            populate: {
                path: 'items.productId',
                select: 'name short_description thumbnail_image category variants',
                populate: {
                    path: 'category',
                    select: 'name -_id'
                }
            }
        });
        // Transform the orders data similarly to wishlist
        const cleanedDocs = await Promise.all(orders.docs.map(async (order) => {
            const transformedItems = await Promise.all(order.items.map(async (item) => {
                let variantData = null;

                // If the variant exists, fetch the variant details from the product
                if (item.variantId) {
                    const product = await Product.findById(item.productId._id).lean();
                    variantData = product.variants.find(v => v._id.toString() === item.variantId.toString());
                }

                return {
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    quantity: item.quantity,
                    category: item.productId.category.name,
                    thumbnail_image: item.productId.thumbnail_image,
                    is_active: item.productId.is_active,
                    variant: variantData ? {
                        _id: variantData._id,
                        name: variantData.name,
                        price: variantData.price,
                        in_stock: variantData.in_stock
                    } : null,
                    total: item.total
                };
            }));

            return {
                _id: order._id,
                uid: order.uid,
                user: order.userId,
                items: transformedItems,
                subTotal: order.subTotal,
                status: order.status,
                payment: order.payment,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        }));

        const cleanedResponse = {
            ...orders,
            docs: cleanedDocs
        };
        return res.status(200).json({
            error: false,
            data: cleanedResponse
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// user order details
export const orderDetails = async (req, res) => {
    try {
        const { _id } = req.query;
        const userId = res.locals.user._id;

        // Find the order by ID and ensure it belongs to the user
        const order = await Order.findOne({ _id: _id, userId: userId })
            .populate({
                path: 'items.productId',
                select: 'name short_description thumbnail_image category variants location city zip_code',
                populate: {
                    path: 'category',
                    select: 'name -_id'
                }
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                error: true,
                msg: 'Order not found'
            });
        }

        const transformedItems = await Promise.all(order.items.map(async (item) => {
            let variantData = null;

            // If the variant exists, fetch the variant details from the product
            if (item.variantId) {
                const product = await Product.findById(item.productId._id).lean();
                variantData = product.variants.find(v => v._id.toString() === item.variantId.toString());
            }

            return {
                _id: item.productId._id,
                name: item.productId.name,
                price: item.price,
                quantity: item.quantity,
                category: item.productId.category.name,
                thumbnail_image: item.productId.thumbnail_image,
                is_active: item.productId.is_active,
                variant: variantData ? {
                    _id: variantData._id,
                    name: variantData.name,
                    price: variantData.price,
                    in_stock: variantData.in_stock
                } : null,
                total: item.total
            };
        }));
        const cleanedOrder = {
            _id: order._id,
            uid: order.uid,
            user: order.userId,
            items: transformedItems,
            subTotal: order.subTotal,
            status: order.status,
            payment: order.payment,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        return res.status(200).json({
            error: false,
            data: cleanedOrder
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// admin order list
export const adminOrderList = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};

        if (!!query.search) {
            filter[`uid`] = { $regex: `${query.search}`, $options: 'i' };
        }

        if (!!query.status) {
            filter['status'] = query.status;
        }

        const orders = await Order.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            lean: true,
            populate: [
                {
                    path: 'items.productId',
                    select: 'name short_description thumbnail_image category variants',
                    populate: {
                        path: 'category',
                        select: 'name -_id'
                    }
                },
                {
                    path: 'userId',
                    select: 'name email phone'
                }
            ]
        });

        const cleanedDocs = await Promise.all(orders.docs.map(async (order) => {
            const transformedItems = await Promise.all(order.items.map(async (item) => {
                let variantData = null;

                // If the variant exists, fetch the variant details from the product
                if (item.variantId) {
                    const product = await Product.findById(item.productId._id).lean();
                    variantData = product.variants.find(v => v._id.toString() === item.variantId.toString());
                }

                return {
                    _id: item.productId?._id,
                    name: item.productId?.name,
                    price: item.productId?.price,
                    quantity: item.quantity,
                    category: item.productId?.category?.name,
                    thumbnail_image: item.productId?.thumbnail_image,
                    is_active: item.productId?.is_active,
                    variant: variantData ? {
                        _id: variantData._id,
                        name: variantData.name,
                        price: variantData.price,
                        in_stock: variantData.in_stock
                    } : null,
                    total: item.total
                };
            }));

            return {
                _id: order._id,
                uid: order.uid,
                user: order.userId ? {
                    _id: order.userId._id,
                    name: order.userId.name,
                    email: order.userId.email,
                    phone: order.userId.phone
                } : null,
                items: transformedItems,
                subTotal: order.subTotal,
                status: order.status,
                payment: order.payment,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        }));

        const cleanedResponse = {
            ...orders,
            docs: cleanedDocs
        };

        return res.status(200).json({
            error: false,
            msg: "Order List fetched successfully",
            data: cleanedResponse
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// admin order details
export const adminOrderDetails = async (req, res) => {
    try {
        const { _id } = req.query;

        // Find the order by ID and ensure it belongs to the user
        const order = await Order.findOne({ _id: _id })
            .populate({
                path: 'items.productId',
                // select: 'name short_description thumbnail_image category variants',
                populate: {
                    path: 'category',
                    select: 'name -_id'
                }
            })
            .populate({
                path: 'userId',
                select: 'name email phone'
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                error: true,
                msg: 'Order not found'
            });
        }

        const transformedItems = await Promise.all(order.items.map(async (item) => {
            let variantData = null;

            // If the variant exists, fetch the variant details from the product
            if (item.variantId) {
                const product = await Product.findById(item.productId._id).lean();
                variantData = product.variants.find(v => v._id.toString() === item.variantId.toString());
            }

            return {
                _id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
                category: item.productId.category.name,
                thumbnail_image: item.productId.thumbnail_image,
                is_active: item.productId.is_active,
                location: item.location,
                city: item.city,
                zip_code: item.zip_code,
                variant: variantData ? {
                    _id: variantData._id,
                    name: variantData.name,
                    price: variantData.price,
                    in_stock: variantData.in_stock
                } : null,

                total: item.total
            };
        }));

        const cleanedOrder = {
            _id: order._id,
            uid: order.uid,
            user: order.userId,
            items: transformedItems,
            subTotal: order.subTotal,
            status: order.status,
            payment: order.payment,
            location: order.location,
            city: order.city,
            zip_code: order.zip_code,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
        return res.status(200).json({
            error: false,
            data: cleanedOrder
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

// change order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: true,
                msg: 'Invalid status provided. Valid statuses are pending, accepted, completed, or cancelled.'
            });
        }

        const order = await Order.findById(orderId).populate('items.productId');

        if (!order) {
            return res.status(404).json({
                error: true,
                msg: 'Order not found'
            });
        }

        if (order.status === 'completed') {
            return res.status(400).json({
                error: true,
                msg: 'Order already completed'
            });
        }

        if (order.status === status) {
            return res.status(400).json({
                error: true,
                msg: `Order already ${status}`
            });
        }

        // Update product quantities based on the new status
        if (status === 'accepted' && order.status !== 'accepted') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId._id);
                if (product) {
                    product.quantity -= item.quantity;
                    await product.save();
                }
            }
        } else if (status === 'cancelled' && order.status === 'accepted') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId._id);
                if (product) {
                    product.quantity += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            error: false,
            msg: 'Order status updated successfully'
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// sslcommerzesucces
export const sslCommerzPaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const session_id = query.session_id;
        if (!session_id) {
            return res.status(400).json({
                message: 'Session ID is required'
            });
        }

        let sslCommerzConfig = await PaymentMethod.findOne({ type: 'sslcommerz' });
        if (!sslCommerzConfig) {
            return res.status(400).send({
                error: true,
                msg: 'SSLCommerz configuration not found for this user',
            });
        }

        const order = await Order.findOne({ 'payment.transaction_id': session_id });
        if (!order) {
            return res.status(400).send({
                error: true,
                msg: 'Order not found for this payment',
            });
        }
        if(order.payment.status === 'completed'){
            return res.status(200).json({
                error: false,
                msg: 'Payment already completed',
                data: order
            });
        }

        order.payment.status = 'completed';
        order.status = 'accepted';

        if (order.discount_coupon) {
            await UsedCoupon.create({
                user: order.userId,
                code: order.discount_coupon,
                value: order.discount_amount,
                discount_type: 'order'
            });
        }

        await order.save();
        if(order){
            const notification = await Notification.create({
                title: "New Product Order Placed", 
                message: `A new product order has been placed.`,
                isRead: false,
                data: {
                    type: "order",
                    orderId: order._id
                }
           });
           res.locals.io.emit('newNotification', { notification: notification });
        }
        const redirect_url = `${process.env.FRONTEND_URL}/payment/sslcommerz/success?session_id=${order.uid}`
        return res.redirect(redirect_url);

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
};

// razorpay payment success
export const razorpayPaymentSuccess = async (req, res) => {
    try {
        const { session_id, razorpay_payment_id, razorpay_signature } = req.query;
        if (!razorpay_payment_id || !razorpay_signature) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid payment details'
            });
        }
        let order = await Order.findOne({ 'payment.transaction_id': session_id });
        if (!order) {
            return res.status(400).send({
                error: true,
                msg: 'Order not found for this payment'
            });
        }
        if(order.payment.status === 'completed'){
            return res.status(400).send({
                error: true,
                msg: 'Payment already completed'
            });
        }
        // Retrieve Razorpay configuration details
        let razorpayConfig = await PaymentMethod.findOne({ type: 'razorpay' });

        if (!razorpayConfig || !razorpayConfig.config) {
            return res.status(400).send({
                error: true,
                msg: `Razorpay configuration not found`,
            });
        }

        const razorpayClient = new Razorpay({
            key_id: razorpayConfig.config.clientId,
            key_secret: razorpayConfig.config.clientSecret
        });

        const paymentIntent = await razorpayClient.payments.fetch(razorpay_payment_id);

        if (paymentIntent.status !== 'captured') {
            return res.status(400).send(`Invalid payment status`);
        }
        if(order.payment.status === 'completed'){
            return res.status(200).json({
                error: false,
                msg: 'Payment already completed',
                data: order
            });
        }
        order.payment.status = 'completed';
        order.status = 'accepted';
        await order.save();
        if(order){
            const notification = await Notification.create({
                title: "New Product Order Placed", 
                message: `A new product order has been placed.`,
                isRead: false,
                data: {
                    type: "order",
                    orderId: order._id
                }
           });
           res.locals.io.emit('newNotification', { notification: notification });
        }
        return res.status(200).json({
            error: false,
            msg: 'Payment successful',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
}


// mollie payment success
export const molliePaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const { session_id } = query;
        if (!session_id) {
            return res.status(400).json({
                message: 'Session ID is required'
            });
        }
        const order = await Order.findOne({ 'uid': session_id });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        if(order.payment.status === 'completed'){
            return res.status(400).send({
                error: true,
                msg: 'Payment already completed'
            });
        }
        
        order.payment.status = 'completed';
        order.status = 'accepted';
        await order.save();
        if(order){
            const notification = await Notification.create({
                title: "New Product Order Placed", 
                message: `A new product order has been placed.`,
                isRead: false,
                data: {
                    type: "order",
                    orderId: order._id
                }
           });
           res.locals.io.emit('newNotification', { notification: notification });
        }
        return res.status(200).json({
            error: false,
            msg: 'Payment successful',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: error.message
        });
    }
}
