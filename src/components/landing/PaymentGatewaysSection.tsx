
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Shield, Clock } from "lucide-react";

const PaymentGatewaysSection = () => {
  const gateways = [
    {
      name: "Moniepoint (Monnify)",
      description: "Leading payment gateway with virtual accounts and seamless bank transfers",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
      status: "Active",
      logo: "🏦"
    },
    {
      name: "Opay",
      description: "Fast and reliable payments with comprehensive mobile solutions",
      features: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
      status: "Active",
      logo: "📱"
    },
    {
      name: "Palmpay",
      description: "Zero-fee transfers and comprehensive business tools",
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"],
      status: "Active",
      logo: "🌴"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Smart Routing",
      description: "Automatically routes payments to the best performing gateway"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Enhanced Security",
      description: "Bank-grade security with fraud detection and prevention"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Fast Processing",
      description: "Lightning-fast payment processing with real-time updates"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Integrated Payment Gateways
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            PayQR integrates with Nigeria's leading payment gateways to ensure your customers can pay 
            using their preferred method while you enjoy the best success rates and lowest fees.
          </p>
        </div>

        {/* Payment Gateways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {gateways.map((gateway, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{gateway.logo}</div>
                  <div>
                    <h3 className="font-bold text-lg">{gateway.name}</h3>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {gateway.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{gateway.description}</p>
                
                <div className="space-y-2">
                  {gateway.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Multiple Gateways Matter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center mt-12 p-8 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">More Gateways Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            We're constantly expanding our payment gateway integrations to give you more options and better rates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline">Paystack</Badge>
            <Badge variant="outline">Flutterwave</Badge>
            <Badge variant="outline">Interswitch</Badge>
            <Badge variant="outline">Remita</Badge>
            <Badge variant="outline">And more...</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaysSection;
