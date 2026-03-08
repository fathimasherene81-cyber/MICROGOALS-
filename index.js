const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- 1. Added CORS import
const { errorHandler } = require('./middleware/errorMiddleware');

// 1. Import the Route Files clearly at the top
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // <--- 2. Activated CORS (Must be before routes)
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ Database Connection Error:", err));

// --- ROUTES ---

// Home route
app.get('/', (req, res) => {
    res.send("MicroGoals API is running...");
});

// Diagnostic Test Route
app.post('/test', (req, res) => {
    res.json({ message: "The server saw my POST request!" });
});

// 2. Use the defined Route variables
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);

// --- ERROR HANDLING ---
app.use(errorHandler);

// Note: Using PORT from .env (5005) or defaulting to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is humming along on http://localhost:${PORT}`);
});