const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    panNumber: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    currentSalary: {
        type: Number,
        required: true
    },
    previousSalary: {
        type: Number,
        required: true
    },
    ownsHouse: {
        type: Boolean,
        required: true
    },
    rentAmount: {
        type: Number,
        default: 0
    },
    groceryExpense: {
        type: Number,
        required: true
    },
    currentEMIs: {
        type: Number,
        required: true
    },
    previousHikeDate: {
        type: Date,
        required: true
    },
    nextHikeDate: {
        type: Date,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    // Additional fields for better assessment
    mallVisitsPerMonth: {
        type: Number,
        required: true
    },
    averageMallSpending: {
        type: Number,
        required: true
    },
    diningOutFrequency: {
        type: Number,
        required: true
    },
    averageDiningExpense: {
        type: Number,
        required: true
    },
    travelFrequency: {
        type: Number,
        required: true
    },
    averageTravelExpense: {
        type: Number,
        required: true
    },
    creditCardLimit: {
        type: Number,
        default: 0
    },
    creditCardUtilization: {
        type: Number,
        default: 0
    },
    savingsAmount: {
        type: Number,
        required: true
    },
    investmentAmount: {
        type: Number,
        default: 0
    },
    dependents: {
        type: Number,
        required: true
    },
    educationLoan: {
        type: Number,
        default: 0
    },
    vehicleLoan: {
        type: Number,
        default: 0
    },
    workExperience: {
        type: Number,
        required: true
    },
    jobStability: {
        type: String,
        enum: ['Stable', 'Moderate', 'Unstable'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);