
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Building2, CreditCard, CheckCircle } from "lucide-react";

const PaymentGatewaySection = () => {
  const gateways = [
    {
      id: "moniepoint",
      name: "Moniepoint",
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-blue-500",
      description: "Nigeria's leading financial services platform for businesses",
      features: ["Instant Notifications", "24/7 Support", "Reliable APIs"],
      image: "moniepoint.png" // Image filename in public folder
    },
    {
      id: "opay",
      name: "OPay",
      icon: <Smartphone className="h-6 w-6" />,
      color: "bg-green-500",
      description: "Fast and secure mobile payments for Nigerian merchants",
      features: ["Low Transaction Fees", "Mobile-First", "Wide User Base"],
      image: "opay.png" // Image filename in public folder
    },
    {
      id: "palmpay",
      name: "PalmPay",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-purple-500",
      description: "Seamless digital payment solutions for every business",
      features: ["Zero Setup Fee", "Easy Integration", "Cashback Rewards"],
      image: "palmpay.png" // Image filename in public folder
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Integrated Payment Gateways</h2>
          <p className="text-gray-600 mb-8">
            Connect with Nigeria's leading payment providers for seamless transactions.
            Process payments instantly with our integrated QR solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gateways.map((gateway) => (
            <Card key={gateway.id} className="overflow-hidden border-0 shadow-lg">
              <div className={`${gateway.color} h-2`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{gateway.name}</CardTitle>
                  <div className={`${gateway.color} text-white p-2 rounded-full`}>
                    {gateway.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center py-4">
                  <img 
                    src={`/${gateway.image}`} 
                    alt={gateway.name} 
                    className="h-20 object-contain"
                  />
                </div>
                
                <p className="text-gray-600 text-sm">
                  {gateway.description}
                </p>
                
                <ul className="space-y-2">
                  {gateway.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">More payment gateways coming soon</p>
          <Button size="lg">Get Started with NairaQR</Button>
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaySection;
