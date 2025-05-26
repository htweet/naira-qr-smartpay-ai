
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              LIVE DEMO
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Accept Payments{" "}
              <span className="text-blue-600">Anywhere</span> with QR Technology
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Nigeria's most advanced QR payment platform with AI analytics, multi-gateway support, and powerful business tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
              <p className="text-gray-600 font-medium">85,000+ Nigerian merchants trust PayQR</p>
            </div>
          </div>

          {/* Right Content - Demo */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">QR Payment Demo</h3>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Live
                </div>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="bg-white rounded-lg p-8 mb-6 border-2 border-dashed border-gray-200">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              </div>

              {/* Payment Success */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-semibold">Payment Received</p>
                    <p className="text-green-600 text-sm">Transaction ID: #57829</p>
                  </div>
                  <div className="text-green-700 font-bold text-xl">₦12,500.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">₦15.7B+</div>
              <div className="text-blue-100">Transactions Processed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">85,000+</div>
              <div className="text-blue-100">Active Merchants</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">99.8%</div>
              <div className="text-blue-100">Platform Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2.1M</div>
              <div className="text-blue-100">Monthly Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
