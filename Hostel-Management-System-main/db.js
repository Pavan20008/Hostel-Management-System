const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        console.log('\nAttempting to connect to MongoDB...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4 // Use IPv4, skip trying IPv6
        });
        
        console.log("✅ Successfully connected to MongoDB!");
        
        // Listen for errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('\n❌ MongoDB Connection Error:', error);
        // Exit process with failure if we can't connect to database
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = connectDB; 