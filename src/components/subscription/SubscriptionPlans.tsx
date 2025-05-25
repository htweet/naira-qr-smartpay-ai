
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { createCheckoutSession, subscriptionPlans } from "@/utils/subscription";

const SubscriptionPlans = () => {
  const handleUpgrade = async (planId: string) => {
    // For now, we'll use mock price IDs. In production, these would be actual Stripe price IDs
    const priceIds: { [key: string]: string } = {
      basic: 'price_basic_mock',
      premium: 'price_premium_mock', 
      enterprise: 'price_enterprise_mock'
    };
    
    await createCheckoutSession(priceIds[planId]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 mt-2">Select the perfect plan for your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">₦{plan.price.toLocaleString()}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.id)}
              >
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
