const express = require("express");
const Booking = require("../model/bookingSchema");
const bookings = express.Router();

// Create a new booking
bookings.post("/create", async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Check if the time slot is already booked for the same restaurant and date
        const existingBooking = await Booking.findOne({
            "restaurant.name": bookingData.restaurant.name,
            "booking.date": bookingData.booking.date,
            "booking.time": bookingData.booking.time,
            "booking.status": { $in: ["pending", "confirmed"] }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked. Please choose a different time."
            });
        }

        // Create the booking
        const newBooking = await Booking.create(bookingData);
        
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
        });
    }
});

// Get all bookings
bookings.get("/", async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            bookings: allBookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});

// Get bookings by customer email
bookings.get("/customer/:email", async (req, res) => {
    try {
        const customerEmail = req.params.email.toLowerCase();
        const customerBookings = await Booking.find({
            "booking.customerEmail": customerEmail
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            bookings: customerBookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer bookings",
            error: error.message
        });
    }
});

// Get booking by booking ID
bookings.get("/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findOne({
            "booking.bookingId": req.params.bookingId
        });
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        
        res.json({
            success: true,
            booking: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message
        });
    }
});

// Update booking status
bookings.put("/:bookingId/status", async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " + validStatuses.join(", ")
            });
        }
        
        const updatedBooking = await Booking.findOneAndUpdate(
            { "booking.bookingId": req.params.bookingId },
            { "booking.status": status },
            { new: true }
        );
        
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        
        res.json({
            success: true,
            message: "Booking status updated successfully",
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update booking status",
            error: error.message
        });
    }
});

// Cancel booking
bookings.delete("/:bookingId", async (req, res) => {
    try {
        const updatedBooking = await Booking.findOneAndUpdate(
            { "booking.bookingId": req.params.bookingId },
            { "booking.status": "cancelled" },
            { new: true }
        );
        
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        
        res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel booking",
            error: error.message
        });
    }
});

// Get available time slots for a specific restaurant and date
bookings.get("/availability/:restaurantName/:date", async (req, res) => {
    try {
        const { restaurantName, date } = req.params;
        
        // Get all booked time slots for the given restaurant and date
        const bookedSlots = await Booking.find({
            "restaurant.name": restaurantName,
            "booking.date": date,
            "booking.status": { $in: ["pending", "confirmed"] }
        }).select("booking.time");
        
        const bookedTimes = bookedSlots.map(booking => booking.booking.time);
        
        // All available time slots
        const allTimeSlots = [
            "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
            "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
            "09:00 PM", "09:30 PM", "10:00 PM"
        ];
        
        // Filter out booked time slots
        const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
        
        res.json({
            success: true,
            availableSlots: availableSlots,
            bookedSlots: bookedTimes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch availability",
            error: error.message
        });
    }
});

module.exports = bookings;
