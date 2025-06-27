import mongoose from 'mongoose';

const glucoseTrendSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        month: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    }
)

const GlucoseTrend = mongoose.model("GlucoseTrend", glucoseTrendSchema);

export default GlucoseTrend;