import { RequestHandler } from "express";
import UserModel from "../models/users";
import MessageModel from "../models/message.model";
import mongoose from "mongoose";
type MulterFile = Express.Multer.File;
// import { io } from "../app";

export const getUsersForSidebar: RequestHandler = async (req, res) => {
  try {
    const filteredUsers = await UserModel.find({ _id: { $ne: req.user?._id } })
      .select("-password")
      .exec();
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage: RequestHandler = async (req, res): Promise<void> => {
  // console.log("📩 Incoming Message:", req.body);
  try {
    const { content } = req.body;

    // Ensure receiverId exists
    const receiverIdRaw = req.params.id;
    const senderIdRaw = req.user?._id;

    const receiverId = new mongoose.Types.ObjectId(receiverIdRaw);
    const senderId = senderIdRaw;

    if (
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      res
        .status(400)
        .json({ error: "Sender ID and Receiver ID are required." });
    }

    // console.log("📩 Content:", content);
    // console.log("📩 Receiver ID:", receiverId);
    // console.log("👤 Sender ID:", senderId);

    // Handle file uploads (ensure it returns an array or empty array)
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    // console.log("📝 Creating Message with Data:", {
    //   senderId,
    //   receiverId,
    //   content,
    //   imageUrls,
    // });

    // Create the message
    const message = await MessageModel.create({
      senderId,
      receiverId,
      content,
      imageUrl: imageUrls[0], // Ensure your schema supports an array
    });
    // io.to(senderId.toString()).emit("receive_message", message);
    // console.log("📩 Message Created:", message);
    // io.to(receiverId.toString()).emit("receive_message", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: `Failed to send message: ${error}` });
  }
};
