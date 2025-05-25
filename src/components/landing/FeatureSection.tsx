
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  QrCode, 
  BarChart3, 
  Shield, 
  Smartphone, 
  CreditCard, 
  Users,
  TrendingUp,
  Zap,
  Globe
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "Smart QR Generation",
      description: "Create customized QR codes with your business branding and payment details in seconds.",
      color: "blue"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-time Analytics",
      description: "Track payments, monitor trends, and gain insights into your business performance.",
      color: "green"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-level Security",
      description: "End-to-end encryption and PCI DSS compliance ensure your transactions are secure.",
      color: "purple"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Optimized",
      description: "Seamless experience across all devices with responsive design and mobile apps.",
      color: "orange"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Multiple Gateways",
      description: "Integrated with Moniepoint, Opay, Palmpay and other leading Nigerian payment providers.",
      color: "indigo"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer Management",
      description: "Build customer relationships with detailed transaction history and loyalty programs.",
      color: "pink"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Business Intelligence",
      description: "AI-powered insights to help grow your business and optimize revenue streams.",
      color: "cyan"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Settlements",
      description: "Get paid instantly with real-time settlement to your preferred bank account.",
      color: "yellow"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-channel Support",
      description: "Accept payments online, in-store, and on-the-go with unified reporting.",
      color: "emerald"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      indigo: "text-indigo-600 bg-indigo-100",
      pink: "text-pink-600 bg-pink-100",
      cyan: "text-cyan-600 bg-cyan-100",
      yellow: "text-yellow-600 bg-yellow-100",
      emerald: "text-emerald-600 bg-emerald-100"
    };
    return colors[color as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From QR generation to advanced analytics, PayQR provides all the tools 
            Nigerian businesses need to thrive in the digital economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg ${getColorClasses(feature.color)} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
