"use client"

import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Download, FileText, Loader2, Settings, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PatientDashboard from "./PatientDashboard"
import QRCodeDashboard from "@/components/QRCodeDashboard"

function DashboardExport() {
  const patientDashboardRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [paperSize, setPaperSize] = useState("a4")
  const [orientation, setOrientation] = useState("portrait")
  const [includeHeader, setIncludeHeader] = useState(true)
  const [quality, setQuality] = useState("high")
  
  // Convert modern color formats (oklch/oklab) to RGB
  const convertColorToRgb = (colorStr) => {
    // Default fallback color if parsing fails
    const fallbackColor = "rgb(0, 0, 0)"
    
    try {
      // Check if it's not a modern color format
      if (!colorStr.includes("oklch") && !colorStr.includes("oklab")) {
        return colorStr
      }
      
      // Extract color format and components
      let format = ''
      let match = null
      
      if (colorStr.includes("oklch")) {
        format = 'oklch'
        // Match format: oklch(60% 0.2 180 / 0.5)
        match = colorStr.match(/oklch\(\s*([0-9.]+)%?\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)/)
      } else if (colorStr.includes("oklab")) {
        format = 'oklab'
        // Match format: oklab(0.6 -0.1 0.2 / 0.5)
        match = colorStr.match(/oklab\(\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)(?:\s*\/\s*([0-9.]+))?\s*\)/)
      }
      
      if (!match) return fallbackColor
      
      // Get component values based on format
      let l, a, b, h, c, alpha
      
      if (format === 'oklch') {
        l = parseFloat(match[1]) / 100  // Lightness (0-1)
        c = parseFloat(match[2])        // Chroma
        h = parseFloat(match[3])        // Hue in degrees
        alpha = match[4] ? parseFloat(match[4]) : 1 // Alpha
        
        // Convert to approximate sRGB (simplified)
        // This is a rough approximation - a proper conversion would be more complex
        const hslL = l * 100
        const hslS = Math.min(c * 100, 100)
        const hslH = h
        
        // Get RGB values
        const [r, g, b] = hslToRgb(hslH, hslS, hslL)
        
        // Return RGB or RGBA
        return alpha < 1 
          ? `rgba(${r}, ${g}, ${b}, ${alpha})` 
          : `rgb(${r}, ${g}, ${b})`
      } 
      else if (format === 'oklab') {
        l = parseFloat(match[1])  // Lightness
        a = parseFloat(match[2])  // Green-red component
        b = parseFloat(match[3])  // Blue-yellow component
        alpha = match[4] ? parseFloat(match[4]) : 1 // Alpha
        
        // Approximate conversion from oklab to sRGB
        // This is a simplified approach that maps to HSL first
        // Map lightness
        const hslL = l * 100
        
        // Derive saturation from a & b components
        const saturation = Math.sqrt(a*a + b*b) * 100
        const hslS = Math.min(saturation * 1.5, 100) // Scale up a bit
        
        // Derive hue from a & b
        let hue = Math.atan2(b, a) * (180 / Math.PI)
        if (hue < 0) hue += 360
        const hslH = hue
        
        // Get RGB values
        const [r, g, bl] = hslToRgb(hslH, hslS, hslL)
        
        // Return RGB or RGBA
        return alpha < 1 
          ? `rgba(${r}, ${g}, ${bl}, ${alpha})` 
          : `rgb(${r}, ${g}, ${bl})`
      }
      
      return fallbackColor
    } catch (e) {
      console.warn("Error converting color", colorStr, e)
      return fallbackColor
    }
  }
  
  // Helper function: Convert HSL to RGB (standard algorithm)
  const hslToRgb = (h, s, l) => {
    h = h % 360
    h /= 360
    s /= 100
    l /= 100
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
  
  // Remove modern color formats from CSS in a DOM node
  const sanitizeColors = (element) => {
    // Process all elements including the root
    const elements = [element, ...Array.from(element.querySelectorAll("*"))]
    
    elements.forEach(el => {
      try {
        // Check if it's an SVG element
        const isSvgElement = el.namespaceURI === "http://www.w3.org/2000/svg"
        
        // Process SVG elements differently
        if (isSvgElement) {
          // Get all SVG attributes that might have color values
          const colorAttributes = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color']
          
          for (const attr of colorAttributes) {
            if (el.hasAttribute(attr)) {
              const value = el.getAttribute(attr)
              if (value && (value.includes('oklch') || value.includes('oklab'))) {
                el.setAttribute(attr, convertColorToRgb(value))
              }
            }
          }
          
          // Handle style attribute in SVG elements
          if (el.hasAttribute('style')) {
            const style = el.getAttribute('style')
            if (style && (style.includes('oklch') || style.includes('oklab'))) {
              el.setAttribute('style', processCssText(style))
            }
          }
        } 
        // Handle regular DOM elements
        else {
          // Process inline style attribute
          if (el.hasAttribute('style')) {
            const style = el.getAttribute('style')
            if (style && (style.includes('oklch') || style.includes('oklab'))) {
              el.setAttribute('style', processCssText(style))
            }
          }
          
          // Process computed styles
          const computedStyle = window.getComputedStyle(el)
          let newStyles = ''
          
          // List of CSS properties that might contain colors
          const colorProperties = [
            'color', 'background-color', 'border-color', 'border-top-color', 
            'border-right-color', 'border-bottom-color', 'border-left-color',
            'outline-color', 'text-decoration-color', 'box-shadow', 'text-shadow',
            'background-image', 'border-image', 'caret-color'
          ]
          
          // Check each color property
          for (const prop of colorProperties) {
            const value = computedStyle.getPropertyValue(prop)
            if (value && (value.includes('oklch') || value.includes('oklab'))) {
              newStyles += `${prop}: ${convertColorToRgb(value)} !important; `
            }
          }
          
          // Apply new styles if needed
          if (newStyles) {
            const currentStyle = el.getAttribute('style') || ''
            el.setAttribute('style', currentStyle + newStyles)
          }
        }
      } catch (err) {
        console.warn('Error processing element styles:', err)
      }
    })
  }
  
  // Helper to process CSS text and replace modern color formats
  const processCssText = (cssText) => {
    // Match CSS property-value pairs
    const regex = /([^:;]+):\s*([^;]+)/g
    let match
    let result = ''
    
    while ((match = regex.exec(cssText)) !== null) {
      const prop = match[1].trim()
      const value = match[2].trim()
      
      // Check if value contains modern color format
      if (value.includes('oklch') || value.includes('oklab')) {
        result += `${prop}: ${convertColorToRgb(value)}; `
      } else {
        result += `${prop}: ${value}; `
      }
    }
    
    return result
  }
  
  // Handle special case of CSS background gradients
  const processGradients = (element) => {
    const elements = [element, ...Array.from(element.querySelectorAll("*"))]
    
    elements.forEach(el => {
      try {
        const computedStyle = window.getComputedStyle(el)
        const backgroundImage = computedStyle.backgroundImage
        
        // Check if this is a gradient with modern color
        if (backgroundImage && 
           (backgroundImage.includes('gradient') && 
            (backgroundImage.includes('oklch') || backgroundImage.includes('oklab')))) {
          
          // Complex regex to handle different gradient formats
          const gradientRegex = /(linear|radial|conic)-gradient\((.*?)\)/g
          const colorStopRegex = /oklch\([^)]+\)|oklab\([^)]+\)/g
          
          let newBgImage = backgroundImage
          let gradientMatch
          
          while ((gradientMatch = gradientRegex.exec(backgroundImage)) !== null) {
            const gradientType = gradientMatch[1]
            const gradientContent = gradientMatch[2]
            let processedContent = gradientContent
            
            // Find and replace modern colors in gradient
            let colorMatch
            while ((colorMatch = colorStopRegex.exec(gradientContent)) !== null) {
              const modernColor = colorMatch[0]
              const rgbColor = convertColorToRgb(modernColor)
              processedContent = processedContent.replace(modernColor, rgbColor)
            }
            
            // Replace the entire gradient
            const originalGradient = `${gradientType}-gradient(${gradientContent})`
            const newGradient = `${gradientType}-gradient(${processedContent})`
            newBgImage = newBgImage.replace(originalGradient, newGradient)
          }
          
          // Apply the fixed gradient
          if (newBgImage !== backgroundImage) {
            const currentStyle = el.getAttribute('style') || ''
            el.setAttribute('style', `${currentStyle}; background-image: ${newBgImage} !important;`)
          }
        }
      } catch (err) {
        console.warn('Error processing gradients:', err)
      }
    })
  }
  
  // Main function to handle PDF download
  const handleDownload = () => {
    setIsGenerating(true)
    const input = patientDashboardRef.current
    
    // Create clone for processing
    const clone = input.cloneNode(true)
    
    // Set styles for the clone
    clone.style.position = "absolute"
    clone.style.top = "-9999px" 
    clone.style.width = input.offsetWidth + "px"
    clone.style.backgroundColor = "#ffffff"
    clone.style.overflow = "auto"
    
    // Add to DOM
    document.body.appendChild(clone)
    
    // Prepare for html2canvas
    const prepareForScreenshot = () => {
      try {
        // Process all modern color formats
        sanitizeColors(clone)
        
        // Handle gradients specifically
        processGradients(clone)
        
        // Set scale based on quality setting
        const scale = quality === "high" ? 2 : quality === "medium" ? 1.5 : 1
        
        // Use html2canvas
        html2canvas(clone, {
          width: clone.offsetWidth,
          height: clone.offsetHeight,
          scale: scale,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          imageTimeout: 30000, // Longer timeout
          allowTaint: true,    // Allow tainted canvas
          removeContainer: true, // Automatically remove the temporary container
          onclone: (document) => {
            // Get the cloned elements in the document
            const clonedElement = document.querySelector("body > div:last-child")
            if (clonedElement) {
              // Double check colors before final rendering
              sanitizeColors(clonedElement)
              processGradients(clonedElement)
            }
          }
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png")
            
            if (exportFormat === "pdf") {
              // Create PDF with selected options
              const pdf = new jsPDF(orientation, "mm", paperSize)
              
              // Calculate dimensions
              const pageWidth =
                orientation === "portrait" ? pdf.internal.pageSize.getWidth() : pdf.internal.pageSize.getHeight()
              const pageHeight =
                orientation === "portrait" ? pdf.internal.pageSize.getHeight() : pdf.internal.pageSize.getWidth()
              
              const imgWidth = pageWidth
              const imgHeight = (canvas.height * imgWidth) / canvas.width
              
              // Add header if selected
              let yPosition = 0
              if (includeHeader) {
                pdf.setFontSize(16)
                pdf.setTextColor(0, 191, 96) // Green color (#00bf60)
                pdf.text("Patient Dashboard Report", 10, 10)
                pdf.setFontSize(10)
                pdf.setTextColor(100, 100, 100)
                pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 18)
                pdf.line(10, 22, pageWidth - 10, 22)
                yPosition = 25
              }
              
              // Add the image to the PDF
              pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight)
              
              // Save the PDF
              pdf.save("patient-dashboard.pdf")
            } else if (exportFormat === "png") {
              // Download as PNG
              const link = document.createElement("a")
              link.download = "patient-dashboard.png"
              link.href = imgData
              link.click()
            }
            
            // Clean up 
            if (document.body.contains(clone)) {
              document.body.removeChild(clone)
            }
            setIsGenerating(false)
          })
          .catch((error) => {
            console.error("Error capturing component:", error)
            
            // Clean up
            if (document.body.contains(clone)) {
              document.body.removeChild(clone)
            }
            setIsGenerating(false)
            
            // Show user-friendly error
            alert("There was an error exporting the dashboard. Please try again with different settings.")
          })
      } catch (error) {
        console.error("Error in preparation:", error)
        if (document.body.contains(clone)) {
          document.body.removeChild(clone)
        }
        setIsGenerating(false)
      }
    }
    
    // Give time for the clone to render properly before processing
    setTimeout(prepareForScreenshot, 200)
  }

  // Function to handle sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Patient Dashboard",
        text: "Check out my patient dashboard",
        // url: window.location.href
      })
    } else {
      alert("Web Share API not supported in your browser")
    }
  }

  return (
    <div className="container mx-auto p-4 bg-[#e6f7ef]">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dashboard Export</CardTitle>
              <CardDescription>Export your patient dashboard as PDF or image</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#00bf60] hover:bg-[#00a050] text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export Dashboard
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download dashboard with current settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#00bf60] text-white">
              <TabsTrigger value="format" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white">Format</TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white">Layout</TabsTrigger>
              <TabsTrigger value="options" className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white">Options</TabsTrigger>
            </TabsList>

            <TabsContent value="format" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="png">PNG Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {exportFormat === "pdf" && (
                  <div className="space-y-2">
                    <Label htmlFor="paper-size">Paper Size</Label>
                    <Select value={paperSize} onValueChange={setPaperSize}>
                      <SelectTrigger id="paper-size">
                        <SelectValue placeholder="Select paper size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormat === "pdf" && (
                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select value={orientation} onValueChange={setOrientation}>
                      <SelectTrigger id="orientation">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-4">
              <div className="space-y-4">
                {exportFormat === "pdf" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-header">Include Header</Label>
                      <p className="text-sm text-muted-foreground">Add title and date to the PDF</p>
                    </div>
                    <Switch id="include-header" checked={includeHeader} onCheckedChange={setIncludeHeader} />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <FileText className="h-4 w-4 inline mr-1" />
            Export will include all visible dashboard sections
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShare} className="border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#00bf60] text-[#00bf60] hover:bg-[#e6f7ef]">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Advanced Settings</h4>
                  <p className="text-sm text-muted-foreground">Configure additional export options</p>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="optimize-colors">Optimize Colors</Label>
                      <Switch id="optimize-colors" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compress-output">Compress Output</Label>
                      <Switch id="compress-output" defaultChecked />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardFooter>
      </Card>

      <div ref={patientDashboardRef}>
        <QRCodeDashboard />
      </div>
    </div>
  )
}

export default DashboardExport