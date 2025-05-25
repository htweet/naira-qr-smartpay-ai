
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, ArrowRight } from "lucide-react";

const PaymentGatewaySection = () => {
  const gateways = [
    {
      name: "Moniepoint",
      logo: "M",
      description: "Leading payment gateway for virtual accounts and bank transfers",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
      status: "Integrated",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      name: "Opay",
      logo: "O",
      description: "Fast and secure mobile payments with e-wallet integration",
      features: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
      status: "Integrated",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      name: "Palmpay",
      logo: "P",
      description: "Zero-fee transfers and comprehensive business tools",
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"],
      status: "Integrated",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      name: "More Coming",
      logo: <Plus className="h-6 w-6" />,
      description: "Additional payment gateways and methods will be added soon",
      features: ["Flutterwave", "Paystack", "Bank APIs", "USSD Integration"],
      status: "Coming Soon",
      color: "from-gray-400 to-gray-500",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Integrated Payment Gateways
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with Nigeria's most trusted payment providers for seamless transaction processing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {gateways.map((gateway, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${gateway.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {typeof gateway.logo === 'string' ? (
                    <span className={`text-2xl font-bold ${gateway.textColor}`}>
                      {gateway.logo}
                    </span>
                  ) : (
                    <div className={gateway.textColor}>
                      {gateway.logo}
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl mb-2">{gateway.name}</CardTitle>
                <Badge 
                  variant={gateway.status === "Integrated" ? "default" : "secondary"}
                  className={gateway.status === "Integrated" ? "bg-green-100 text-green-700" : ""}
                >
                  {gateway.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center">
                  {gateway.description}
                </CardDescription>
                <div className="space-y-2">
                  {gateway.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Routing</h3>
              <p className="text-gray-600">Automatically route payments to the best performing gateway</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Higher Success Rates</h3>
              <p className="text-gray-600">Increase payment success with fallback gateway options</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Unified Management</h3>
              <p className="text-gray-600">Manage all payment gateways from one dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaySection;
