
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, QrCode, Smartphone, Users, TrendingUp, Shield, Zap, CheckCircle, Star, MessageCircle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import PaymentGatewaysSection from "@/components/landing/PaymentGatewaysSection";
import PricingSection from "@/components/subscription/PricingSection";

const Index = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Generate QR Code",
      description: "Create custom QR codes for your products or services",
      icon: <QrCode className="h-8 w-8" />,
    },
    {
      title: "Customer Scans",
      description: "Customers scan the QR code with their mobile device",
      icon: <Smartphone className="h-8 w-8" />,
    },
    {
      title: "Secure Payment",
      description: "Payment is processed securely through integrated gateways",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      title: "Instant Confirmation",
      description: "Both parties receive instant payment confirmation",
      icon: <CheckCircle className="h-8 w-8" />,
    },
  ];

  const features = [
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Easy QR Generation",
      description: "Create unlimited QR codes for products, services, or general payments"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Optimized",
      description: "Perfect for both merchants and customers on mobile devices"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-Grade Security",
      description: "All transactions are secured with industry-standard encryption"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-time Analytics",
      description: "Track payments, customer behavior, and business insights"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "B2B & B2C Ready",
      description: "Designed for both business-to-business and customer transactions"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Settlement",
      description: "Fast payment processing with immediate settlement"
    }
  ];

  const faqs = [
    {
      question: "How does PayQR work?",
      answer: "PayQR allows merchants to generate QR codes for payments. Customers scan these codes with their phones and complete payments through integrated Nigerian payment gateways like Moniepoint, Opay, and Palmpay."
    },
    {
      question: "Is PayQR secure?",
      answer: "Yes, PayQR uses bank-grade security with encrypted transactions. All payments are processed through licensed Nigerian payment gateways with fraud detection and prevention measures."
    },
    {
      question: "What payment methods are supported?",
      answer: "PayQR supports bank transfers, card payments, mobile wallets, and other payment methods through our integrated gateways including Moniepoint, Opay, and Palmpay."
    },
    {
      question: "Can I use PayQR for my business?",
      answer: "Absolutely! PayQR is designed for businesses of all sizes, from small retailers to large enterprises. It's perfect for both B2B and B2C transactions in Nigeria."
    },
    {
      question: "How much does PayQR cost?",
      answer: "PayQR offers flexible pricing plans starting from ₦5,000/month for small businesses. Enterprise plans are available with custom pricing for larger organizations."
    },
    {
      question: "Do customers need to download an app?",
      answer: "No, customers don't need a special app. They can scan QR codes using their phone's camera or any QR scanner app and complete payments through their preferred payment method."
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      business: "Ogundimu Electronics",
      message: "PayQR has transformed how we accept payments. Our customers love the convenience, and we get paid instantly.",
      rating: 5
    },
    {
      name: "Fatima Hassan",
      business: "Hassan Fashion House",
      message: "Since implementing PayQR, our transaction volume has increased by 40%. It's so easy for customers to pay.",
      rating: 5
    },
    {
      name: "Chidi Okwu",
      business: "Okwu Supermarket",
      message: "The analytics dashboard helps us understand our business better. PayQR is a game-changer for Nigerian businesses.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">PayQR</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              Nigeria's Premier QR Payment Solution
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Accept Payments with <span className="text-blue-600">QR Codes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Simplify payments for your business and customers with secure QR codes. 
              Integrated with Nigeria's leading payment gateways for seamless transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How PayQR Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How PayQR Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and fast payment processing in just a few steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className={`text-center transition-all cursor-pointer ${
                  activeStep === index 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-lg'
                }`}
              >
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    activeStep === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Gateways Section */}
      <PaymentGatewaysSection />

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PayQR?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for Nigerian businesses with features that matter
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of Nigerian businesses already using PayQR
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.message}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about PayQR
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <CardDescription className="text-base">{faq.answer}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you get started with PayQR
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-blue-100 mb-4">Chat with our support team</p>
              <Button variant="secondary">Start Chat</Button>
            </div>
            
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-blue-100 mb-4">support@payqr.ng</p>
              <Button variant="secondary">Send Email</Button>
            </div>
            
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-blue-100 mb-4">+234 800 PAYQR (72977)</p>
              <Button variant="secondary">Call Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of Nigerian businesses already using PayQR to accept payments
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">PayQR</span>
              </div>
              <p className="text-gray-400">
                Nigeria's premier QR payment solution for businesses of all sizes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>QR Code Generator</li>
                <li>Payment Processing</li>
                <li>Analytics Dashboard</li>
                <li>Mobile App</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>API Documentation</li>
                <li>System Status</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PayQR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
