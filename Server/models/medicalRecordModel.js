import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    conditions: [
        {
            name: { 
                type: String, 
                required: true 
            },
            since: { 
                type: String, 
                required: true 
            }, // Year or Date
            severity: { 
                type: String, 
                required: true 
            },
            notes: { 
                type: String 
            }
        }
    ],
    allergies: [
        {
            name: { 
                type: String, 
                required: true 
            },
            severity: { 
                type: String, 
                required: true 
            },
            reaction: { 
                type: String, 
                required: true 
            }
        }
    ],
    surgeries: [
        {
            procedure: { 
                type: String, 
                required: true 
            },
            date: { 
                type: Date, 
                required: true 
            },
            hospital: { 
                type: String, 
                required: true 
            }
        }
    ]
}, { timestamps: true });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;