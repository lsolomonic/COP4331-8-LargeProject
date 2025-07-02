const omgoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

MediaSourceHandle.exports = mongoose.model("Building", buildingSchema);