import Notice from "../models/notice.model";
import Group from "../models/group.models";
import User from "../models/user.model";
import Order from "../models/product/order.model";
import UserSubscription from "../models/userSubscription.model";
import Product from "../models/product/product.model";


export const getTrainerDashboard = async (req, res) => {
    try {
        const user = res.locals.user._id;

        if (!user) {
            return res.status(400).json({
                error: true,
                msg: 'User not found'
            });
        }

        const groups = await Group.find({
            assign_trainers: user
        }).populate({
            path: 'members',
            select: 'name email phone image _id'
        }).limit(5);
       
        


        const totalNotice = await Notice.find({ user: user }).countDocuments();
        const totalGroup = await Group.find({ assign_trainers: user }).countDocuments();

        return res.status(200).json({
            error: false,
            msg: 'Successfully fetched data',
            data: {
                groups,
                totalNotice,
                totalGroup
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Internal server error'
        });
    }
};


export const getAdminDashboard = async (req, res) => {
  try {
    // Retrieve the authenticated user's ID
    const user = res.locals.user._id;

    if (!user) {
      return res.status(400).json({
        error: true,
        msg: "User not found",
      });
    }

    // Fetch counts for various entities
    const [
      totalUsers,
      totalTrainers,
      totalEmployee,
      totalGroups,
      totalOrders,
      totalPaidSubscription,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "trainer" }),
      User.countDocuments({ role: "employee" }),
      Group.countDocuments({}),
      Order.countDocuments({}),
      UserSubscription.countDocuments({ active: true }),
    ]);

    // Fetch top-selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          name: "$productDetails.name",
          thumbnail_image: "$productDetails.thumbnail_image",
          price: "$productDetails.price",
          totalSold: 1,
          salePercentage: {
            $multiply: [
              { $divide: ["$totalSold", { $sum: "$totalSold" }] },
              100,
            ],
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Fetch latest trainers, members, and orders
    const topTrainers = await User.find({ role: "trainer" })
      .sort({ createdAt: 1 })
      .limit(6)
      .select("name image role _id");
    const activeMembers = await User.find({ role: "user" })
      .sort({ createdAt: 1 })
      .limit(6)
      .select("name image role _id");
    const latestOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("uid subTotal _id createdAt payment");
    const latestSubscriptionHistory = await UserSubscription.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("uid _id createdAt payment");

    // Fetch sales data
    const salesData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalOrderedQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    // Total sales and product data
    const totalSaleCount = salesData.reduce(
      (total, sale) => total + sale.totalOrderedQuantity,
      0
    );

    const totalExistsQuantity = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantity: 1,
        },
      },
    ]);

    // Monthly earnings analytics
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const start = new Date(currentYear, month, 1);
        const end = new Date(currentYear, month + 1, 0);

        const completedOrders = await Order.aggregate([
          {
            $match: {
              status: "completed",
              createdAt: { $gte: start, $lt: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$subTotal" } } },
        ]);

        const subscriptions = await UserSubscription.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lt: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$payment" } } },
        ]);

        return {
          month: month + 1,
          earnings:
            (completedOrders[0]?.total || 0) + (subscriptions[0]?.total || 0),
        };
      })
    );

    // Send response
    return res.status(200).json({
      error: false,
      msg: "Successfully fetched dashboard data",
      data: {
        totalUsers,
        totalTrainers,
        totalEmployee,
        totalGroups,
        totalOrders,
        totalPaidSubscription,
        topProducts,
        topTrainers,
        activeMembers,
        latestOrders,
        latestSubscriptionHistory,
        salesData: {
          existingProduct: totalExistsQuantity[0].totalQuantity,
          totalProduct:
            totalSaleCount + totalExistsQuantity[0].totalQuantity,
          soldProduct: totalSaleCount,
        },
        monthlyEarnings,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      error: true,
      msg: "Internal server error",
      errorDetails:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
