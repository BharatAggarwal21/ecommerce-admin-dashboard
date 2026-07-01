const Order = require("../models/Order");
const Product = require("../models/Product");

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getSummary = async (req, res) => {
  const todayStart = startOfDay(new Date());
  const sevenDaysAgo = startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));

  const [ordersToday, revenueAgg, productsCount, pendingOrders, recentOrders, topProducts, dailyStats] =
    await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.find().populate("customer", "name").sort({ createdAt: -1 }).limit(5),
      Product.find().sort({ sold: -1 }).limit(5).select("name sold price"),
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

  res.status(200).json({
    success: true,
    data: {
      ordersToday,
      revenue: revenueAgg[0]?.total || 0,
      productsCount,
      pendingOrders,
      recentOrders,
      topProducts,
      dailyStats,
    },
  });
};

module.exports = { getSummary };
