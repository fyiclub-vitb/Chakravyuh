const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cityProgress: {
        Mumbai: {
            type: Boolean,
            default: false
        },
        Bangalore: {
            type: Boolean,
            default: false
        },
        Pune: {
            type: Boolean,
            default: false
        },
        Chennai: {
            type: Boolean,
            default: false
        },
        Jammu: {
            type: Boolean,
            default: false
        },
        Delhi: {
            type: Boolean,
            default: false
        }
    },
    isDisqualified: {
        type: Boolean,
        default: false
    },
    timeStart: {
        type: Date,
        default: null
    },
    city: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: null
    },
    time: {
        type: String,
        default: ""
    },
    places: {
        type: Number,
        default: 0
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    submitAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
