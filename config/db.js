const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); 
console.log('Mongo URI:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1); 
    }
};

module.exports = connectDB;



