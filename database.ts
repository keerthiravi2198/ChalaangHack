import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbURI = 'mongodb+srv://ankiirawat24:NlwfUT2D02mTIKmD@personalprojects0.faiqrde.mongodb.net/veera';
        mongodb://username:password@host:port/database_name

        await mongoose.connect(dbURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
