
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, QrCode, CreditCard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: Users,
      title: "Create Your Account",
      description: "Sign up in minutes and verify your business credentials"
    },
    {
      number: "2", 
      icon: QrCode,
      title: "Generate QR Codes",
      description: "Create custom QR codes with your branding and payment details"
    },
    {
      number: "3",
      icon: CreditCard,
      title: "Accept Payments", 
      description: "Customers scan your QR code to make instant payments"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How PayQR Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started with our seamless integration in just a few steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number */}
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <step.icon className="h-8 w-8 text-blue-500" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/signup")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
          >
            Start Accepting Payments <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
