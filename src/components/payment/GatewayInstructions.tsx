
export const getGatewayInstructions = (gatewayId: string) => {
  const instructions = {
    stripe: {
      title: "Stripe Setup Instructions",
      steps: [
        "Sign up at stripe.com if you haven't already",
        "Go to Developers > API Keys in your Stripe dashboard",
        "Copy your Publishable Key and Secret Key",
        "For testing, use test keys; for live payments, use live keys"
      ],
      docs: "https://stripe.com/docs/keys"
    },
    paystack: {
      title: "Paystack Setup Instructions", 
      steps: [
        "Create account at paystack.com",
        "Go to Settings > API Keys & Webhooks",
        "Copy your Public Key and Secret Key",
        "Set up webhook URL for payment notifications"
      ],
      docs: "https://paystack.com/docs/api/"
    },
    flutterwave: {
      title: "Flutterwave Setup Instructions",
      steps: [
        "Register at flutterwave.com",
        "Navigate to Settings > API Keys",
        "Copy your Public Key and Secret Key",
        "Configure webhook endpoints for payment updates"
      ],
      docs: "https://developer.flutterwave.com/docs"
    },
    palmpay: {
      title: "PalmPay Setup Instructions",
      steps: [
        "Contact PalmPay for merchant account setup",
        "Obtain API credentials from PalmPay team",
        "Configure merchant ID and API keys",
        "Test in sandbox environment before going live"
      ],
      docs: "https://palmpay.com/business"
    }
  };

  return instructions[gatewayId as keyof typeof instructions];
};
