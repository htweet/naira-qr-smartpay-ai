
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CreditCard, BarChart3, Shield } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: QrCode,
      title: "QR Code Generation",
      description: "Create customized QR codes for your business with branding options."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Gateways",
      description: "Support for Moniepoint, Paystack, Flutterwave, and more."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track payments, analyze trends, and optimize your business."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for all your payment transactions."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PayQR?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to accept payments and grow your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
