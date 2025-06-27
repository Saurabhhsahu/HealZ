"use client"

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useUser } from '@/context/userContext'
import { Download, Share2, Shield, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const UserQRCode = ({closeModal}) => {
  const { profile, token } = useUser()
  const [isHovered, setIsHovered] = useState(false)

  // Get user data or use placeholder
  const user = profile?.user?.[0] || {
    name: "John Doe",
    id: "PT-10456",
    profileImage: "/placeholder.svg?height=40&width=40"
  }
  // In a real app, this would be a unique URL with the user's token
  // For this example, we're using a placeholder URL
  const url = token

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas')
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")

      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `${user.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  // Function to share QR code (simplified for demo)
  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Healthcare QR Code`,
        text: 'Scan this QR code to access my healthcare information',
        url: url
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(url)
      alert('URL copied to clipboard!')
    }
  }

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Patient ID: {user.id}</CardDescription>
            </div>
          </div>
          <Shield className="h-5 w-5 text-teal-500" />
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-0">
        <div
          className="relative flex justify-center p-4 bg-white rounded-lg transition-all duration-300"
          style={{
            boxShadow: isHovered
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Visible QR code */}
          <div className="p-2 border-4 border-white rounded-lg bg-white">
            <QRCodeSVG
              value={url}
              size={200}
              level="H"
              imageSettings={{
                src: "/placeholder.svg?height=40&width=40",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          {/* Hidden canvas for download functionality */}
          <div className="hidden">
            <QRCodeSVG
              id="qr-code-canvas"
              value={url}
              size={1000}
              level="H"
            />
          </div>

          {/* Animated corner decorations */}
          <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg border-teal-500 transition-all duration-300 ${isHovered ? 'w-8 h-8' : ''}`}></div>
          <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg border-teal-500 transition-all duration-300 ${isHovered ? 'w-8 h-8' : ''}`}></div>
          <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg border-teal-500 transition-all duration-300 ${isHovered ? 'w-8 h-8' : ''}`}></div>
          <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg border-teal-500 transition-all duration-300 ${isHovered ? 'w-8 h-8' : ''}`}></div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Scan this QR code to access patient information securely.
        </p>
      </CardContent>

      <CardFooter className="flex justify-center gap-2 pt-2 pb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
                onClick={downloadQRCode}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download QR Code</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download QR Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
                onClick={shareQRCode}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share QR Code</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share QR Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-4"
              >
                <User className="h-4 w-4 mr-2" />
                <span>Patient Portal</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Access Patient Portal</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}

export default UserQRCode
