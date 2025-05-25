
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";

const PaymentGatewaySection = () => {
  const gateways = [
    {
      id: "moniepoint",
      name: "Moniepoint (Monnify)",
      description: "Nigeria's leading payment gateway with robust infrastructure",
      color: "blue", // Blue theme as requested
      bgColor: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
      successRate: "98.5%",
      processingTime: "2.3s",
      status: "Integrated"
    },
    {
      id: "opay",
      name: "Opay",
      description: "Fast and secure digital payment solutions for businesses",
      color: "green", // Green theme as requested
      bgColor: "from-green-500 to-green-600", 
      lightBg: "bg-green-50",
      features: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
      successRate: "97.8%",
      processingTime: "3.1s",
      status: "Integrated"
    },
    {
      id: "palmpay",
      name: "Palmpay",
      description: "Comprehensive fintech platform for modern businesses",
      color: "purple", // Purple theme as requested
      bgColor: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50", 
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"],
      successRate: "96.2%",
      processingTime: "4.2s",
      status: "Integrated"
    }
  ];

  return (
    <section className="py-20 bg-white" id="payment-gateways">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Integrated Payment Gateways
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've partnered with Nigeria's top payment gateways to ensure your transactions 
            are fast, secure, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${gateway.lightBg} border-2`}>
              <CardHeader className={`bg-gradient-to-r ${gateway.bgColor} text-white`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{gateway.name}</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {gateway.status}
                  </Badge>
                </div>
                <CardDescription className="text-blue-100">
                  {gateway.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="font-semibold text-green-600">{gateway.successRate}</span>
                    </div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-orange-500 mr-1" />
                      <span className="font-semibold text-orange-600">{gateway.processingTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Avg. Speed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {gateway.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Production Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All gateways are pre-integrated and ready to use. No additional setup required.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Bank-level Security
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              PCI DSS Compliant
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaySection;
