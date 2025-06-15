import mongoose from "mongoose";
import User from "../models/AuthModel.js";
import Message from "../models/MessagesModel.js"

const searchContact = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { searchTerm } = req.body;

        // null check for searchTerm
        // searchTerm === undefined || searchTerm === null  // alternative if condition
        if (!searchTerm) {
            return res.status(404).send("Search Term is required")
        }

        // sanitize the string from the special character and create a regex for this *************
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");
        console.log("Regex is :", regex);

        // gives a array of contacts *****
        const contacts = await User.find({
            $and: [
                { _id: { $ne: userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ]
        });
        // console.log("Contact is :", contacts);

        return res.status(200).json({ contacts });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getContactForDm = async (req, res) => {
    try {
        let userId = req.userId;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",

                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])

        return res.status(200).json({ contacts });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

const getAllContacts = async (req, res, next) => {
    try {
        const userId = req.userId;
        const users = await User.find({ _id: { $ne: userId } }, "firstName lastName email _id");

        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        }))
        // console.log("contact is :", contacts);

        return res.status(200).json({ contacts });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {
    searchContact,
    getContactForDm,
    getAllContacts
}