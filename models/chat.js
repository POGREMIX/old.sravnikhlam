const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const chatScheme = new Schema({
    id: Number,
    value: String,
    date: String,

    //доп. инфа
    author: String
});

module.exports = mongoose.model("Chat", chatScheme);