const Customer = require("../models/Customer");
const Order = require("../models/Order");

const getCustomers = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [customers, total] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Customer.countDocuments(query),
  ]);

  const stats = await Order.aggregate([
    { $match: { customer: { $in: customers.map((c) => c._id) } } },
    { $group: { _id: "$customer", orders: { $sum: 1 }, totalSpend: { $sum: "$total" } } },
  ]);
  const statsMap = new Map(stats.map((s) => [s._id.toString(), s]));

  const data = customers.map((c) => ({
    ...c.toObject(),
    orders: statsMap.get(c._id.toString())?.orders || 0,
    totalSpend: statsMap.get(c._id.toString())?.totalSpend || 0,
  }));

  res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
};

module.exports = { getCustomers };
