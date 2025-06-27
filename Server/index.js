import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
// import meetingRouter from './routes/MeetingRoutes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
// app.use('/api/meeting',meetingRouter)

connectDB();
connectCloudinary();

app.listen(port,() => {
    console.log(`Server is listening on ${port}`);
})
