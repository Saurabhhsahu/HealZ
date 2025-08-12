import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from "../context/userContext";
import RelatedDoctors from '../components/dashboard/RelatedDoctors.jsx';
// import { toast } from 'react-toastify';
import axios from 'axios';

function Appointments() {
  const { docId } = useParams();
  const [doc, setDoc] = useState({});
  const [docSlot, setDocSlot] = useState([]);
  const [slotIdx, setSlotIdx] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { doctors, token, fetchDoctors, backendUrl } = useUser();
  const navigate = useNavigate();

  const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const findDoc = () => {
    setLoading(true);
    const doctor = doctors.find(doc => doc._id === docId);
    if (doctor) {
      setDoc(doctor);
    } else {
      toast.error('Doctor not found');
      navigate('/doctors');
    }
    setLoading(false);
  };

  const getAvailableSlots = async () => {
    if (!doc._id) return;
    
    setDocSlot([]);
    
    let today = new Date();
    let startHour = 10;
    let endHour = 21;
    
    // Check if doctor is available
    if (!doc.available) {
      toast.info('Doctor is currently not available for appointments');
      return;
    }
    
    let isTooLateToday = today.getHours() >= endHour - 1;
    let slotsGenerated = 0;
    let dayOffset = isTooLateToday ? 1 : 0; // Start from tomorrow if too late today
  
    for (let i = dayOffset; i < 7 && slotsGenerated < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      let endTime = new Date(currentDate);
      endTime.setHours(endHour, 0, 0, 0);
  
      if (i === 0 && !isTooLateToday) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, startHour));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(startHour);
        currentDate.setMinutes(0);
      }
  
      let timeSlots = [];
  
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        
        const isSlotAvailable = !(doc.slots_booked && 
                                 doc.slots_booked[slotDate] && 
                                 doc.slots_booked[slotDate].includes(formattedTime));
        
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          });
        }
  
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
  
      if (timeSlots.length > 0) {
        setDocSlot(prev => ([...prev, timeSlots]));
        slotsGenerated++;
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    setBookingLoading(true);

    try {
      const date = docSlot[slotIdx][0].dateTime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;
      const backendUri = import.meta.env.VITE_BACKEND_URI || backendUrl;

      const { data } = await axios.post(
        `${backendUri}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { Authorization : token } }
      );

      if (data.success) {
        // toast.success(data.message || 'Appointment booked successfully!');
        await fetchDoctors(); // Refresh doctor data
        navigate('/appointments');
      } else {
        // toast.error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Booking error:', err);
      // toast.error(err.response?.data?.message || 'Something went wrong while booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatAddress = (addressString) => {
    if (!addressString) return '';
    
    try {
      // If it's already an object, use it directly
      if (typeof addressString === 'object') {
        const address = addressString;
        return `${address.line1 || ''}${address.line2 ? `, ${address.line2}` : ''}`;
      }
      
      // If it's a string, try to parse it
      const address = JSON.parse(addressString);
      return `${address.line1 || ''}${address.line2 ? `, ${address.line2}` : ''}`;
    } catch {
      // If parsing fails, return the original string
      return String(addressString);
    }
  };

  const resetSlotSelection = () => {
    setSlotIdx(0);
    setSlotTime('');
  };

  useEffect(() => {
    if (doctors.length > 0) {
      findDoc();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (doc._id) {
      getAvailableSlots();
      resetSlotSelection();
    }
  }, [doc]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading doctor information...</div>
      </div>
    );
  }

  if (!doc._id) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Doctor not found</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center gap-6 max-w-6xl mx-auto p-4'>
      {/* Doctor Profile Section */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Doctor Image */}
        <div className="lg:w-1/3">
          <img
            className="w-full h-64 lg:h-full object-cover"
            src={doc.image}
            alt={doc.name}
            onError={(e) => {
              e.target.src = '/default-doctor.jpg'; // Fallback image
            }}
          />
        </div>

        {/* Doctor Information */}
        <div className="lg:w-2/3 p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {doc.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {doc.degree}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {doc.speciality}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {doc.experience} years exp.
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{doc.rating}</span>
                <span className="text-gray-500">({doc.reviews} reviews)</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                doc.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {doc.available ? 'Available' : 'Not Available'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{doc.about}</p>
            </div>

            {doc.education && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Education</h3>
                <p className="text-gray-600">{doc.education}</p>
              </div>
            )}

            {doc.address && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-600">{formatAddress(doc.address) || 'Address not available'}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Consultation Fee:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${doc.fees}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      {doc.available && (
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
          
          {docSlot.length > 0 ? (
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Select Date</h3>
                <div className='flex flex-wrap gap-3'>
                  {docSlot.map((item, index) => (
                    <button
                      key={index}
                      className={`flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                        slotIdx === index 
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      } py-3 px-4 min-w-[80px] rounded-lg text-sm font-medium cursor-pointer`}
                      onClick={() => {
                        setSlotIdx(index);
                        setSlotTime(''); // Reset time selection when date changes
                      }}
                    >
                      <span className="text-xs opacity-75">
                        {dayOfWeek[item[0].dateTime.getDay()]}
                      </span>
                      <span className="text-lg font-bold">
                        {item[0].dateTime.getDate()}
                      </span>
                      <span className="text-xs opacity-75">
                        {monthNames[item[0].dateTime.getMonth()]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Select Time</h3>
                <div className='flex flex-wrap gap-3 max-h-48 overflow-y-auto'>
                  {docSlot[slotIdx]?.map((item, index) => (
                    <button
                      key={index}
                      className={`border-2 transition-all duration-200 ${
                        slotTime === item.time 
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
                          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      } rounded-lg text-sm font-medium cursor-pointer py-3 px-4 min-w-[100px]`}
                      onClick={() => setSlotTime(item.time)}
                    >
                      {item.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <div className='flex justify-center lg:justify-start pt-4'>
                <button 
                  onClick={bookAppointment}
                  disabled={!slotTime || bookingLoading}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                    !slotTime || bookingLoading
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {bookingLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No available slots at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      )}

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={doc.speciality} />
    </div>
  );
}

export default Appointments;