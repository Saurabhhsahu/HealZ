import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [profile, setProfile] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    const backendUri = import.meta.env.VITE_BACKEND_URI || "${backendUri}";

    const modelMap = {
        user: "User",
        glucoseTrends: "GlucoseTrend",
        healthMonitorings: "HealthMonitoring",
        insurance: "Insurance",
        labReports: "LabReport",
        medicalRecords: "MedicalRecord",
        medications: "Medication",
    };

    const signin = async ({ email, password }) => {
        try {
            const res = await axios.post(`${backendUri}/api/user/signin`, { email, password });
            if (!res.data.success) {
                console.log("Error in signing in:", res);
                return;
            }
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.log(`Error in signing in:`, err.message);
        }
    };

    const signup = async (userData) => {
        console.log("Signup request body:", userData);
        
        try {
            const res = await axios.post(`${backendUri}/api/user/signup`, userData);
            if (!res.data.success) {
                console.log("Error in signing up:", res);
                return;
            }
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.log(`Error in signing up:`, err.message);
        }
    };

    const getProfileDetails = async (detailType) => {
        try {
            const res = await axios.post(
                `${backendUri}/api/user/getUserDetail`,
                { detailType },
                { headers: { Authorization: `${token}` } }
            );
            const data = res.data.data;
            setProfile(prev => ({ ...prev, [detailType]: data }));
            return data;
        } catch (error) {
            console.log(`Error in fetching ${detailType}:`, error);
        }
    };

    const fetchAllProfileDetails = async () => {
        const promises = Object.keys(modelMap).map(detailType => getProfileDetails(detailType));
        await Promise.all(promises);
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${backendUri}/api/user/list-appointment`, {
                headers: { Authorization: `${token}` }
            });
            setAppointments(res.data.appointments);
        } catch (error) {
            console.log("Error in fetching appointments:", error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${backendUri}/api/doctor/list`);
            setDoctors(res.data.doctors);
        } catch (error) {
            console.log("Error in fetching doctors:", error);
        }
    };

    const updateProfile = async (updateData) => {
        try {
            const res = await axios.post(`${backendUri}/api/user/update-profile`, updateData, {
                headers: { Authorization: `${token}` }
            });
            if (!res.data.success) {
                console.log("Error in updating profile:", res.data.message);
                return;
            }
            console.log("Profile updated successfully:", res.data.user);
        } catch (err) {
            console.log("Error in updating profile:", err.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllProfileDetails();
            fetchAppointments();
            fetchDoctors();
        }
    }, [token]);

    const value = {
        profile,
        getProfileDetails,
        fetchAllProfileDetails,
        token,
        setToken,
        signin,
        signup,
        appointments,
        doctors,
        fetchDoctors,
        updateProfile
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
