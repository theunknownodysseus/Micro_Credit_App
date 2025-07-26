const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedAmount: {
        type: Number,
        required: true
    },
    requestedTenure: {
        type: Number,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    approvedAmount: {
        type: Number,
        default: 0
    },
    approvedTenure: {
        type: Number,
        default: 0
    },
    emi: {
        type: Number,
        default: 0
    },
    interestRate: {
        type: Number,
        default: 12
    },
    riskScore: {
        type: Number,
        default: 0
    },
    creditScore: {
        type: Number,
        default: 0
    },
    eligibilityReason: {
        type: String,
        default: ''
    },
    algorithmDetails: {
        incomeStability: Number,
        expenseRatio: Number,
        debtToIncomeRatio: Number,
        savingsRatio: Number,
        lifestyleScore: Number,
        employmentScore: Number,
        finalScore: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);