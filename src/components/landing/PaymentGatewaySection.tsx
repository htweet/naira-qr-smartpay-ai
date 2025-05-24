
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus } from "lucide-react";

const PaymentGatewaySection = () => {
  const gateways = [
    {
      name: "Moniepoint",
      subtitle: "(Monnify)",
      description: "Virtual accounts, bank transfers, card payments",
      logo: "🟦",
      status: "active",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments"]
    },
    {
      name: "Opay",
      subtitle: "",
      description: "3DS card payments, e-wallet, mobile SDKs",
      logo: "🟢",
      status: "active",
      features: ["3DS Card Payment", "E-Wallet", "Mobile SDKs"]
    },
    {
      name: "Palmpay",
      subtitle: "",
      description: "Zero-fee transfers, business tools, POS integration",
      logo: "🔵",
      status: "active",
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration"]
    },
    {
      name: "More Gateways",
      subtitle: "Coming Soon",
      description: "Additional payment providers being integrated",
      logo: "➕",
      status: "coming-soon",
      features: ["Flutterwave", "Paystack", "Interswitch"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Integrated Payment Gateways
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with leading Nigerian payment providers to offer your customers flexible payment options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gateways.map((gateway, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{gateway.logo}</div>
                  {gateway.status === "active" ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      Coming Soon
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {gateway.name}
                  {gateway.subtitle && (
                    <span className="text-sm text-gray-600 ml-1">{gateway.subtitle}</span>
                  )}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {gateway.description}
                </p>

                <div className="space-y-2">
                  {gateway.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {gateway.status === "coming-soon" && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Supporting B2B and B2C transactions for offline merchants across Nigeria
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaySection;
