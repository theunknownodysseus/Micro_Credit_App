// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data stores
let users = [];
let loans = [];
let nextUserId = 1;
let nextLoanId = 1;

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Micro Credit API',
        status: 'Working!',
        endpoints: [
            'GET / - This page',
            'POST /api/users/register - Register user',
            'GET /api/users - Get all users',
            'POST /api/loans/apply - Apply for loan',
            'GET /api/loans - Get all loans'
        ]
    });
});

// Register new user
app.post('/api/users/register', (req, res) => {
    const { email, mobile } = req.body;
    if (!email || !mobile) {
        return res.status(400).json({ message: 'Email and mobile are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = {
        id: nextUserId++,
        email,
        mobile,
        createdAt: new Date()
    };

    users.push(user);
    res.status(201).json({
        message: 'User registered successfully',
        userId: user.id,
        user: user
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json({ users: users, count: users.length });
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
        ...users[userIndex],
        ...req.body,
        updatedAt: new Date()
    };

    res.json({ message: 'User updated successfully', user: users[userIndex] });
});

// Apply for loan
app.post('/api/loans/apply', (req, res) => {
    const { userId, requestedAmount, requestedTenure, purpose } = req.body;

    if (!userId || !requestedAmount || !requestedTenure) {
        return res.status(400).json({ message: 'UserId, amount, and tenure are required' });
    }

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isApproved = requestedAmount <= 100000 && requestedTenure <= 36;
    const approvedAmount = isApproved ? requestedAmount : 0;
    const interestRate = 12;
    const monthlyEMI = isApproved ?
        Math.round((requestedAmount * (1 + interestRate / 100)) / requestedTenure) : 0;

    const loan = {
        id: nextLoanId++,
        userId: parseInt(userId),
        requestedAmount,
        requestedTenure,
        purpose: purpose || 'Personal',
        status: isApproved ? 'Approved' : 'Rejected',
        approvedAmount,
        emi: monthlyEMI,
        interestRate,
        riskScore: isApproved ? 75 : 25,
        reason: isApproved ? 'Application approved' : 'Amount too high or tenure too long',
        createdAt: new Date()
    };

    loans.push(loan);
    res.json({ message: 'Loan application processed', loan: loan });
});

// Get all loans
app.get('/api/loans', (req, res) => {
    res.json({ loans: loans, count: loans.length });
});

// Get loans for a specific user
app.get('/api/loans/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userLoans = loans.filter(l => l.userId === userId);
    res.json({ loans: userLoans, count: userLoans.length });
});

const PORT = 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    }
});