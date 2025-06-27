import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, Award, Heart, User, ChevronDown, X } from 'lucide-react';
import { useUser } from "../context/userContext";
import { useNavigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';

const specialties = [
  'General physician',
  'Cardiologist', 
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist'
];

const Doctors = () => {
  const {speciality} = useParams();
  const { doctors } = useUser();
  const mockDoctors = doctors ? doctors : [];
  const [filterDoc, setFilterDoc] = useState(mockDoctors);
  const [selectedSpecialty, setSelectedSpecialty] = useState(speciality);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();

  const applyFilters = () => {
    let filtered = mockDoctors;

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(doc => doc.speciality === selectedSpecialty);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort doctors
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fees') return a.fees - b.fees;
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

    setFilterDoc(filtered);
  };

  const handleDoctorClick = (doctor) => {

  }

  useEffect(() => {
    applyFilters();
  }, [selectedSpecialty, searchTerm, sortBy]);

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty);
  };

  const clearFilters = () => {
    setSelectedSpecialty('');
    setSearchTerm('');
    setSortBy('rating');
  };

  console.log("got Doctors: ", mockDoctors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Find Your Perfect Doctor
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our network of specialized healthcare professionals and book your appointment today
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00bf60] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#00bf60] focus:border-transparent outline-none transition-all cursor-pointer"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="fees">Sort by Fee</option>
                  <option value="experience">Sort by Experience</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[#00bf60] text-white rounded-xl hover:bg-[#00a050] transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-4`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Specialties</h3>
                {(selectedSpecialty || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#00bf60] hover:text-[#00a050] flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => handleSpecialtyClick(specialty)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                      selectedSpecialty === specialty
                        ? 'bg-[#00bf60] text-white border-[#00bf60] shadow-md transform scale-[1.02]'
                        : 'border-gray-200 hover:border-[#00bf60] hover:bg-[#f0fdf4] hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{specialty}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedSpecialty === specialty
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {mockDoctors.filter(doc => doc.speciality === specialty).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {filterDoc.length} doctor{filterDoc.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterDoc.map((doctor) => (
                <DoctorCard 
                  key={doctor._id}
                  doctor={doctor}
                />
              ))}
            </div>

            {filterDoc.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[#00bf60] text-white rounded-xl hover:bg-[#00a050] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
        isHovered ? 'ring-2 ring-[#00bf60] ring-opacity-20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/appointment/${doctor._id}`)}
    >
      {/* Doctor Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#00bf60] to-[#00a050] overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            doctor.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              doctor.available ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {doctor.available ? 'Available' : 'Busy'}
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
          <p className="text-[#00bf60] font-medium mb-2">{doctor.speciality}</p>
          <p className="text-sm text-gray-500">{doctor.education}</p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-900">{doctor.rating}</span>
            <span className="text-sm text-gray-500">({doctor.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Award className="h-4 w-4" />
            {doctor.experience} years
          </div>
        </div>

        {/* Next Available - Dynamic based on availability */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {doctor.available ? 'Available Today' : 'Next Available Soon'}
          </span>
        </div>

        {/* Fee and Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Consultation</span>
            <p className="text-lg font-bold text-gray-900">${doctor.fees}</p>
          </div>
          <button
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              doctor.available
                ? 'bg-[#00bf60] text-white hover:bg-[#00a050] hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!doctor.available}
          >
            {doctor.available ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doctors;