
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "₦49.99",
      period: "/month",
      description: "Essential tools for small businesses",
      features: [
        "Static QR code generation",
        "Basic transaction history",
        "Email support",
        "Standard security features",
        "Up to 3 payment methods"
      ],
      popular: false,
      buttonVariant: "outline" as const
    },
    {
      name: "Premium",
      price: "₦99.99",
      period: "/month",
      description: "Advanced tools and analytics",
      features: [
        "Dynamic QR codes",
        "Basic AI analytics",
        "Customer behavior insights",
        "Integration with 1 accounting software",
        "Priority email support",
        "Advanced security",
        "Up to 5 payment methods"
      ],
      popular: true,
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "₦299.99",
      period: "/month",
      description: "Complete solution for large merchants",
      features: [
        "All Premium features",
        "Full AI-powered analytics",
        "User segmentation",
        "Advanced funnel analysis",
        "Multi-gateway routing optimization",
        "Integration with all supported accounting software",
        "Dedicated account manager",
        "Custom branding options",
        "Enterprise-grade security",
        "Unlimited payment methods"
      ],
      popular: false,
      buttonVariant: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative bg-white ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}>
              {plan.popular && (
                <div className="absolute -top-0 left-0 right-0 bg-blue-500 text-white text-center text-sm py-2 font-medium rounded-t-lg">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className="text-center pb-4" style={{ paddingTop: plan.popular ? '3rem' : '1.5rem' }}>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{plan.description}</CardDescription>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price}<span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}`}
                  variant={plan.buttonVariant}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction Fees Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Transaction Fees</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                All plans include a competitive 1.5% transaction fee on successful payments (capped at ₦2,000 per transaction).
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700 font-medium">No hidden charges. No setup fees. No monthly minimums.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
