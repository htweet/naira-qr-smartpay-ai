
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Globe, 
  Brain, 
  Zap,
  Users,
  Settings,
  Download,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Lock,
  Wifi,
  Building,
  Headphones,
  FileText,
  DollarSign
} from "lucide-react";

const ComprehensiveFeatures = () => {
  const featureCategories = [
    {
      title: "Payment Processing",
      description: "Advanced payment solutions for every business need",
      features: [
        {
          icon: QrCode,
          title: "Dynamic QR Code Generation",
          description: "Create unlimited QR codes with custom branding, expiration dates, and payment amounts.",
          badge: "Core"
        },
        {
          icon: CreditCard,
          title: "Multi-Gateway Support",
          description: "Integrated with Moniepoint, Opay, Palmpay, and more payment processors.",
          badge: "Premium"
        },
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "Optimized for smartphones with instant scanning and payment processing.",
          badge: "Core"
        },
        {
          icon: Globe,
          title: "Cross-Platform Compatibility",
          description: "Works seamlessly across all devices and payment apps in Nigeria.",
          badge: "Core"
        }
      ]
    },
    {
      title: "Business Intelligence",
      description: "Data-driven insights to grow your business",
      features: [
        {
          icon: Brain,
          title: "AI-Powered Analytics",
          description: "Get intelligent insights on customer behavior, peak hours, and revenue trends.",
          badge: "AI"
        },
        {
          icon: BarChart3,
          title: "Real-Time Dashboard",
          description: "Monitor transactions, revenue, and performance metrics in real-time.",
          badge: "Premium"
        },
        {
          icon: TrendingUp,
          title: "Revenue Forecasting",
          description: "Predict future earnings with machine learning algorithms.",
          badge: "AI"
        },
        {
          icon: FileText,
          title: "Advanced Reporting",
          description: "Generate detailed reports for accounting, tax, and business planning.",
          badge: "Premium"
        }
      ]
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security for your peace of mind",
      features: [
        {
          icon: Shield,
          title: "Bank-Level Security",
          description: "256-bit SSL encryption and PCI DSS compliance for all transactions.",
          badge: "Core"
        },
        {
          icon: Lock,
          title: "Fraud Detection",
          description: "Advanced AI algorithms detect and prevent fraudulent transactions.",
          badge: "AI"
        },
        {
          icon: CheckCircle,
          title: "Transaction Verification",
          description: "Multi-layer verification ensures payment authenticity and reduces chargebacks.",
          badge: "Premium"
        },
        {
          icon: Wifi,
          title: "Offline Mode",
          description: "Continue accepting payments even without internet connection.",
          badge: "Premium"
        }
      ]
    },
    {
      title: "Business Tools",
      description: "Everything you need to run and grow your business",
      features: [
        {
          icon: Users,
          title: "Customer Management",
          description: "Build customer profiles, track purchase history, and create loyalty programs.",
          badge: "Premium"
        },
        {
          icon: Settings,
          title: "Custom Branding",
          description: "Add your logo, colors, and branding to QR codes and payment pages.",
          badge: "Core"
        },
        {
          icon: Download,
          title: "Easy Integration",
          description: "Simple APIs and plugins for websites, apps, and POS systems.",
          badge: "Developer"
        },
        {
          icon: RefreshCw,
          title: "Auto-Reconciliation",
          description: "Automatic matching of payments with orders and invoices.",
          badge: "Premium"
        }
      ]
    },
    {
      title: "Enterprise Solutions",
      description: "Scalable solutions for large businesses",
      features: [
        {
          icon: Building,
          title: "Multi-Location Support",
          description: "Manage payments across multiple branches and locations from one dashboard.",
          badge: "Enterprise"
        },
        {
          icon: DollarSign,
          title: "Volume Discounts",
          description: "Lower transaction fees for high-volume merchants and enterprises.",
          badge: "Enterprise"
        },
        {
          icon: Headphones,
          title: "Dedicated Support",
          description: "24/7 priority support with dedicated account managers.",
          badge: "Enterprise"
        },
        {
          icon: Zap,
          title: "Custom Solutions",
          description: "Tailored payment solutions for specific industry requirements.",
          badge: "Enterprise"
        }
      ]
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Core": return "bg-blue-100 text-blue-700";
      case "Premium": return "bg-purple-100 text-purple-700";
      case "AI": return "bg-green-100 text-green-700";
      case "Developer": return "bg-orange-100 text-orange-700";
      case "Enterprise": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Payment Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From small businesses to large enterprises, PayQR provides all the tools you need to accept payments, manage customers, and grow your business.
          </p>
        </div>

        <div className="space-y-16">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <Badge className={`text-xs ${getBadgeColor(feature.badge)}`}>
                          {feature.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of Nigerian businesses already using PayQR to accept payments and grow their revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveFeatures;
