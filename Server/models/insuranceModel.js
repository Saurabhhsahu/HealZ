import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required:true
        },
        provider: {
            type: String,
            required: true
        },
        policyNumber: {
            type: String,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        }
    }
)

const Insurance = mongoose.model("Insurance",insuranceSchema);

export default Insurance;