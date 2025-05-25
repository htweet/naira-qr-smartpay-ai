
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How quickly can I start accepting QR payments?",
      answer: "You can start accepting QR payments immediately after signing up. Our onboarding process takes less than 5 minutes, and you'll have your first QR code ready to use right away. No lengthy approval processes or complex integrations required."
    },
    {
      question: "Which payment methods are supported?",
      answer: "PayQR supports all major Nigerian payment methods including bank transfers, card payments, mobile wallets, and USSD codes. We're integrated with Moniepoint (Monnify), Opay, Palmpay, and other leading payment gateways to ensure maximum compatibility."
    },
    {
      question: "What are the transaction fees?",
      answer: "Our pricing is transparent with no hidden fees. Transaction fees vary by payment method and volume, typically ranging from 1.5% to 2.5%. Higher volume merchants receive reduced rates. All fees are clearly displayed in your dashboard before processing."
    },
    {
      question: "Is my business data secure?",
      answer: "Absolutely. We use bank-level security with end-to-end encryption for all transactions. PayQR is PCI DSS compliant and follows international security standards. Your business and customer data is protected with enterprise-grade security measures."
    },
    {
      question: "Can I customize the QR codes with my brand?",
      answer: "Yes! You can add your business logo, choose colors, and customize the design of your QR codes to match your brand. Our Professional plan includes advanced customization options and white-label capabilities."
    },
    {
      question: "How do I track my payments and sales?",
      answer: "PayQR provides a comprehensive dashboard with real-time analytics, transaction history, sales reports, and customer insights. You can export data, set up automated reports, and monitor your business performance from anywhere."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide multi-channel support including email, phone, and live chat. Our Professional plan includes priority support, while Enterprise customers get dedicated account management and 24/7 assistance."
    },
    {
      question: "Can I integrate PayQR with my existing systems?",
      answer: "Absolutely. PayQR offers robust APIs and webhooks for seamless integration with your existing POS systems, e-commerce platforms, accounting software, and other business tools. Our technical team can assist with custom integrations."
    },
    {
      question: "What happens if there's a failed transaction?",
      answer: "Failed transactions are automatically retried and you're notified immediately. Our system provides detailed logs and error codes to help resolve issues quickly. Customer funds are never lost, and failed payments can be easily reprocessed."
    },
    {
      question: "Is there a limit on transaction amounts?",
      answer: "Transaction limits depend on your chosen payment gateway and business verification level. Most gateways support transactions from ₦100 to ₦5,000,000 per transaction. Enterprise customers can request higher limits based on business needs."
    }
  ];

  return (
    <section className="py-20 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about PayQR. Can't find the answer you're looking for? 
            Feel free to contact our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@payqr.ng" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Email Support
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a 
              href="tel:+2348001234567" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Call +234 800 123 4567
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
