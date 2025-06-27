"use client"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useUser } from "../context/userContext"
import { useState, useEffect } from "react"
import {
  BarChart3,
  Wallet,
  Home,
  LogOut,
  PieChart,
  LineChart,
  Stethoscope,
  Settings,
  User,
  CreditCard,
  Calendar,
  HelpCircle,
  Menu,
  X,
  ChevronRight
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import logo from '../assets/logo.png'


function Sidebar({ darkMode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, setToken } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const user = profile?.user?.[0] || {
    name: "Dwayne Tatum",
    role: "CEO Assistant",
    email: "dwayne@example.com",
    profileImage: "/placeholder.svg?height=40&width=40",
  }

  // Redirect to dashboard if no specific route is selected
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      navigate("/dashboard")
    }
  }, [location, navigate])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Navigation items with icons - updated for financial theme
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/profile", label: "Profile", icon: CreditCard },
    { path: "/appointments", label: "Appoitments", icon: CreditCard },
    { path: "/doctors", label: "Doctors", icon: Stethoscope },
    { path: "/medical-records", label: "Medical Records", icon: Wallet },
    { path: "/lab-records", label: "Lab Records", icon: LineChart },
    { path: "/medication", label: "Medication", icon: BarChart3 },
    { path: "/insurance", label: "Insurance", icon: PieChart },
  ]

  // Logout handler
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/")
  }

  const bgColor = "bg-white";
  const textColor = "text-gray-900";
  const secondaryTextColor = "text-gray-500";
  const borderColor = "border-gray-200";
  const activeItemBg = "bg-[#00bf60]";
  const hoverItemBg = "hover:bg-[#e6f7ef]";
  const helpSectionBg = "bg-[#e6f7ef]";
  const logoContainerBg = "bg-[#00bf60]";

  return (
    <>
      {/* Mobile Menu Toggle Button - Visible only on small screens */}
      <div className="fixed top-4 left-4 z-40 sm:hidden">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 p-0 rounded-full bg-[#00bf60] hover:bg-[#00a050] text-white"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`h-screen transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'} fixed sm:static top-0 left-0 z-50 w-64 sm:w-auto`}>
        <SidebarProvider>
          <ShadcnSidebar className={`h-full ${borderColor} border-r ${bgColor}`}>
            <SidebarHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="rounded-full">
                  <img
                    src={logo}
                    alt="JIVA Logo"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-26 md:h-14 object-contain"
                  />
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3">
              <SidebarMenu className="space-y-1 py-3">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.path
                        ? `${activeItemBg} text-white font-medium`
                        : `${secondaryTextColor} ${hoverItemBg} hover:text-gray-900 text-wh`
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`h-5 w-5 ${location.pathname === item.path ? "text-white" : secondaryTextColor}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {location.pathname === item.path && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <div className="mx-4 my-6">
              <div className={`${helpSectionBg} rounded-xl p-4`}>
                <div className="flex items-center space-x-3 mb-2">
                  <HelpCircle className="h-5 w-5 text-[#00bf60]" />
                  <span className={`text-sm font-medium ${textColor}`}>Need help?</span>
                </div>
                <p className={`text-xs ${secondaryTextColor} mb-3`}>Contact our support team for assistance</p>
                <Button className="w-full bg-[#00bf60] hover:bg-[#00a050] text-white text-xs rounded-lg">
                  Contact Support
                </Button>
              </div>
            </div>

            <SidebarFooter className={`border-t ${borderColor} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-[#00bf60] shadow-sm">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-[#e6f7ef] text-[#00bf60]">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${textColor}`}>{user.name}</p>
                    <p className={`text-xs ${secondaryTextColor} truncate`}>{user.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${secondaryTextColor} hover:text-[#00bf60] hover:bg-transparent`}
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </SidebarFooter>
          </ShadcnSidebar>
        </SidebarProvider>
      </div>
    </>
  )
}

export default Sidebar