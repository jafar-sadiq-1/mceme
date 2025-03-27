const express = require("express");
const router = express.Router();
const Notifications = require("../models/Notifications");

// router.get('/hello',(req,res)=>{
//     res.send('Notifications Route');
// }   );

router.post('/add', async (req, res) => {
    try {
        const notification = new Notifications({
            notificationType: req.body.notificationType,
            status: req.body.status,
            details: req.body.details
        });
        const savedNotification = await notification.save();
        res.json(savedNotification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notifications.find();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update notification status
router.put('/update-status/:id', async (req, res) => {
    try {
        const updatedNotification = await Notifications.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedNotification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotification = await Notifications.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted successfully', notification: deletedNotification });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;