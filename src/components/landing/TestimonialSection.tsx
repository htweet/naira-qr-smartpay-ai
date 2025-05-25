
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Adebayo Olatunji",
      title: "Owner, Olatunji Electronics",
      location: "Lagos",
      content: "PayQR transformed how we handle payments. Our customers love the convenience, and we've seen a 40% increase in sales since implementing QR payments.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Fatima Abdullahi", 
      title: "Restaurant Manager",
      location: "Abuja",
      content: "The analytics dashboard gives us incredible insights into our business. We can track peak hours, popular items, and customer behavior patterns.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Chinedu Okwu",
      title: "Fashion Boutique Owner",
      location: "Port Harcourt",
      content: "Setting up was incredibly easy. Within minutes, we had QR codes printed and were accepting digital payments. The customer support is excellent too.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Aisha Mohammed",
      title: "Pharmacy Director",
      location: "Kano",
      content: "PayQR's integration with multiple payment gateways ensures we never miss a sale. The real-time notifications keep us updated on every transaction.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Emeka Nwosu",
      title: "Supermarket Chain",
      location: "Enugu",
      content: "We deployed PayQR across all our locations. The unified dashboard lets us monitor all stores from one place. It's been a game-changer for our operations.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Blessing Okafor",
      title: "Beauty Salon Owner",
      location: "Ibadan",
      content: "My customers appreciate the contactless payment option. PayQR made it so easy to modernize our payment process without any technical complexity.",
      rating: 5,
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Nigerian Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses across Nigeria who are already using PayQR 
            to streamline their payment processes and grow their revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5,000+</div>
              <div className="text-sm text-gray-600">Active Merchants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₦2.5B</div>
              <div className="text-sm text-gray-600">Processed Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
