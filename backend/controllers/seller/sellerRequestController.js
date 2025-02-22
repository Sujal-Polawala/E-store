const Seller = require("../../models/seller");

// Get all seller requests (pending)
exports.getSellerRequests = async (req, res) => {
  try {
    const requests = await Seller.find().select("-password");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve or reject a seller request
exports.approveRequest = async (req, res) => {
  const { sellerId, action } = req.body; // action: "approve" or "reject"

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller request not found" });
    }

    if (action === "approve") {
      await Seller.findByIdAndUpdate(sellerId, { status: "approved" });
      res.status(200).json({ message: "Seller request approved" });
    } else if (action === "reject") {
      await Seller.findByIdAndUpdate(sellerId, { status: "rejected" });
      res.status(200).json({ message: "Seller request rejected" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { sellerId } = req.body;

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller request not found" });
    }

    // Toggle the status
    const newStatus = seller.status === "approved" ? "rejected" : "approved";
    await Seller.findByIdAndUpdate(sellerId, { status: newStatus });

    res.status(200).json({
      message: `Seller request ${newStatus}`,
      newStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};