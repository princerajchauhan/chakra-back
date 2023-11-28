const mongoose = require("mongoose")

const Schema = mongoose.Schema

const msgSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Message", msgSchema)