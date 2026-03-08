const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    // This "user" field is like a link/tether to the User who created it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This tells Mongoose to look in the User model
    },
    title: {
        type: String,
        required: [true, "Please add a goal title"]
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);