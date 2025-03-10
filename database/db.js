const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB (User Profile Service)");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
