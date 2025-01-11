const Order = require("../../models/order");

exports.placeOrder = async (orderDetails) => {
  const { userId, cartItems, totalPrice, shippingAddress, paymentId } = orderDetails;

  try {
    if (!userId || !cartItems || !cartItems.length || !totalPrice) {
      throw new Error("Missing required fields for order.");
    }

    const order = new Order({
      userId,
      items: cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      })),
      totalPrice,
      paymentId,
      shippingAddress,
      status: "Pending",
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)), // Estimated delivery
    });

    // Generate the orderId before saving the order
    order.orderId = order._id.toString();  // This generates the orderId based on the _id

    // Save the order
    const savedOrder = await order.save();
    console.log("Order saved:", savedOrder);
    return savedOrder;
  } catch (error) {
    console.error("Error placing order:", error.message);
    throw new Error("Failed to place order");
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the collection
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};


// Get Order By UserId
exports.getOrderByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    if (!orders || orders.length === 0) {
      return res.status(404).send({ message: 'Orders not found' });
    }
    res.send(orders);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ error: 'Server error' });
  }
};

exports.getOrderData = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 }); // Get the latest order

    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }

    res.status(200).json(order); // Return the order details
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details" });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};