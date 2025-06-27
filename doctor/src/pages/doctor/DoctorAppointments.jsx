import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../Context/DoctorContext.jsx';
import DoctorAppointmentCard from '../../components/Appointment/AppointmentCard.jsx'; // Import the card component
import { Search, Filter, Calendar, Clock } from 'lucide-react';

function DoctorAppointments() {
  const { appointments, dToken, getAppointments } = useContext(DoctorContext);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const filterAppointments = () => {
    if (!appointments) return;

    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.userData?.contact?.includes(searchTerm) ||
        appointment.userId?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => {
        switch (statusFilter) {
          case 'upcoming':
            return !appointment.cancelled && !appointment.isCompleted && new Date(appointment.slotDate.split('_').reverse().join('-')) >= new Date();
          case 'completed':
            return appointment.isCompleted;
          case 'cancelled':
            return appointment.cancelled;
          case 'today':
            const today = new Date().toDateString();
            const appointmentDate = new Date(appointment.slotDate.split('_').reverse().join('-')).toDateString();
            return appointmentDate === today && !appointment.cancelled;
          case 'paid':
            return appointment.payment;
          case 'unpaid':
            return !appointment.payment && !appointment.cancelled;
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.slotDate.split('_').reverse().join('-'));
        switch (dateFilter) {
          case 'today':
            return appointmentDate.toDateString() === now.toDateString();
          case 'tomorrow':
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return appointmentDate.toDateString() === tomorrow.toDateString();
          case 'week':
            const weekFromNow = new Date(now);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return appointmentDate >= now && appointmentDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(now);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            return appointmentDate >= now && appointmentDate <= monthFromNow;
          default:
            return true;
        }
      });
    }

    // Sort by date and time (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.slotDate.split('_').reverse().join('-') + ' ' + a.slotTime);
      const dateB = new Date(b.slotDate.split('_').reverse().join('-') + ' ' + b.slotTime);
      return dateB - dateA;
    });

    setFilteredAppointments(filtered);
  };

  const getAppointmentStats = () => {
    if (!appointments) return { total: 0, today: 0, upcoming: 0, completed: 0 };

    const today = new Date().toDateString();
    const stats = {
      total: appointments.length,
      today: appointments.filter(apt => {
        const aptDate = new Date(apt.slotDate.split('_').reverse().join('-')).toDateString();
        return aptDate === today && !apt.cancelled;
      }).length,
      upcoming: appointments.filter(apt => 
        !apt.cancelled && !apt.isCompleted && 
        new Date(apt.slotDate.split('_').reverse().join('-')) >= new Date()
      ).length,
      completed: appointments.filter(apt => apt.isCompleted).length
    };

    return stats;
  };

  const stats = getAppointmentStats();

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="w-full mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Appointments
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage your patient appointments and consultations
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border transition-colors`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="flex items-center">
                <Clock className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.today}</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.upcoming}</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="flex items-center">
                <Calendar className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</span>
              </div>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by patient name, contact, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-[#00bf60] focus:border-transparent`}
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-[#00bf60] focus:border-transparent`}
              >
                <option value="all">All Status</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="min-w-[140px]">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-[#00bf60] focus:border-transparent`}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments && filteredAppointments.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Appointments ({filteredAppointments.length})
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? 'Filtered' : 'All'}
                  </span>
                </div>
              </div>
              
              {filteredAppointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  darkMode={darkMode}
                />
              ))}
            </>
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
              <Calendar className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {appointments && appointments.length === 0 
                  ? 'No appointments found'
                  : searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'No appointments match your filters'
                    : 'Loading appointments...'
                }
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {appointments && appointments.length === 0 
                  ? 'Your appointments will appear here once patients book consultations with you.'
                  : searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                    : 'Please wait while we load your appointments.'
                }
              </p>
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {filteredAppointments && filteredAppointments.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'today'
                  ? darkMode
                    ? 'bg-[#00bf60] text-white'
                    : 'bg-[#00bf60] text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              } border transition-colors text-sm`}
            >
              Today's Appointments
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'upcoming'
                  ? darkMode
                    ? 'bg-[#00bf60] text-white'
                    : 'bg-[#00bf60] text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              } border transition-colors text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'unpaid'
                  ? darkMode
                    ? 'bg-[#00bf60] text-white'
                    : 'bg-[#00bf60] text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              } border transition-colors text-sm`}
            >
              Pending Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;