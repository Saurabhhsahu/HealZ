import mongoose from 'mongoose'

const healthMonitoringSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required:true
        },
        date:{
            type: Date,
            required: true
        },
        heartRate:{
            type: Number,
            required: true
        },
        bloodPressure: {
            type: Number,
            required: true
        }
    }
)

const HealthMonitoring = mongoose.model("HealthMonitoring",healthMonitoringSchema);

export default HealthMonitoring;