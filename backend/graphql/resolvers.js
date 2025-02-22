const Order = require("../models/order"); // Assuming you have an Order model
const User = require("../models/user"); // Assuming you have a User model
const Seller = require("../models/seller"); // Assuming you have a Seller model
const Product = require("../models/productModel"); // Assuming you have a Product model

const resolvers = {
  Query: {
    // Fetch orders for a specific seller
    orders: async (_, { sellerId }) => {
      try {
        const orders = await Order.find({ "items.sellerId": sellerId });

        // Filter out the seller's products and calculate the correct sales amount
        const sellerOrders = orders.map((order) => {
          const sellerItems = order.items.filter(
            (item) => item.sellerId.toString() === sellerId
          );
          const sellerTotalPrice = sellerItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return {
            _id: order._id,
            totalPrice: sellerTotalPrice, // Only sum up this seller's products
            createdAt: order.createdAt,
          };
        });

        return sellerOrders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders");
      }
    },

    // Get total number of orders
    totalOrders: async () => {
      try {
        return await Order.countDocuments();
      } catch (error) {
        console.error("Error fetching total orders:", error);
        throw new Error("Error fetching total orders");
      }
    },

    // Get total revenue from all orders
    totalRevenue: async () => {
      try {
        const orders = await Order.find();
        return orders.reduce((total, order) => total + order.totalPrice, 0);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
        throw new Error("Error fetching total revenue");
      }
    },

    // Get total number of users
    totalUsers: async () => {
      try {
        return await User.countDocuments();
      } catch (error) {
        console.error("Error fetching total users:", error);
        throw new Error("Error fetching total users");
      }
    },

    // Get total number of sellers
    totalSellers: async () => {
      try {
        return await Seller.countDocuments();
      } catch (error) {
        console.error("Error fetching total sellers:", error);
        throw new Error("Error fetching total sellers");
      }
    },

    // Get a list of all sellers with their orders
    // In the resolvers file
    sellers: async () => {
      try {
        const sellers = await Seller.find().lean();

        const sellersWithOrders = await Promise.all(
          sellers.map(async (seller) => {
            const orders = await Order.find({ "items.sellerId": seller._id });

            const filteredOrders = orders.map((order) => {
              const sellerItems = order.items.filter(
                (item) => item.sellerId.toString() === seller._id.toString()
              );
              
              console.log(sellerItems);

              const sellerTotalPrice = sellerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );


              console.log(sellerTotalPrice);

              return {
                _id: order._id,
                totalPrice: sellerTotalPrice,
                createdAt: order.createdAt,
              };
            });

            console.log(filteredOrders);

            const totalSales = filteredOrders.reduce(
              (sum, order) => sum + order.totalPrice,
              0
            );

            return {
              ...seller,
              orders: filteredOrders,
              totalSales, // Ensure this is included
            };
          })
        );

        return sellersWithOrders;
      } catch (error) {
        console.error("Error fetching sellers:", error);
        throw new Error("Error fetching sellers");
      }
    },

    // Get the best-selling products
    bestSellingProducts: async () => {
      try {
        const products = await Product.aggregate([
          {
            $lookup: {
              from: "Order", // Join with the orders collection
              localField: "_id", // Match the productId in the items array of orders
              foreignField: "items.productId",
              as: "Order",
            },
          },
          {
            $unwind: "$Order", // Unwind the orders to access individual orders
          },
          {
            $unwind: "$Order.items", // Unwind the items array to access each product
          },
          {
            $match: {
              "Order.items.productId": { $exists: true }, // Ensure that productId exists
            },
          },
          {
            $group: {
              _id: { productId: "$_id", orderId: "$Order._id" }, // Group by productId and orderId to avoid counting the same product multiple times in a single order
              title: { $first: "$title" }, // Get the product title
              quantity: { $first: "$Order.items.quantity" }, // Ensure that the quantity is counted only once per product in the same order
            },
          },
          {
            $group: {
              _id: "$_id.productId", // Group by productId to aggregate across different orders
              title: { $first: "$title" }, // Get the product title
              totalSales: { $sum: "$quantity" }, // Sum the quantity for this product across all orders
            },
          },
          {
            $sort: { totalSales: -1 }, // Sort by total sales in descending order
          },
          {
            $limit: 5, // Limit to top 5 best-selling products
          },
        ]);

        // Return the results with formatted product data
        return products.map((product) => ({
          _id: product._id.toString(),
          title: product.title,
          sales: product.totalSales || 0, // Default to 0 if no sales
        }));
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
        throw new Error("Error fetching best-selling products");
      }
    },
  },
};

module.exports = resolvers;
