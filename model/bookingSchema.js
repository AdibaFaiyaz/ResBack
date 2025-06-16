const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    restaurant: {
        name: {
            type: String,
            required: [true, "Restaurant name is required"]
        },
        location: {
            type: String,
            required: [true, "Restaurant location is required"]
        },
        price: {
            type: String,
            required: [true, "Restaurant price is required"]
        }
    },
    booking: {
        date: {
            type: Date,
            required: [true, "Booking date is required"]
        },
        time: {
            type: String,
            required: [true, "Booking time is required"]
        },
        numberOfPeople: {
            type: Number,
            required: [true, "Number of people is required"],
            min: [1, "Must have at least 1 person"],
            max: [20, "Cannot exceed 20 people"]
        },
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"]
        },
        customerPhone: {
            type: String,
            required: [true, "Customer phone is required"],
            validate: {
                validator: function(v) {
                    return /^\d{10}$/.test(v.replace(/\D/g, ''));
                },
                message: "Please enter a valid 10-digit phone number"
            }
        },
        customerEmail: {
            type: String,
            required: [true, "Customer email is required"],
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Please enter a valid email address"
            }
        },
        specialRequests: {
            type: String,
            trim: true,
            maxlength: [500, "Special requests cannot exceed 500 characters"]
        },
        bookingId: {
            type: String,
            unique: true,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "confirmed"
        }
    }
}, {
    collection: "bookings",
    timestamps: true
});

// Create compound index for efficient queries
bookingSchema.index({ "booking.date": 1, "booking.time": 1, "restaurant.name": 1 });

module.exports = mongoose.model("Booking", bookingSchema);
