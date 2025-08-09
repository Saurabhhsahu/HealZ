"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/userContext"
import { motion } from "framer-motion"
import { Calendar, Edit2, Mail, MapPin, Phone, Save, User, X, Camera, Heart } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

function Profile({ darkMode }) {
  const { profile, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  
  // State to hold the actual file for upload
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Default user data structure
  const defaultUser = {
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    password: "",
    occupation: "",
    address: "",
    emergencyContact: {
      name: "Jane Doe",
      relation: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    profileImage: "/placeholder.svg?height=200&width=200"
  }

  // Get current user data with proper fallback
  const getCurrentUser = () => {
    if (profile?.user && Array.isArray(profile.user) && profile.user.length > 0) {
      return { ...defaultUser, ...profile.user[0] }
    }
    return defaultUser
  }

  const [user, setUser] = useState(getCurrentUser())
  const [formData, setFormData] = useState({})

  // Update user state when profile context changes
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (!isEditing) {
      setFormData(currentUser)
    }
  }, [profile])

  // Initialize form data when starting to edit
  const handleStartEdit = () => {
    const currentUser = getCurrentUser()
    setFormData({
      ...currentUser,
      emergencyContact: {
        ...currentUser.emergencyContact
      }
    })
    setProfileImageFile(null); // Reset file on edit start
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Use FormData to handle multipart/form-data for file uploads
      const dataToSave = new FormData();

      // Append all form fields from the formData state
      Object.keys(formData).forEach(key => {
        // Handle nested objects by stringifying them, as the backend expects
        if (key === 'emergencyContact' && typeof formData[key] === 'object') {
          dataToSave.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'profileImage') { // Don't append the old image URL
           dataToSave.append(key, formData[key]);
        }
      });
      
      // Append the new profile image file if one was selected
      if (profileImageFile) {
        dataToSave.append('profileImage', profileImageFile);
      }
      
      console.log("Saving profile data..."); // FormData objects are hard to log directly

      // The updateProfile function from your context now receives FormData
      const updatedUser = await updateProfile(dataToSave);

      // Update local user state with the response from the server
      if(updatedUser) {
        setUser(updatedUser);
      } else {
        // Fallback to optimistic update if API doesn't return updated user
        setUser(formData);
      }

      setIsEditing(false)
      setProfileImageFile(null); // Clear the file after saving

      console.log("Profile updated successfully!")

    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    const currentUser = getCurrentUser()
    setFormData({
      ...currentUser,
      emergencyContact: {
        ...currentUser.emergencyContact
      }
    })
    setProfileImageFile(null); // Reset file on cancel
    setIsEditing(false)
  }

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file for upload
      setProfileImageFile(file);
      
      // Create a temporary local URL for previewing the image
      const imageUrl = URL.createObjectURL(file);
      
      // Update formData to show the new image preview immediately
      setFormData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  }

  // Set colors based on dark mode
  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const cardBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBgColor = darkMode ? "bg-gray-700" : "bg-muted/20";
  const inputTextColor = darkMode ? "text-gray-300" : "text-gray-700";
  const iconColor = darkMode ? "text-gray-400" : "text-gray-500";
  
  // Determine which image to display (live preview or saved user image)
  const displayImage = isEditing && formData.profileImage ? formData.profileImage : user.profileImage;


  return (
    <motion.div
      className={`container min-h-screen mx-auto py-6 px-3 sm:px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header */}
      <motion.div className="flex flex-col items-center mb-6 sm:mb-8" variants={itemVariants}>
        <div className="relative mb-4 group">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[#00bf60] shadow-xl">
            <AvatarImage src={displayImage} alt={user.name} />
            <AvatarFallback className={`text-3xl sm:text-4xl bg-[#e6f7ef] text-[#00bf60]`}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full bg-[#00bf60] hover:bg-[#00a050] text-white"
                onClick={handleAvatarClick}
              >
                <Camera className="h-4 w-4" />
              </Button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>
        <motion.h1
          className={`text-2xl sm:text-3xl font-bold mb-1 ${textColor}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user.name}
        </motion.h1>

        <div className="flex gap-2 mt-1 mb-3">
          <Badge className="bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef] hover:text-[#00bf60]">{user.bloodGroup}</Badge>
          <Badge className="bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef] hover:text-[#00bf60]">{user.gender}</Badge>
          <Badge className="bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef] hover:text-[#00bf60]">{user.age} years</Badge>
        </div>

        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 bg-[#00bf60] hover:bg-[#00a050] text-white border-0 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef] hover:text-[#00bf60] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleStartEdit} className="flex items-center gap-1 bg-[#00bf60] hover:bg-[#00a050] text-white border-0">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Profile Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 text-white bg-[#00bf60] p-1 rounded-lg max-w-md mx-auto">
            <TabsTrigger
              value="personal"
              className={`rounded-md text-sm ${activeTab === "personal" ? "bg-white text-gray-900 shadow-sm" : "text-white hover:bg-[#00a050]"}`}
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className={`rounded-md text-sm ${activeTab === "contact" ? "bg-white text-gray-900 shadow-sm" : "text-white hover:bg-[#00a050]"}`}
            >
              Contact Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className={`${cardBgColor} ${borderColor} border shadow-sm`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#00bf60]" />
                    <CardTitle className={`${textColor}`}>Personal Information</CardTitle>
                  </div>
                  <CardDescription className={`${mutedTextColor}`}>Your basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`${textColor}`}>Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.name || "Not specified"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className={`${textColor}`}>Gender</Label>
                      {isEditing ? (
                        <Input
                          id="gender"
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.gender || "Not specified"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className={`${textColor}`}>Age</Label>
                      {isEditing ? (
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.age || "Not specified"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup" className={`${textColor}`}>Blood Group</Label>
                      {isEditing ? (
                        <Input
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.bloodGroup || "Not specified"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation" className={`${textColor}`}>Occupation</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} ${textColor}`}>{user.occupation || "Not specified"}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className={`${cardBgColor} ${borderColor} border shadow-sm`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#00bf60]" />
                    <CardTitle className={`${textColor}`}>Contact Information</CardTitle>
                  </div>
                  <CardDescription className={`${mutedTextColor}`}>Your contact details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`${textColor}`}>Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <Mail className={`h-4 w-4 ${iconColor}`} />
                          {user.email || "Not specified"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className={`${textColor}`}>Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="contact"
                          name="contact"
                          value={formData.contact || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <Phone className={`h-4 w-4 ${iconColor}`} />
                          {user.contact || "Not specified"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className={`${textColor}`}>Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          name="address"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          className={`${inputBgColor} ${inputTextColor} border-[#00bf60] focus-visible:ring-[#00bf60]`}
                        />
                      ) : (
                        <div className={`p-2 border ${borderColor} rounded-md ${inputBgColor} flex items-center gap-2 ${textColor}`}>
                          <MapPin className={`h-4 w-4 ${iconColor}`} />
                          {user.address || "Not specified"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

export default Profile
