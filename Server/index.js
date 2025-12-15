import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
// The cloudinary config file is imported in your controller, which is sufficient.
// No need to import or call it here.
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
// import meetingRouter from './routes/MeetingRoutes.js';

const app = express();
const port = process.env.PORT || 4000; // Added a fallback port

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/paypal', paymentRouter);
// app.use('/api/meeting', meetingRouter);

// DB Connection
connectDB();

// Root endpoint for basic check
app.get('/', (req, res) => {
    res.send("API is running...");
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
