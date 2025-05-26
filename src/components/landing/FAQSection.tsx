
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does PayQR work?",
      answer: "PayQR allows you to generate QR codes that customers can scan to make payments. Simply create a QR code with your payment details, and customers can scan it with their phone to complete transactions through their preferred payment method."
    },
    {
      question: "Which payment gateways are supported?",
      answer: "We support major Nigerian payment gateways including Moniepoint, Paystack, Flutterwave, and others. You can configure multiple gateways and let customers choose their preferred payment method."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees. You can start with our free plan and upgrade as your business grows. We only charge based on your chosen subscription plan."
    },
    {
      question: "How secure are the payments?",
      answer: "All payments are processed through secure, PCI-compliant payment gateways. We don't store any sensitive payment information and use industry-standard encryption for all transactions."
    },
    {
      question: "Can I customize my QR codes?",
      answer: "Yes! You can customize your QR codes with your business logo, colors, and branding. This helps maintain your brand identity and builds customer trust."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "Our analytics dashboard shows payment trends, customer behavior, transaction volumes, success rates, and revenue insights. Pro and Enterprise plans include advanced analytics and AI-powered insights."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about PayQR.
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
