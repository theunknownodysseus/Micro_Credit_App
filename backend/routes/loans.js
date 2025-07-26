const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');
const { calculateLoanEligibility } = require('../utils/loanAlgorithm');

// Apply for loan
router.post('/apply', async (req, res) => {
    try {
        const { userId, requestedAmount, requestedTenure, purpose } = req.body;

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate loan eligibility
        const eligibilityResult = calculateLoanEligibility(
            user.toObject(),
            requestedAmount,
            requestedTenure
        );

        // Create loan application
        const loanApplication = new LoanApplication({
            userId,
            requestedAmount,
            requestedTenure,
            purpose,
            status: eligibilityResult.isEligible ? 'Approved' : 'Rejected',
            approvedAmount: eligibilityResult.approvedAmount,
            approvedTenure: eligibilityResult.approvedTenure,
            emi: eligibilityResult.emi,
            interestRate: eligibilityResult.interestRate,
            riskScore: eligibilityResult.riskScore,
            creditScore: eligibilityResult.creditScore,
            eligibilityReason: eligibilityResult.eligibilityReason,
            algorithmDetails: eligibilityResult.algorithmDetails
        });

        await loanApplication.save();

        res.json({
            message: 'Loan application processed successfully',
            loanApplication,
            eligibilityResult
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get loan applications for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const loanApplications = await LoanApplication.find({ userId })
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({ loanApplications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all loan applications (for admin/analytics)
router.get('/', async (req, res) => {
    try {
        const loanApplications = await LoanApplication.find()
            .populate('userId', 'fullName email currentSalary')
            .sort({ createdAt: -1 });

        res.json({ loanApplications, count: loanApplications.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get loan statistics
router.get('/stats', async (req, res) => {
    try {
        const totalApplications = await LoanApplication.countDocuments();
        const approvedApplications = await LoanApplication.countDocuments({ status: 'Approved' });
        const rejectedApplications = await LoanApplication.countDocuments({ status: 'Rejected' });

        const totalApprovedAmount = await LoanApplication.aggregate([
            { $match: { status: 'Approved' } },
            { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
        ]);

        const avgRiskScore = await LoanApplication.aggregate([
            { $group: { _id: null, avg: { $avg: '$riskScore' } } }
        ]);

        const riskDistribution = await LoanApplication.aggregate([
            {
                $bucket: {
                    groupBy: '$riskScore',
                    boundaries: [0, 40, 60, 80, 100],
                    default: 'Other',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.json({
            totalApplications,
            approvedApplications,
            rejectedApplications,
            approvalRate: ((approvedApplications / totalApplications) * 100).toFixed(2),
            totalApprovedAmount: totalApprovedAmount[0]?.total || 0,
            avgRiskScore: avgRiskScore[0]?.avg?.toFixed(2) || 0,
            riskDistribution
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;