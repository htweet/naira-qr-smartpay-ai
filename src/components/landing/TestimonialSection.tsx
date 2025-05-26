
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Adebayo Ogundimu",
      role: "Restaurant Owner",
      content: "PayQR has revolutionized how we accept payments. Our customers love the convenience and we've seen a 40% increase in transactions.",
      rating: 5,
      initials: "AO"
    },
    {
      name: "Fatima Ibrahim",
      role: "Retail Store Manager",
      content: "The analytics features help us understand our payment patterns better. Setup was incredibly easy and customer support is excellent.",
      rating: 5,
      initials: "FI"
    },
    {
      name: "Chike Okafor",
      role: "Event Organizer",
      content: "For events, PayQR is a game-changer. Quick setup, reliable payments, and detailed reporting make our job so much easier.",
      rating: 5,
      initials: "CO"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses already using PayQR.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
