import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: false
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

channelSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// 'this' refer to the query object in this
channelSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;