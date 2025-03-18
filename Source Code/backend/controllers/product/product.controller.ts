import { s3DeleteFiles } from "../../utils/s3bucket";
import Product from "../../models/product/product.model";
import ProductCategory from "../../models/product/category.model";
import Cart from "../../models/product/cart.model";
import ProductReview from "../../models/product/review.model";
import Order from "../../models/product/order.model";


// product list
export const getProductListAdmin = async (req, res) => {
    try {
        const { query } = req;
        const filter = {}

        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        const data = await Product.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: '-createdAt',
            select: ('-__v -variants -updatedAt -description -short_description'),
            populate: [
                { path: 'category', select: '-__v -createdAt -updatedAt' },
            ]
        })
        return res.status(200).send({
            error: false,
            msg: "Products fetched successfully",
            data: data
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// create a new product
export const addProduct = async (req, res) => {
    try {
        const { body } = req;
        const languageKeys = Object.keys(body.name);

        const query = languageKeys.map((lang) => {
            return { [`name.${lang}`]: body.name[lang] };
        });

        const exist = await Product.findOne({
            $or: query
        });
        if (exist) {
            return res.status(400).send({
                error: true,
                msg: `Product already exists`
            });
        }
        if(!body.category){
            return res.status(400).send({
                error: true,
                msg: `Please select a category`
            });
        }

        const newProduct = await Product(body)

        await newProduct.save();

        return res.status(200).send({
            error: false,
            msg: 'Product has been created successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

// update product
export const updateProduct = async (req, res) => {
    try {
        const { body } = req;
        const product = await Product.findById(body?._id);
        if (!product) {
            return res.status(404).send({
                error: true,
                msg: "Product not found"
            });
        }

        const languageKeys = Object.keys(body.name);
        const query = languageKeys.map((lang) => {
            return { [`name.${lang}`]: body.name[lang] };
        });

        const exist = await Product.findOne({
            $or: query,
            _id: { $ne: body._id }
        });

        if (exist) {
            return res.status(400).send({
                error: true,
                msg: `Product already exists`
            });
        }

        // Check if the image has changed and delete the old one if necessary
        if (body.thumbnail_image && body.thumbnail_image !== product.thumbnail_image) {
            try {
                await s3DeleteFiles([product.thumbnail_image]);
            } catch (err) {
                console.error("Error deleting old thumbnail:", err);
            }
        }

        const updateData = { ...body };
        if (!body.variants) {
            updateData.variants = [];
        }

        console.log("Updating product with data:", updateData); // Debug log
        await Product.findByIdAndUpdate(body._id, updateData);

        return res.status(200).send({
            error: false,
            msg: 'Product has been updated successfully',
        });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};




// toggle product publish using in_stock
export const toggleProductPublish = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById({ _id: productId });

        if (!product) {
            return res.status(404).send({
                error: true,
                msg: 'Product not found'
            });
        }

        product.is_active = !product.is_active;
        // Save the updated product
        await product.save();
        return res.status(200).send({
            error: false,
            msg: `Product has been ${product.is_active ? 'published' : 'unpublished'} successfully`,
            data: product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

// delete product
export const deleteProduct = async (req, res) => {
    try {
        let { query } = req
        let data = await Product.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Product not found'
            })
        }
        await Product.findOneAndDelete({ _id: query._id })
        if (!!data?.image) {
            await s3DeleteFiles([data?.image])
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted Product'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// product list for user
export const getProductList = async (req, res) => {
    try {
        const { query } = req;
        const filter = {
            is_active: true,
            quantity: { $gt: 0 }
        };

        const langCode = query.langCode || 'en';

        // Search by category name
        if (query.category) {
            const categories = await ProductCategory.find({
                [`name.${langCode}`]: { $regex: new RegExp(query.category.toLowerCase(), "i") }
            });

            if (categories.length) {
                filter['category'] = { $in: categories.map(cat => cat._id) };
            } else {
                return res.status(404).send({
                    error: true,
                    msg: "No categories found"
                });
            }
        }

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }
        // Fetch products with pagination
        const data = await Product.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 8,
            sort: '-createdAt',
            select: '-__v -createdAt -updatedAt -description -short_description',
            populate: [
                {
                    path: 'category',
                    select: '-__v -createdAt -updatedAt'
                }
            ]
        });


        return res.status(200).send({
            error: false,
            msg: "Products fetched successfully",
            data: data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};
// product details
export const getProductDetails = async (req, res) => {
    try {
        const { query } = req;
        let product;
        if(!!query._id){
            product = await Product.findById({_id:query._id}).populate({
                path: 'category',
                select: '-__v -createdAt -updatedAt',
            });
        }
        if (!product) {
            return res.status(404).send({
                error: true,
                msg: 'Product not found'
            });
        }
        let relatedProducts = undefined;
        if(!!product?.category?._id){
            relatedProducts = await Product.find({
                _id: { $ne: product?._id },
                category: product?.category?._id
            })
                .select('-__v -createdAt -updatedAt -description -short_description')
                .limit(5);
        }
        const reviews = await ProductReview.find({ product: product._id })
            .select('-__v')
            .populate({
                path: 'user',
                select: 'name email image'
            });
        const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        return res.status(200).send({
            error: false,
            msg: 'Product fetched successfully',
            data: {
                product,
                relatedProducts,
                reviews,
                avgRating
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// product add to cart
export const addProductToCart = async (req, res) => {
    try {
        const { product_id, variant_id, quantity } = req.body;
        const user = res.locals.user._id;

        if (!product_id) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid product ID'
            });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).send({
                error: true,
                msg: 'Product not found'
            });
        }

        if (variant_id) {
            const selectedVariant = product.variants.id(variant_id);
            if (!selectedVariant) {
                return res.status(404).send({
                    error: true,
                    msg: 'Product with this variant does not exist'
                });
            }
        }

        let quantityToAdd = quantity || 1;

        let cart = await Cart.findOne({ user: user });
        if (!cart) {
            if (quantityToAdd <= 0) {
                return res.status(400).send({
                    error: true,
                    msg: "Cannot add a product with quantity 0 to the cart"
                });
            }
            cart = new Cart({
                user: user,
                products: [{ product: product_id, variant: variant_id, quantity: quantityToAdd }]
            });
        } else {
            const existingProductIndex = cart.products.findIndex(
                (p) => p.product.toString() === product_id &&
                    (variant_id ? p.variant?.toString() === variant_id : !p.variant)
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantityToAdd;
                // If quantity becomes 0 or less, remove the product from the cart
                if (cart.products[existingProductIndex].quantity <= 0) {
                    cart.products.splice(existingProductIndex, 1);
                }
            } else {
                if (quantityToAdd > 0) {
                    cart.products.push({ product: product_id, variant: variant_id, quantity: quantityToAdd });
                } else {
                    return res.status(400).send({
                        error: true,
                        msg: "Cannot add a product with quantity 0 to the cart"
                    });
                }
            }
        }

        await cart.save();

        return res.status(200).send({
            error: false,
            msg: 'Product added to cart successfully',
        });

    } catch (error) {
        console.error('Error in addProductToCart:', error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};



// product remove from cart
export const removeProductFromCart = async (req, res) => {
    try {
        const { product_id, variant_id } = req.query;
        const user = res.locals.user._id;

        const cart = await Cart.findOne({ user: user });

        if (!cart) {
            return res.status(404).send({
                error: true,
                msg: 'Cart not found'
            });
        }

        const productExists = cart.products.some(item => {
            return item.product.toString() === product_id &&
                (!item.variant || item.variant.toString() === variant_id);
        });

        if (!productExists) {
            return res.status(404).send({
                error: true,
                msg: 'Product not found in cart'
            });
        }

        cart.products = cart.products.filter(item => {
            return !(item.product.toString() === product_id &&
                (!item.variant || item.variant.toString() === variant_id));
        });

        if (cart.products.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            return res.status(200).send({
                error: false,
                msg: 'Cart deleted',
            });
        }

        // Save the updated cart if there are still products left
        await cart.save();

        return res.status(200).send({
            error: false,
            msg: 'Product removed from cart successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};


// get cart list
export const getCartList = async (req, res) => {
    try {
        const user = res.locals.user._id;

        const cart = await Cart.findOne({ user: user }).populate({
            path: 'products.product',
            select: '-__v -createdAt -updatedAt',
            populate: {
                path: 'category',
                select: '-__v -createdAt -updatedAt'
            }
        });

        if (!cart) {
            return res.status(404).send({
                error: true,
                msg: 'Cart not found'
            });
        }

        // Prepare the products list with variant info
        const productsWithVariantInfo = cart.products.map(item => {
            const product = item.product;
            const variant = product.variants.id(item.variant);

            return {
                _id: product._id,
                name: product.name,
                price: variant ? variant.price : product.price,
                quantity: item.quantity,
                in_stock: variant ? variant.in_stock : product.in_stock,
                variant: variant ? {
                    _id: variant._id,
                    name: variant.name,
                    price: variant.price,
                    in_stock: variant.in_stock
                } : null,
                category: product.category,
                thumbnail_image: product.thumbnail_image,
            };
        });

        return res.status(200).send({
            error: false,
            msg: 'Cart fetched successfully',
            data: {
                _id: cart._id,
                user: cart.user,
                products: productsWithVariantInfo
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error'
        });
    }
};


// post review
export const postProductReview = async (req, res) => {
    try {
        const { body } = req;
        const { product, rating, review } = body;

        const user = res.locals.user._id;

        if (!user) {
            return res.status(403).send({
                error: true,
                msg: 'You must be logged in to review a product'
            });
        }


        // Check if the user has purchased the product
        const order = await Order.findOne({
            userId: user,
            'items.productId': product,
            status: 'completed'
        });

        if (!order) {
            return res.status(403).send({
                error: true,
                msg: 'You can only review products you have purchased'
            });
        }

        // Fetch the product details
        const productDetails = await Product.findById(product);

        if (!productDetails) {
            return res.status(404).send({
                error: true,
                msg: 'Product not found'
            });
        }

        const checkReview = await ProductReview.find({ user, product });
        if (checkReview.length > 0) {
            return res.status(403).send({
                error: true,
                msg: 'You have already reviewed this product'
            });
        }
        await ProductReview.create({ product, rating, review, user });

        return res.status(200).send({
            error: false,
            msg: 'Review has been added successfully'
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}

// get review
export const getProductReviews = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        if (!!query.product) {
            filter['product'] = query.product
        }
        let data = await ProductReview.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
            populate: [
                { path: 'user', select: 'name email image' }
            ]
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets reviews',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// delete review
export const deleteProductReview = async (req, res) => {
    try {
        let { query } = req;
        await ProductReview.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Review has been deleted successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
