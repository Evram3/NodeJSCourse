const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema(
    {
        type: String
    },
    {
        type: Number
    }
);
module.exports = mongoose.model("Course", courseSchema);