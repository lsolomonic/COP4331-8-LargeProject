const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },
    ratingStudy: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    ratingSocial: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

MediaSourceHandle.exports = mongoose.model("Review", reviewSchema)