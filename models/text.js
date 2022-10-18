const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const textScheme = new Schema({
    id: String,
    value: String,
    date: String,
    
    //сбор статистики
    like: Number,
    dislike: Number,
    view: Number,

    //доп. инфа
    author: String
});

module.exports = mongoose.model("Text", textScheme);