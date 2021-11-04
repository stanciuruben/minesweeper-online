const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    gameScore: {
        type: Number,
        default: 0
    },
    game: {
        type: Array
    },
    bombIds: {
        type: Array
    },
    uncoveredCells: {
        type: Array
    }
});

module.exports = User = mongoose.model('user', UserSchema);