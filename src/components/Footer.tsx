
import { Facebook, Twitter, Instagram, Linkedin, Mail, PhoneCall, MapPin, CreditCard, Shield, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/utils/tracker";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Newsletter subscription",
      description: "Thanks for subscribing to our newsletter!",
    });
    trackEvent({
      eventType: "newsletter_subscribe",
      eventData: { email }
    });
    setEmail("");
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  ];

  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Testimonials", href: "#" },
    { label: "Blog", href: "#" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-xl">PQ</div>
              </div>
              <h3 className="text-xl font-bold">PayQR</h3>
            </div>
            <p className="text-gray-600">
              Empowering Nigerian merchants with advanced QR payment solutions, analytics, and business intelligence.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.href}
                  aria-label={link.label}
                  className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                  onClick={() => trackEvent({ eventType: "social_click", eventData: { platform: link.label } })}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => trackEvent({ eventType: "footer_link_click", eventData: { section: "quick_links", link: link.label } })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => trackEvent({ eventType: "footer_link_click", eventData: { section: "support", link: link.label } })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with our latest features and releases</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-6 border-t border-gray-200 flex flex-wrap justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">support@payqr.ng</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">+234 800 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Lagos, Nigeria</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CreditCard className="h-5 w-5 text-gray-400" title="Secure Payments" />
            <Shield className="h-5 w-5 text-gray-400" title="Data Protection" />
            <Clock className="h-5 w-5 text-gray-400" title="24/7 Support" />
            <HelpCircle className="h-5 w-5 text-gray-400" title="Help Center" />
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} PayQR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
