const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // For local MongoDB
        const conn = await mongoose.connect('mongodb://localhost:27017/microcredit', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        console.log('Make sure MongoDB is running locally or update connection string for MongoDB Atlas');
        process.exit(1);
    }
};

module.exports = connectDB;