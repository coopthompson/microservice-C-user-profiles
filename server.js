require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./database/db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => {
    res.send(`
        User Profile Microservice is running!
        Register: http://localhost:5003/register.html
        Login: http://localhost:5003/login.html  
    `);
});

app.use(express.static("public")); // Serves register.html and login.html

// Routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5003; // Different port from the synopsis service
app.listen(PORT, () => console.log(`User service running on http://localhost:${PORT}`));
