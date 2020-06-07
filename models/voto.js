const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    os: {
        type: String,
        required: true
    },

    points: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("pusherpoll", PostSchema );
