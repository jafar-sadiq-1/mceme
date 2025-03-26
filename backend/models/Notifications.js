const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

const Notifications = mongoose.model("notification", NotificationsSchema);

module.exports = Notifications;