// import Appointment from "../models/appointmentModel.js";

// const VIDEOSDK_API_URL = 'https://api.videosdk.live/v2/rooms';
// const VIDEOSDK_AUTH_TOKEN = import.meta.env.VIDEOSDK_AUTH_TOKEN || 'your-videosdk-token';

// const createMeeting = async(req,res) => {
//     try {
//     const { appointmentId } = req.body;

//     if (!appointmentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Appointment ID is required'
//       });
//     }

//     // Check if appointment exists and already has a meeting ID
//     let appointment = await Appointment.findById(appointmentId);
    
//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Appointment not found'
//       });
//     }

//     // If appointment already has a meeting ID, return it
//     if (appointment.meetingId) {
//       return res.status(200).json({
//         success: true,
//         meetingId: appointment.meetingId,
//         message: 'Meeting already exists for this appointment'
//       });
//     }

//     // Create new meeting room via VideoSDK API
//     const videoSDKResponse = await fetch(VIDEOSDK_API_URL, {
//       method: 'POST',
//       headers: {
//         'authorization': VIDEOSDK_AUTH_TOKEN,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({})
//     });

//     if (!videoSDKResponse.ok) {
//       throw new Error(`VideoSDK API error: ${videoSDKResponse.status}`);
//     }

//     const { roomId } = await videoSDKResponse.json();

//     // Update appointment with meeting ID
//     appointment.meetingId = roomId;
//     appointment.meetingStatus = 'scheduled';
//     appointment.updatedAt = new Date();
    
//     await appointment.save();

//     console.log(`Meeting created for appointment ${appointmentId}: ${roomId}`);

//     res.status(200).json({
//       success: true,
//       meetingId: roomId,
//       appointmentId: appointmentId,
//       message: 'Meeting created successfully'
//     });

//   } catch (error) {
//     console.error('Error creating meeting:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create meeting',
//       error: error.message
//     });
//   }
// }

// const getMeeting = async(req, res) => {
//     try {
//     const { appointmentId } = req.params;

//     const appointment = await Appointment.findById(appointmentId);
    
//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Appointment not found'
//       });
//     }

//     if (!appointment.meetingId) {
//       return res.status(404).json({
//         success: false,
//         message: 'No meeting found for this appointment'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       meetingId: appointment.meetingId,
//       appointmentId: appointmentId
//     });

//   } catch (error) {
//     console.error('Error fetching meeting:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch meeting details',
//       error: error.message
//     });
//   }
// }

// const updateMeeting = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { status } = req.body; // 'started', 'ended', 'cancelled'

//     const appointment = await Appointment.findById(appointmentId);
    
//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Appointment not found'
//       });
//     }

//     appointment.meetingStatus = status;
//     appointment.updatedAt = new Date();
    
//     if (status === 'ended') {
//       appointment.isCompleted = true;
//     }

//     await appointment.save();

//     res.status(200).json({
//       success: true,
//       message: 'Meeting status updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating meeting status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update meeting status',
//       error: error.message
//     });
//   }
// }

// export {
//   createMeeting,getMeeting,updateMeeting
// };

