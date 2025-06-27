"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@/context/userContext"
import { 
  Shield, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Download, 
  Phone, 
  HelpCircle,
  User,
  Clock,
  Star,
  ChevronRight,
  Plus,
  Heart
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

function Insurance({ darkMode }) {
  const [activeTab, setActiveTab] = useState("policies")
  const { profile } = useUser()
  const [pageHeight, setPageHeight] = useState("100vh")

  // Measure available height
  useEffect(() => {
    // Update height  window resize
    const updateHeight = () => {
      // Remove 80px for potential header/footer
      setPageHeight(`${window.innerHeight - 80}px`)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Sample insurance data
  const insurancePolicies = profile?.insurance || [
    {
      id: 1,
      provider: "HealthGuard Insurance",
      policyNumber: "HG-123456789",
      type: "Health Insurance",
      coverage: "Comprehensive",
      startDate: "2025-01-01",
      expiryDate: "2026-01-01",
      premium: "$250/month",
      beneficiaries: ["Self", "Spouse", "Children"],
      documents: ["Policy Document", "Terms & Conditions", "Coverage Details"]
    },
    {
      id: 2,
      provider: "LifeSecure",
      policyNumber: "LS-987654321",
      type: "Life Insurance",
      coverage: "$500,000",
      startDate: "2024-06-15",
      expiryDate: "2025-03-15",
      premium: "$150/month",
      beneficiaries: ["Spouse", "Children"],
      documents: ["Policy Document", "Beneficiary Form", "Payment Schedule"]
    }
  ]

  const claimHistory = [
    {
      id: 1,
      date: "2025-02-10",
      type: "Medical",
      provider: "General Hospital",
      amount: "$1,250.00",
      status: "Approved",
      policyNumber: "HG-123456789"
    },
    {
      id: 2,
      date: "2024-12-05",
      type: "Prescription",
      provider: "Central Pharmacy",
      amount: "$85.75",
      status: "Processed",
      policyNumber: "HG-123456789"
    },
    {
      id: 3,
      date: "2024-11-15",
      type: "Specialist Visit",
      provider: "Cardiology Associates",
      amount: "$350.00",
      status: "Pending",
      policyNumber: "HG-123456789"
    }
  ]

  // Check if a policy is expired
  const isExpired = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    return today > expiry
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const timeDiff = expiry - today
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  }

  return (
    <div 
      className={`w-full ${darkMode ? "bg-gray-900" : "bg-[#e6f7ef]"} transition-colors`} 
      style={{ minHeight: pageHeight }}
    >
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Insurance List */}
          <div className="w-full md:w-2/3">
            <Card className={`h-full overflow-hidden border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className={`px-4 py-4 ${darkMode ? "border-gray-800" : "border-gray-100"} border-b`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <CardTitle className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      <span className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#00bf60]" /> 
                        Insurance & Coverage
                      </span>
                    </CardTitle>
                    <CardDescription className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Manage your insurance policies and claims
                    </CardDescription>
                  </div>
                  <Button className="bg-[#00bf60] hover:bg-[#00a050] text-white font-medium transition-colors border-0 h-10">
                    <Plus className="mr-2 h-4 w-4" /> Add Policy
                  </Button>
                </div>
              </CardHeader>

              <div className="px-4 pt-4">
                <Tabs defaultValue="policies" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#00bf60] p-1 rounded-lg">
                    <TabsTrigger
                      value="policies"
                      className={`rounded-md ${activeTab === "policies" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Policies
                    </TabsTrigger>
                    <TabsTrigger 
                      value="claims" 
                      className={`rounded-md ${activeTab === "claims" ? "bg-white shadow-sm" : "text-white hover:bg-[#00a050]"}`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Claims History
                    </TabsTrigger>
                  </TabsList>

                  <CardContent className="px-0 py-4">
                    <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                      <TabsContent value="policies" className="m-0 space-y-4">
                        <div className="space-y-4">
                          {insurancePolicies.length > 0 ? (
                            insurancePolicies.map((policy) => (
                              <PolicyCard
                                key={policy.id}
                                policy={policy}
                                darkMode={darkMode}
                                isExpired={isExpired(policy.expiryDate)}
                                daysUntilExpiry={getDaysUntilExpiry(policy.expiryDate)}
                              />
                            ))
                          ) : (
                            <EmptyState
                              icon={<Shield className={`h-14 w-14 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                              message="No insurance policies available"
                              actionText="Add Insurance Policy"
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="claims" className="m-0 space-y-4">
                        <div className="space-y-4">
                          {claimHistory.length > 0 ? (
                            claimHistory.map((claim) => (
                              <ClaimCard
                                key={claim.id}
                                claim={claim}
                                darkMode={darkMode}
                              />
                            ))
                          ) : (
                            <EmptyState
                              icon={<FileText className={`h-14 w-14 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />}
                              message="No claims history available"
                              actionText="File a Claim"
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  </CardContent>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Quick Actions Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#00bf60]" /> 
                    Quick Actions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <FileText className="mr-2 h-4 w-4" /> File a New Claim
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Download className="mr-2 h-4 w-4" /> Download Policy Documents
                </Button>
                <Button className="w-full justify-start bg-[#e6f7ef] hover:bg-[#d0f0e2] text-[#00bf60]">
                  <Phone className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Coverage Summary Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#00bf60]" /> 
                    Coverage Summary
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-[#e6f7ef]"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Active Policies</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">
                      {insurancePolicies.filter(policy => !isExpired(policy.expiryDate)).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Expiring Soon (30 days)</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">
                      {insurancePolicies.filter(policy => !isExpired(policy.expiryDate) && getDaysUntilExpiry(policy.expiryDate) <= 30).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Pending Claims</span>
                    <Badge className="bg-[#e6f7ef] text-[#00bf60]">
                      {claimHistory.filter(claim => claim.status === "Pending").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className={`border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#00bf60]" />
                    Insurance Support
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-[#e6f7ef] bg-[#e6f7ef]"}`}>
                  <div className="text-sm text-center">
                    <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Need assistance with your insurance? Our specialists are available 24/7 to help you.
                    </p>
                    <Button className="bg-[#00bf60] hover:bg-[#00a050] text-white">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const PolicyCard = ({ policy, darkMode, isExpired, daysUntilExpiry }) => {
  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        {/* Policy Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isExpired
                ? darkMode
                  ? "bg-red-900 bg-opacity-20 text-red-500"
                  : "bg-red-50 text-red-600"
                : darkMode
                  ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                  : "bg-[#e6f7ef] text-[#00bf60]"
              }`}
          >
            <Shield size={20} />
          </div>
          <div>
            <h3 className={`font-medium text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {policy.provider}
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{policy.type}</p>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <FileText className={`h-3.5 w-3.5 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              Policy No: {policy.policyNumber}
            </div>
          </div>
        </div>

        {/* Status & Expiry */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            Coverage: {policy.coverage}
          </p>
          <div className="flex items-center mt-1 justify-end">
            <Calendar size={14} className="text-gray-400 mr-1" />
            <p className={`text-sm font-medium ${
              isExpired 
                ? "text-red-600" 
                : daysUntilExpiry <= 30 
                  ? "text-amber-600" 
                  : darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {isExpired ? "Expired on: " : "Expires on: "}
              {new Date(policy.expiryDate).toLocaleDateString()}
            </p>
          </div>
          <Badge
            className={`mt-1 font-normal ${
              isExpired
                ? "bg-red-50 text-red-700 hover:bg-red-50"
                : daysUntilExpiry <= 30
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                  : darkMode
                    ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                    : "bg-[#e6f7ef] text-[#00bf60] hover:bg-[#e6f7ef]"
              }`}
          >
            {isExpired 
              ? "Expired" 
              : daysUntilExpiry <= 30 
                ? `Expires in ${daysUntilExpiry} days` 
                : "Active"}
          </Badge>
        </div>
      </div>

      {/* Policy Details Section */}
      <div className="mt-4 ml-0 sm:ml-14">
        <div className={`pl-4 border-l ${darkMode ? "border-gray-700" : "border-[#e6f7ef]"}`}>
          <div className="flex items-center mb-1">
            <User className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Beneficiaries:</h4>
          </div>

          <div className="flex items-center mt-2 mb-1">
            <Clock className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h4 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Premium:
            </h4>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{policy.premium}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 ml-0 sm:ml-14 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`text-sm ${darkMode ? "border-[#00bf60] bg-opacity-10 text-[#00bf60] hover:bg-[#00bf60] hover:bg-opacity-20" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
        >
          <FileText size={14} className="mr-2" />
          View Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
        >
          <Download size={14} className="mr-2" />
          Download Documents
        </Button>
        {isExpired && (
          <Button
            size="sm"
            className="text-sm bg-[#00bf60] hover:bg-[#00a050] text-white"
          >
            Renew Policy
          </Button>
        )}
      </div>
    </div>
  )
}

const ClaimCard = ({ claim, darkMode }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved":
        return darkMode 
          ? { bg: "bg-green-900 bg-opacity-20", text: "text-green-500" }
          : { bg: "bg-green-50", text: "text-green-700" };
      case "Pending":
        return darkMode 
          ? { bg: "bg-amber-900 bg-opacity-20", text: "text-amber-500" }
          : { bg: "bg-amber-50", text: "text-amber-700" };
      case "Processed":
        return darkMode 
          ? { bg: "bg-blue-900 bg-opacity-20", text: "text-blue-500" }
          : { bg: "bg-blue-50", text: "text-blue-700" };
      case "Denied":
        return darkMode 
          ? { bg: "bg-red-900 bg-opacity-20", text: "text-red-500" }
          : { bg: "bg-red-50", text: "text-red-700" };
      default:
        return darkMode 
          ? { bg: "bg-gray-800", text: "text-gray-300" }
          : { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const statusStyle = getStatusColor(claim.status);

  return (
    <div
      className={`p-4 rounded-xl border ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
        } transition-all shadow-sm hover:shadow`}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        {/* Claim Details */}
        <div className="flex items-start gap-3">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              darkMode
                ? "bg-[#e6f7ef] bg-opacity-20 text-[#00bf60]"
                : "bg-[#e6f7ef] text-[#00bf60]"
            }`}
          >
            <FileText size={20} />
          </div>
          <div>
            <h3 className={`font-medium text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              {claim.type} Claim
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{claim.provider}</p>
            <div className={`flex items-center mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <Calendar className={`h-3.5 w-3.5 mr-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              {new Date(claim.date).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Amount & Status */}
        <div className="text-left sm:text-right ml-10 sm:ml-0 mt-1 sm:mt-0">
          <p className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {claim.amount}
          </p>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Policy: {claim.policyNumber}
          </p>
          <Badge
            className={`mt-1 font-normal ${statusStyle.bg} ${statusStyle.text}`}
          >
            {claim.status}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 ml-0 sm:ml-14 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`text-sm ${darkMode ? "border-[#00bf60] bg-opacity-10 text-[#00bf60] hover:bg-[#00bf60] hover:bg-opacity-20" : "border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]"}`}
        >
          <FileText size={14} className="mr-2" />
          View Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`text-sm ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
        >
          <Download size={14} className="mr-2" />
          Download Documents
        </Button>
        {claim.status === "Pending" && (
          <Button
            variant="outline"
            size="sm"
            className={`text-sm ${darkMode ? "border-amber-500 text-amber-500 hover:bg-amber-900 hover:bg-opacity-20" : "border-amber-500 text-amber-600 hover:bg-amber-50"}`}
          >
            Check Status
          </Button>
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ icon, message, actionText, darkMode }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-64 text-center p-6 rounded-xl border border-dashed ${darkMode ? "border-gray-700 bg-gray-800 bg-opacity-50" : "border-[#e6f7ef] bg-[#e6f7ef] bg-opacity-50"}`}>
      <div className="mb-4">{icon}</div>
      <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-600"} font-medium`}>{message}</p>
      <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"} mt-2 max-w-md`}>
        Get lifetime coverage with our comprehensive insurance plans tailored to your needs.
      </p>
      <Button className="mt-4 bg-[#00bf60] hover:bg-[#00a050] text-white">
        <Plus className="mr-2 h-4 w-4" /> {actionText || "Add Policy"}
      </Button>
    </div>
  )
}

export default Insurance