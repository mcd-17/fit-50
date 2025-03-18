import Stripe from "stripe";
import Currency from "../models/currency.model";
import PaymentMethod from "../models/paymentMethod.model";
import Subscription from "../models/subscription.model";
import User from "../models/user.model";
import UserSubscription from "../models/userSubscription.model";
import { generateUid } from "../utils/helpers";
import paypal from "paypal-rest-sdk";
import mongoose from "mongoose";
import SSLCommerzPayment from 'sslcommerz-lts'
import Razorpay from "razorpay";
import Mollie from '@mollie/api-client';
import Notification from "../models/notification.model";

// buy subscription
export const buySubscription = async (req, res) => {
    try {
        const { body } = req;
        const currency = await Currency.findOne({ code: body.currency });
        let user = await User.findOne({ _id: res.locals.user._id });

        let subscriptionData = await Subscription.findById(body.subscriptionID);
        if (!subscriptionData) {
            return res.status(400).send({
                error: true,
                msg: 'Subscription not found'
            });
        }

        const productName = subscriptionData?.name?.get(body.langCode) || "Basic";

        let subsPrice;
        if (body.planType === 'monthly') {
            subsPrice = subscriptionData.monthly_price * currency.rate;
        } else if (body.planType === 'yearly') {
            subsPrice = subscriptionData.yearly_price * currency.rate;
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Invalid plan type. Please choose either monthly or yearly.'
            });
        }
        let subsCurrency = body.currency;
        if (body.method === 'stripe') {
            // Stripe payment logic
            try {
                let uid = await generateUid('S-', UserSubscription);
                let stripeConfig = await PaymentMethod.findOne({ type: 'stripe' });
                if (!stripeConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Stripe configuration not found for this user',
                    });
                }
                const stripeClient = new Stripe(stripeConfig?.config?.clientSecret);
                const amountInCents = Math.round(parseFloat(subsPrice) * 100);

                const successUrl = `${process.env.FRONTEND_URL}/subscription/stripe/success?session_id={CHECKOUT_SESSION_ID}`;
                const cancelUrl = `${process.env.FRONTEND_URL}/subscription/failed`;

                const session = await stripeClient.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: body.currency,
                                product_data: { name: productName },
                                unit_amount: amountInCents,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                });

                // Create new subscription for user
                const userSubs = await UserSubscription.create({
                    uid: uid,
                    user: user._id,
                    currency: currency.symbol,
                    subscription: subscriptionData._id,
                    price: subsPrice,
                    active: false,
                    type: subscriptionData.plan_type,
                    payment: {
                        method: 'stripe',
                        status: 'pending',
                        transaction_id: session.id,
                        amount: subsPrice,
                    },
                    subscription_type: body.planType,
                    end_date: body.planType === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
                });
                return res.status(200).send({
                    error: false,
                    msg: 'Payment created successfully',
                    data: session.url,
                });

            } catch (e) {
                return res.status(500).send({
                    error: true,
                    msg: e.message,
                });
            }
        }
        if (body.method === 'paypal') {
            // PayPal payment logic
            try {
                let uid = await generateUid('P-', UserSubscription);
                let paypalConfig = await PaymentMethod.findOne({ type: 'paypal' });

                if (!paypalConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Paypal configuration not found for this user',
                    });
                }

                let config = {
                    'mode': paypalConfig.config.mode, // sandbox or live
                    'client_id': paypalConfig.config.clientId,
                    'client_secret': paypalConfig.config.clientSecret
                };
                paypal.configure(config);

                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `${process.env.FRONTEND_URL}/subscription/paypal/success`,
                        "cancel_url": `${process.env.FRONTEND_URL}/subscription/failed`
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": productName,
                                "sku": subscriptionData._id,
                                "price": subsPrice.toString(),
                                "currency": body.currency || 'USD',
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": body.currency || 'USD',
                            "total": subsPrice.toString()
                        },
                        "description": `Subscription for ${productName}`
                    }]
                };

                paypal.payment.create(create_payment_json, async function (error, payment) {
                    if (error) {
                        return res.status(500).send({
                            error: true,
                            msg: "Invalid Currency or Payment issue",
                        });
                    } else {
                        const userSubs = await UserSubscription.create({
                            uid: uid,
                            user: user._id,
                            currency: currency.symbol,
                            subscription: subscriptionData._id,
                            price: subsPrice,
                            active: false,
                            type: subscriptionData.plan_type,
                            payment: {
                                method: 'paypal',
                                status: 'pending',
                                transaction_id: payment.id,
                                amount: subsPrice,
                            },
                            end_date: body.planType === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        });

                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                return res.status(200).send({
                                    error: false,
                                    msg: 'Payment created successfully',
                                    data: payment.links[i].href,
                                });
                            }
                        }
                    }
                });

            } catch (error) {
                return res.status(500).send({
                    error: true,
                    msg: error.message,
                });
            }
        }
        if (body.method === 'sslcommerz') {
            // SSLCommerz payment logic
            try {
                if (body.currency.toLowerCase() !== 'bdt') {
                    return res.status(400).send({
                        error: true,
                        msg: 'SSLCommerz only supports BDT currency',
                    });
                }

                let uid = await generateUid('S-', UserSubscription);
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

                const customerAddress = user.address || user.address || 'N/A';

                const data = {
                    total_amount: parseFloat(subsPrice),
                    currency: 'BDT',
                    tran_id: uid,
                    success_url: `${process.env.BACKEND_URL}/api/subscription/sslcommerz/success?session_id=${uid}`,
                    fail_url: `${process.env.FRONTEND_URL}/api/subscription/sslcommerz/cancel`,
                    cancel_url: `${process.env.FRONTEND_URL}/api/subscription/sslcommerz/cancel`,
                    shipping_method: 'No',
                    product_name: productName,
                    product_category: 'Subscription',
                    product_profile: 'general',
                    cus_name: user.name,
                    cus_email: user.email,
                    cus_add1: customerAddress,
                    cus_city: user.city || 'N/A',
                    cus_state: user.state || 'N/A',
                    cus_postcode: user.postcode || 'N/A',
                    cus_country: user.country || 'Bangladesh',
                    cus_phone: user.phone || 'N/A',
                };

                const apiResponse = await sslcz.init(data);

                if (apiResponse?.GatewayPageURL) {
                    const userSubs = await UserSubscription.create({
                        uid: uid,
                        user: user._id,
                        subscription: subscriptionData._id,
                        price: subsPrice,
                        currency: currency.symbol,
                        subscription_type: body.planType,
                        active: false,
                        type: subscriptionData.plan_type,
                        payment: {
                            method: 'sslcommerz',
                            status: 'pending',
                            transaction_id: uid,
                            amount: subsPrice,
                        },
                        end_date: body.planType === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1)),

                    });

                    //send notification to admin
                    // const admins = await User.find({ role: 'admin' }).select('uid')

                    // admins.forEach(async admin => {
                    //     await createNotification(
                    //         admin._id,
                    //         res?.locals?.user?._id,
                    //         "payment",
                    //         "New Subscription Added",
                    //         `A new subscription has been successfully subscribed by the SSLCommerz`,
                    //         userSubs._id
                    //     )
                    // })

                    return res.status(200).send({
                        error: false,
                        msg: 'Payment created successfully',
                        data: apiResponse.GatewayPageURL,
                    });
                } else {
                    return res.status(400).send({
                        error: true,
                        msg: 'SSLCommerz session was not created',
                    });
                }
            } catch (e) {
                return res.status(500).send({
                    error: true,
                    msg: e.message,
                });
            }
        }
        if (body.method === 'razorpay') {
            try {
                let uid = await generateUid('S-', UserSubscription);
                let razorpayConfig = await PaymentMethod.findOne({ type: 'razorpay' });
                if (!razorpayConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Razorpay configuration not found',
                    });
                }
                const razorpay = new Razorpay({
                    key_id: razorpayConfig.config.clientId,
                    key_secret: razorpayConfig.config.clientSecret
                });

                let link = await razorpay.paymentLink.create({
                    amount: subsPrice * 100,
                    currency: body.currency,
                    description: "Subscription Payment",
                    customer: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone ? user.phone : "+999999999999",
                    },
                    callback_url: `${process.env.FRONTEND_URL}/subscription/razorpay/success?session_id=${uid}`,
                    callback_method: 'get',
                });

                const userSubs = await UserSubscription.create({
                    uid: uid,
                    user: user._id,
                    subscription: subscriptionData._id,
                    price: subsPrice,
                    currency: currency.symbol,
                    subscription_type: body.planType,
                    active: false,
                    type: subscriptionData.plan_type,
                    payment: {
                        method: 'razorpay',
                        status: 'pending',
                        transaction_id: uid,
                        amount: subsPrice,
                    },
                    end_date: body.planType === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
                });

                return res.status(200).send({
                    error: false,
                    msg: 'Payment link created successfully',
                    data: link.short_url,
                });

            } catch (e) {
                return res.status(500).send({
                    error: true,
                    msg: e?.description || 'Invalid Currency',
                });
            }
        }
        if (body.method === 'mollie') {
            try {
                let uid = await generateUid('tr_', UserSubscription);
                let mollieConfig = await PaymentMethod.findOne({ type: 'mollie' });

                if (!mollieConfig) {
                    return res.status(400).send({
                        error: true,
                        msg: 'Mollie configuration not found for this user',
                    });
                }
                const formattedPrice = parseFloat(subsPrice).toFixed(2);

                const mollie = Mollie({ apiKey: mollieConfig.config.clientId });
                const payment = await mollie.payments.create({
                    amount: {
                        currency: body?.currency || 'USD',
                        value: formattedPrice,
                    },
                    description: `Subscription for ${productName}`,
                    redirectUrl: `${process.env.FRONTEND_URL}/subscription/mollie/success?session_id=${uid}`,
                    // webhookUrl: `${process.env.FRONTEND_URL}/api/subscription/mollie/webhook`,
                });
                const userSubs = await UserSubscription.create({
                    uid: uid,
                    user: user._id,
                    subscription: subscriptionData._id,
                    price: subsPrice,
                    currency: currency.symbol,
                    subscription_type: body.planType,
                    active: false,
                    type: subscriptionData.plan_type,
                    payment: {
                        method: 'mollie',
                        status: 'pending',
                        transaction_id: payment?.id,
                        amount: subsPrice,
                    },
                    end_date: body.planType === 'yearly' ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
                })
                return res.status(200).send({
                    error: false,
                    msg: 'Payment created successfully',
                    data: payment.getCheckoutUrl(),
                });
            } catch (e) {
                return res.status(500).send({
                    error: true,
                    msg: e?.description || 'Invalid Currency',
                });
            }
        }

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: e.message
        });
    }
};






export const stripePaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const paymentMethod = await PaymentMethod.findOne({ type: 'stripe' });
        if (!paymentMethod) {
            return res.status(400).send({
                error: true,
                msg: 'Stripe configuration not found for this user',
            });
        }
        const stripeClient = new Stripe(paymentMethod?.config?.clientSecret);

        const session = await stripeClient.checkout.sessions.retrieve(query.session_id);

        let userSubs = await UserSubscription.findOne({ 'payment.transaction_id': session.id });
        if (!userSubs) {
            return res.status(400).send({
                error: true,
                msg: 'Subscription not found for this payment',
            });
        }

        if (userSubs.payment.status === 'paid') {
            return res.status(400).send({
                error: true,
                msg: 'Payment already processed',
            });
        }

        await UserSubscription.updateMany(
            { user: userSubs.user, active: true },
            { $set: { active: false } }
        );

        userSubs.active = true;
        userSubs.payment.status = 'paid';
        userSubs.start_date = new Date();
        if (userSubs.subscription_type === 'monthly') {
            userSubs.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
        } else if (userSubs.subscription_type === 'yearly') {
            userSubs.end_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        }
        await userSubs.save();
        let user = await User.findById(userSubs.user);
        const notification = await Notification.create({
            title: 'New Subscription Purchased',
            message: `${user.name} has purchased a new subscription.`,
            isRead: false,
            data: {
                type: 'subscription',
                _id: userSubs._id,
                user: user._id,
            },
        });
        res.locals.io.emit('newNotification', { notification });

        return res.status(200).send({
            error: false,
            msg: 'Payment successful',
            data: userSubs,
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: error.message,
        });
    }
};

export const getSubscriptionStripePaymentCancel = async (req, res) => {
    try {
        return res.status(200).send(`Stripe payment cancelled`);
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const paypalPaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const { paymentId, PayerID } = query;
        let subscription = await UserSubscription.findOne({
            'payment.transaction_id': paymentId,
        });

        if (!subscription) {
            return res.status(404).json({
                message: 'Invalid payment ID',
            });
        }
        if (subscription.payment.status === 'paid') {
            return res.status(400).send({
                error: true,
                msg: 'Payment already processed',
            });
        }

        let paypalConfig = await PaymentMethod.findOne({ type: 'paypal' });
        if (!paypalConfig) {
            return res.status(400).send({
                error: true,
                msg: `PayPal configuration not found`,
            });
        }

        paypal.configure({
            'mode': paypalConfig.config.mode,
            'client_id': paypalConfig.config.clientId,
            'client_secret': paypalConfig.config.clientSecret
        });

        const execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": subscription.price.toString()
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error) {
                return res.status(500).send({
                    error: true,
                    msg: error.response
                });
            } else {
                await UserSubscription.updateMany(
                    { user: subscription.user, active: true },
                    { $set: { active: false } }
                );

                subscription.active = true;
                subscription.payment.status = 'paid';
                subscription.payment.method = 'paypal';
                subscription.start_date = new Date();
                if (subscription.subscription_type === 'monthly') {
                    subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
                } else if (subscription.subscription_type === 'yearly') {
                    subscription.end_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                }
                await subscription.save();
                let user = await User.findById(subscription.user);
                const notification = await Notification.create({
                    title: 'New Subscription Purchased',
                    message: `${user.name} has purchased a new subscription.`,
                    isRead: false,
                    data: {
                        type: 'subscription',
                        _id: subscription._id,
                        user: user._id,
                    },
                });
                res.locals.io.emit('newNotification', { notification });
                return res.status(200).send({
                    error: false,
                    msg: 'Payment successful',
                    data: subscription
                });
            }
        });

    } catch (error) {
        res.status(500).send({
            error: true,
            msg: error.message
        });
    }
};

export const getSubscriptionPaypalPaymentCancel = async (req, res) => {
    try {
        return res.status(200).send(`Paypal payment cancelled`);
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const SSLCommerzPaymentSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).send({
                error: true,
                msg: 'Missing session_id in the query parameters',
            });
        }
        const subscription = await UserSubscription.findOne({ 'payment.transaction_id': session_id });
        if (!subscription) {
            return res.status(400).send({
                error: true,
                msg: 'Subscription not found for this payment',
            });
        }
        if (subscription.payment.status === 'paid') {
            return res.status(400).send({
                error: true,
                msg: 'Payment already processed',
            });
        }
        await UserSubscription.updateMany(
            { user: subscription.user, active: true },
            { $set: { active: false } }
        );

        subscription.active = true;
        subscription.payment.status = 'paid';
        subscription.payment.method = 'sslcommerz';
        subscription.start_date = new Date();
        if (subscription.subscription_type === 'monthly') {
            subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
        } else if (subscription.subscription_type === 'yearly') {
            subscription.end_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        }
        await subscription.save();
        let user = await User.findById(subscription.user);
        const notification = await Notification.create({
            title: 'New Subscription Purchased',
            message: `${user.name} has purchased a new subscription.`,
            isRead: false,
            data: {
                type: 'subscription',
                _id: subscription._id,
                user: user._id,
            },
        });
        res.locals.io.emit('newNotification', { notification });
        const redirect_url = `${process.env.FRONTEND_URL}/subscription/sslcommerz/success?session_id=${subscription.uid}`
        return res.redirect(redirect_url);
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}

export const getSubscriptionRazorpayPaymentSuccess = async (req, res) => {
    try {
        const { session_id, razorpay_payment_id, razorpay_signature } = req.query;

        if (!razorpay_payment_id || !razorpay_signature) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid payment details'
            });
        }

        const user = res.locals.user._id;

        let subscription = await UserSubscription.findOne({
            'uid': session_id,
        });

        if (!subscription || subscription.payment.status === 'paid') {
            return res.status(400).send({
                error: true,
                msg: `Payment already done or Invalid session ID`
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
        subscription.active = true;
        subscription.payment.status = 'paid';
        subscription.payment.method = 'razorpay';
        subscription.start_date = new Date();
        if (subscription.subscription_type === 'monthly') {
            subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
        } else if (subscription.subscription_type === 'yearly') {
            subscription.end_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        }
        await subscription.save();
        let user2 = await User.findById(subscription.user);
        const notification = await Notification.create({
            title: 'New Subscription Purchased',
            message: `${user2.name} has purchased a new subscription.`,
            isRead: false,
            data: {
                type: 'subscription',
                _id: subscription._id,
                user: user2._id,
            },
        });
        res.locals.io.emit('newNotification', { notification });

        return res.status(200).send({
            error: false,
            msg: 'Payment successful',
            data: subscription
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        });
    }
}
export const molliePaymentSuccess = async (req, res) => {
    try {
        const { query } = req;
        const userId = res.locals.user._id;
        const { session_id } = query;

        let subscription = await UserSubscription.findOne({ 'uid': session_id });

        if (!subscription || subscription.payment.status === 'paid') {
            return res.status(400).send({
                error: true,
                msg: 'Payment already done or Invalid session ID',
            });
        }

        let mollieConfig = await PaymentMethod.findOne({ type: 'mollie' });
        if (!mollieConfig) {
            return res.status(400).send({
                error: true,
                msg: 'Mollie configuration not found',
            });
        }

        const mollie = Mollie({ apiKey: mollieConfig.config.clientId });

        const payment = await mollie.payments.get(subscription.payment.transaction_id);

        if (payment.status === 'paid') {
            await UserSubscription.updateMany(
                { user: userId, active: true },
                { $set: { active: false } }
            );

            subscription.payment.status = 'paid';
            subscription.active = true;
            await subscription.save();
            let user = await User.findById(subscription.user);
            const notification = await Notification.create({
                title: 'New Subscription Purchased',
                message: `${user.name} has purchased a new subscription.`,
                isRead: false,
                data: {
                    type: 'subscription',
                    _id: subscription._id,
                    user: user._id,
                },
            });
            res.locals.io.emit('newNotification', { notification });

            return res.status(200).send({
                error: false,
                msg: 'Payment successful',
            });
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error',
        });
    }
};


export const getUserSubscriptionHistory = async (req, res) => {
    try {
        let user = await User.findOne({ _id: res.locals.user._id })
        let data = await UserSubscription.aggregatePaginate([
            { $match: { user: new mongoose.Types.ObjectId(user._id) } },
            { $lookup: { from: 'subscriptions', localField: 'subscription', foreignField: '_id', as: 'subscription' } },
            { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    uid: 1,
                    subscription: {
                        _id: '$subscription._id',
                        name: '$subscription.name',
                    },
                    credits: 1,
                    price: 1,
                    active: 1,
                    type: 1,
                    payment: 1,
                    createdAt: 1,
                    currency: 1,
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 }
        ])
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets Subscriptions',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const allSubscriptionHistoryAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const filters = {};
        if (search) {
            filters[`uid`] = { $regex: `${search}`, $options: 'i' };
        }

        const aggregationPipeline = [
            { $lookup: { from: 'subscriptions', localField: 'subscription', foreignField: '_id', as: 'subscription' } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$subscription', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    uid: 1,
                    subscription: {
                        _id: '$subscription._id',
                        name: '$subscription.name',
                    },
                    credits: 1,
                    price: 1,
                    active: 1,
                    type: 1,
                    payment: 1,
                    start_date: 1,
                    end_date: 1,
                    currency: 1,
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        email: '$user.email',
                        role: '$user.role'
                    },
                    createdAt: 1
                }
            },
            { $match: filters },
            { $sort: { createdAt: -1 } }
        ];

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10)
        };

        const data = await UserSubscription.aggregatePaginate(aggregationPipeline, options);

        return res.status(200).send({
            error: false,
            msg: 'Successfully retrieved subscriptions',
            data
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};


export const adminAddSubscriptionForUser = async (req, res) => {
    try {
        const { subscription: subscriptionId, user: userId, paymentMethod, subscriptionType } = req.body;
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(400).send({
                error: true,
                msg: 'Subscription not found',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found',
            });
        }

        const startDate = new Date();
        let endDate;
        if (subscriptionType === 'monthly') {
            endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        } else if (subscriptionType === 'yearly') {
            endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Invalid subscription type',
            });
        }

        const newSubscription = await UserSubscription.create({
            uid: `${userId}-${subscriptionId}-${Date.now()}`, 
            user: userId,
            subscription: subscriptionId,
            currency: req.body.currency,
            price: subscriptionType === 'monthly' ? subscription.monthly_price : subscription.yearly_price,
            active: true,
            payment: {
                method: paymentMethod ? paymentMethod : "cash",
                status: 'paid', 
                amount: subscriptionType === 'monthly' ? subscription.monthly_price : subscription.yearly_price,
                ref: res.locals.user._id
            },
            subscription_type: subscriptionType,
            start_date: new Date(),
            end_date: endDate,
        });

        return res.status(200).send({
            error: false,
            msg: 'Successfully added subscription to user',
            data: newSubscription,
        });
    } catch (error) {
        console.error("Error in adminAddSubscriptionForUser:", error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error",
        });
    }
};
