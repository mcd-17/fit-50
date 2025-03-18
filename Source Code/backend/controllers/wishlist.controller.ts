import Product from "../models/product/product.model";
import WishList from "../models/wishlist.model";


export const addOrRemoveProductFromWishlist = async (req, res) => {
    try {
        const user = res.locals.user._id;
        const { productId, variantId } = req.body;

        const productIds = Array.isArray(productId) ? productId : [productId];
        const variantIds = Array.isArray(variantId) ? variantId : [variantId];

        if (productIds.length !== variantIds.length) {
            return res.status(400).send({
                error: true,
                msg: 'Number of product IDs and variant IDs must match',
            });
        }

        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).send({
                error: true,
                msg: 'One or more products not found',
            });
        }

        const processedVariantIds = variantIds.map((vId, index) => {
            if (!vId && products[index].variants.length > 0) {
                return products[index].variants[0]._id.toString();
            }
            return vId;
        });

        let wishlist = await WishList.findOne({ user });

        if (!wishlist) {
            wishlist = new WishList({
                user,
                products: productIds.map((id, index) => ({
                    product: id,
                    variant: processedVariantIds[index] || null
                })),
            });
            await wishlist.save();

            return res.status(200).send({
                error: false,
                msg: 'Product added to wishlist',
            });
        } else {
            let removed = [];
            let added = [];

            productIds.forEach((id, index) => {
                const existingProduct = wishlist.products.find(
                    p => p.product.toString() === id.toString() &&
                        (processedVariantIds[index] ? p.variant?.toString() === processedVariantIds[index].toString() : true)
                );

                if (existingProduct) {
                    wishlist.products = wishlist.products.filter(p => p !== existingProduct);
                    removed.push(id);
                } else {
                    wishlist.products.push({
                        product: id,
                        variant: processedVariantIds[index] || null
                    });
                    added.push(id);
                }
            });

            await wishlist.save();

            let msg = '';
            if (added.length && removed.length) {
                msg = `Added to wishlist: ${added.join(', ')}. Removed from wishlist: ${removed.join(', ')}`;
            } else if (added.length) {
                msg = 'Product added to Wishlist';
            } else if (removed.length) {
                msg = 'Product removed from Wishlist';
            }

            return res.status(200).send({
                error: false,
                msg,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error',
        });
    }
};

// get wishlist data
export const getWishlist = async (req, res) => { 
    try {
        const { query } = req;
        const user = res.locals.user._id;

        const filter = { user: user };

        const wishlist = await WishList.paginate(filter, {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
            populate: [
                {
                    path: 'products.product',
                    populate: {
                        path: 'category',
                        select: 'name -_id'
                    },
                    select: '-__v -createdAt -updatedAt'
                }
            ],
            lean: true
        });

        const cleanedDocs = await Promise.all(wishlist.docs.map(async (item) => {
            const transformedProducts = await Promise.all(item.products.map(async (prod) => {
                let variantData = null;
                if (prod.variant) {
                    const product = await Product.findById(prod.product._id).lean();
                    variantData = product.variants.find(v => v._id.toString() === prod.variant.toString());
                }

                return {
                    _id: prod.product._id,
                    name: prod.product.name,
                    price: prod.product.price,
                    quantity: prod.product.quantity,
                    category: prod.product.category.name,
                    thumbnail_image: prod.product.thumbnail_image,
                    images: prod.product.images,
                    is_active: prod.product.is_active,
                    variant: variantData ? {
                        _id: variantData._id,
                        name: variantData.name,
                        price: variantData.price,
                        in_stock: variantData.in_stock
                    } : null
                };
            }));

            return {
                _id: item._id,
                user: item.user,
                products: transformedProducts,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            };
        }));

        const cleanedResponse = {
            ...wishlist,
            docs: cleanedDocs
        };

        return res.status(200).send({
            error: false,
            data: cleanedResponse
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};