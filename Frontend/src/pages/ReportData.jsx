import React, { useState } from 'react';
import { AlertCircle, Activity, Heart, ThumbsUp, ArrowRight } from 'lucide-react';
// Import html2canvas for capturing the content as an image
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLocation } from 'react-router-dom';

const ReportData = () => {
  const location = useLocation();
  const reportData = location.state?.reportData || { reports: [] };

  const [activeTab, setActiveTab] = useState('analysis');
  const report = reportData.reports[0];
  // Create refs for each section that needs to be captured
  const reportRef = React.useRef(null);
  
  // Method to generate PDF without using autoTable
  const generatePDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Health Report: ${report.patient_name}`, 14, 20);
      
      // Add report date
      doc.setFontSize(11);
      doc.text(`Report Date: ${report.analysis_date}`, 14, 28);
      
      // Add overall health status
      doc.setFontSize(12);
      doc.text(`Overall Health Status: ${report.overall_health_status}`, 14, 36);
      
      // Manually create tables and content since autoTable isn't working
      let yPosition = 44;
      
      // Health Analysis Section
      doc.setFontSize(14);
      doc.text("Health Analysis", 14, yPosition);
      yPosition += 8;
      
      // Table header
      doc.setFillColor(0, 191, 96); // Green #00bf60
      doc.rect(14, yPosition, pageWidth - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Parameter", 16, yPosition + 5);
      doc.text("Status", 60, yPosition + 5);
      doc.text("Risk Level", 100, yPosition + 5);
      doc.text("Interpretation", 140, yPosition + 5);
      yPosition += 8;
      
      // Table rows
      doc.setTextColor(0, 0, 0);
      report.analysis.forEach((item) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        const rowHeight = 16;
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, pageWidth - 28, rowHeight, 'F');
        
        doc.setFontSize(9);
        doc.text(item.parameter, 16, yPosition + 5);
        doc.text(item.status, 60, yPosition + 5);
        doc.text(item.risk_level, 100, yPosition + 5);
        
        // Handle long text for interpretation by wrapping it
        const maxWidth = pageWidth - 142 - 16;
        const interpretationLines = doc.splitTextToSize(item.interpretation, maxWidth);
        doc.text(interpretationLines, 140, yPosition + 5);
        
        // Adjust row height if interpretation takes multiple lines
        const additionalHeight = Math.max(0, interpretationLines.length - 1) * 5;
        yPosition += rowHeight + additionalHeight + 2;
      });
      
      // Nutrition Section
      yPosition += 10;
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Nutrition Recommendations", 14, yPosition);
      yPosition += 8;
      
      report.nutrition_recommendations.forEach((item) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, pageWidth - 28, 10, 'F');
        doc.setFontSize(11);
        doc.text(item.food_type, 16, yPosition + 6);
        yPosition += 12;
        
        doc.setFontSize(9);
        doc.text(`Reason: ${item.reason}`, 16, yPosition);
        yPosition += 6;
        
        doc.text(`Examples: ${item.examples.join(', ')}`, 16, yPosition);
        yPosition += 6;
        
        doc.text(`Frequency: ${item.frequency}, Portion Size: ${item.portion_size}`, 16, yPosition);
        yPosition += 10;
      });
      
      // Activity Recommendations
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Activity Recommendations", 14, yPosition);
      yPosition += 8;
      
      report.activity_recommendations.forEach((item) => {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, pageWidth - 28, 10, 'F');
        doc.setFontSize(11);
        doc.text(item.activity_type, 16, yPosition + 6);
        yPosition += 12;
        
        doc.setFontSize(9);
        doc.text(`Reason: ${item.reason}`, 16, yPosition);
        yPosition += 6;
        
        doc.text(`Examples: ${item.examples.join(', ')}`, 16, yPosition);
        yPosition += 6;
        
        doc.text(`Schedule: ${item.frequency}, ${item.intensity}, ${item.duration}`, 16, yPosition);
        yPosition += 8;
        
        doc.text(`Precautions:`, 16, yPosition);
        yPosition += 5;
        
        item.precautions.forEach((precaution, index) => {
          doc.text(`• ${precaution}`, 20, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
      });
      
      // Follow-up Recommendations
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Follow-up Recommendations", 14, yPosition);
      yPosition += 8;
      
      report.follow_up_recommendations.forEach((recommendation, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        const recommendationLines = doc.splitTextToSize(`• ${recommendation}`, pageWidth - 40);
        doc.setFontSize(9);
        doc.text(recommendationLines, 16, yPosition);
        
        yPosition += recommendationLines.length * 6 + 2;
      });
      
      // Save the PDF
      doc.save(`${report.patient_name}_Health_Report_${report.analysis_date}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  // Alternative method using HTML2Canvas (as a backup)
  const generatePDFFromHTML = async () => {
    try {
      if (!reportRef.current) {
        alert("Could not generate PDF. Please try again.");
        return;
      }
      
      // Set active tab to 'analysis' to ensure consistent capture
      setActiveTab('analysis');
      
      // Wait for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit on A4
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // If height exceeds page, create multiple pages
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        let remainingHeight = pdfHeight;
        let position = 0;
        let page = 1;
        
        while (remainingHeight > 0) {
          position -= pdf.internal.pageSize.getHeight();
          remainingHeight -= pdf.internal.pageSize.getHeight();
          
          if (remainingHeight > 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            page++;
          }
        }
      }
      
      pdf.save(`${report.patient_name}_Health_Report_${report.analysis_date}.pdf`);
    } catch (error) {
      console.error("Error generating PDF with html2canvas:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-[#e6f7ef] text-[#00bf60]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Elevated':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Borderline':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'Normal':
        return <ThumbsUp className="w-5 h-5 text-[#00bf60]" />;
      default:
        return <Heart className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Add action buttons at the top */}
        <div className="flex justify-end mb-4 gap-4">
          <button 
            className="flex items-center gap-2 bg-[#00bf60] hover:bg-[#00a050] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={generatePDF}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path d="M13 3L4 14h7v7l9-11h-7V3z" fill="white" stroke="white" strokeWidth="0.5" />
            </svg>
            Download Pdf
          </button>
          {/* Optional backup button if the first method fails */}
          <button 
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={generatePDFFromHTML}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="black" stroke="black" strokeWidth="0.5" />
            </svg>
            Alternative Download
          </button>
        </div>
        <div ref={reportRef} className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex mb-2 rounded-lg justify-between items-center bg-white py-4 px-6 border-b border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#e6f7ef] flex items-center justify-center text-[#00bf60] mr-3">
                <span className="text-lg font-semibold">{report.patient_name[0]}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hello, {report.patient_name}</h1>
                <p className="text-sm text-gray-500">Report Date: {report.analysis_date}</p>
              </div>
            </div>
            <div className="bg-[#e6f7ef] text-[#00bf60] rounded-lg px-4 py-2 font-medium">
              {report.overall_health_status}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'analysis' 
                    ? 'border-[#00bf60] text-[#00bf60]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('analysis')}
              >
                Health Analysis
              </button>
              <button 
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'nutrition' 
                    ? 'border-[#00bf60] text-[#00bf60]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('nutrition')}
              >
                Nutrition Plan
              </button>
              <button 
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'activity' 
                    ? 'border-[#00bf60] text-[#00bf60]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                Activity Plan
              </button>
              <button 
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'followup' 
                    ? 'border-[#00bf60] text-[#00bf60]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('followup')}
              >
                Follow-up Plan
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Health Analysis Tab */}
            {activeTab === 'analysis' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.analysis.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center mb-3">
                        {getStatusIcon(item.status)}
                        <h3 className="ml-2 text-lg font-medium text-gray-800">{item.parameter}</h3>
                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(item.risk_level)}`}>
                          {item.risk_level} Risk
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.interpretation}</p>
                      <div className="mt-3 text-sm font-medium text-gray-500">Status: {item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Recommendations</h2>
                <div className="space-y-6">
                  {report.nutrition_recommendations.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{item.food_type}</h3>
                      <p className="text-gray-600 mb-3">{item.reason}</p>
                      
                      <div className="bg-white rounded-md p-4 mb-3">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Recommended Foods:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.examples.map((example, i) => (
                            <span key={i} className="bg-[#e6f7ef] text-[#00bf60] text-xs px-3 py-1 rounded-full">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Frequency:</span> {item.frequency}
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Portion Size:</span> {item.portion_size}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Recommendations</h2>
                <div className="space-y-6">
                  {report.activity_recommendations.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{item.activity_type}</h3>
                      <p className="text-gray-600 mb-4">{item.reason}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Frequency</h4>
                          <p className="text-gray-800">{item.frequency}</p>
                        </div>
                        <div className="bg-white rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Intensity</h4>
                          <p className="text-gray-800">{item.intensity}</p>
                        </div>
                        <div className="bg-white rounded-md p-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
                          <p className="text-gray-800">{item.duration}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-md p-4 mb-3">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Activities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.examples.map((example, i) => (
                            <span key={i} className="bg-[#e6f7ef] text-[#00bf60] text-xs px-3 py-1 rounded-full">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Precautions:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          {item.precautions.map((precaution, i) => (
                            <li key={i}>{precaution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Tab */}
            {activeTab === 'followup' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Follow-up Recommendations</h2>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <ul className="space-y-4">
                    {report.follow_up_recommendations.map((item, index) => (
                      <li key={index} className="flex">
                        <ArrowRight className="w-5 h-5 text-[#00bf60] mt-0.5 flex-shrink-0" />
                        <span className="ml-3 text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportData;