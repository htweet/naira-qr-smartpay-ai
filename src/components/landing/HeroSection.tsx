
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="container mx-auto text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <QrCode className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Simplify Payments with <span className="text-blue-600">PayQR</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate QR codes, accept payments, and manage your business with our comprehensive payment solution.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => navigate("/signup")}
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
