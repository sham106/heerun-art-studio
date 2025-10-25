import { motion } from "framer-motion";
import { Camera, Video, Users, Heart, Briefcase, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import sparklesFromElement from "@/lib/sparkle";

const services = [
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Capture every precious moment of your special day with our comprehensive wedding photography packages.",
    features: ["Full day coverage", "Engagement shoot", "Custom album"],
    price: "From Rs 2,500",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Briefcase,
    title: "Corporate Events",
    description: "Professional documentation of your business events, conferences, and seminars.",
    features: ["Event coverage", "Speaker photos", "Fast delivery"],
    price: "From Rs 1,200",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "Portrait Sessions",
    description: "Professional headshots and personal portraits for individuals and families.",
    features: ["Studio or outdoor", "Professional editing", "Multiple looks"],
    price: "From Rs 450",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Video,
    title: "Event Coverage",
    description: "Dynamic photography for concerts, festivals, and special celebrations.",
    features: ["Action shots", "Atmosphere capture", "Social media ready"],
    price: "From Rs 800",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Camera,
    title: "Commercial Photography",
    description: "Product photography and commercial shoots for businesses and brands.",
    features: ["Product shots", "Lifestyle images", "Brand aligned"],
    price: "From Rs 950",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Sparkles,
    title: "Custom Packages",
    description: "Tailored photography services to meet your specific needs and requirements.",
    features: ["Flexible options", "Custom pricing", "Personalized service"],
    price: "Contact Us",
    gradient: "from-cyan-500 to-blue-600",
  },
];

const Services = () => {
  // Fetch portfolio items for each service category
  const { data: portfolioSamples } = useQuery({
    queryKey: ["service-samples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional photography and videography services tailored to your needs
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      <Link to={`/booking?service=${encodeURIComponent(service.title)}`}>
                        <Button
                          variant="outline"
                          className="hover:bg-primary hover:text-primary-foreground"
                        >
                          Book Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sample Work Gallery */}
          {portfolioSamples && portfolioSamples.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center mb-8">Sample Work</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {portfolioSamples.map((item, idx) => {
                  const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []);
                  const displayImage = images[0];
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      {displayImage && (
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm">{item.title}</p>
                          <p className="text-primary text-xs uppercase">{item.category}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="text-center">
                <Link to="/portfolio">
                  <Button variant="outline" size="lg" className="hover:border-primary">
                    View Full Portfolio <Eye className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center bg-card p-12 rounded-2xl border border-border"
          >
            <h2 className="text-3xl font-bold mb-4">Need a Custom Package?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We understand that every event is unique. Contact us to discuss a personalized package that fits your specific needs.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;