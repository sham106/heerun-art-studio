import { motion } from "framer-motion";
import { Award, Camera, Users, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import photographerPortrait from "@/assets/photographer-portrait.jpg";

const About = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Camera, value: "1000+", label: "Events Covered" },
    { icon: Award, value: "50+", label: "Awards Won" },
    { icon: Heart, value: "15+", label: "Years Experience" },
  ];

  // Fetch sample portfolio items
  const { data: portfolioSamples } = useQuery({
    queryKey: ["about-samples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      
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
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate photographers dedicated to capturing life's most precious moments
            </p>
          </motion.div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded over 15 years ago, LensArt Studio began with a simple mission: to capture moments that matter and create timeless memories for our clients.
                </p>
                <p>
                  What started as a passion project has grown into a full-service photography and videography studio, serving hundreds of clients across weddings, corporate events, and personal portraits.
                </p>
                <p>
                  Our team of experienced photographers combines technical expertise with artistic vision to deliver stunning results that exceed expectations every time.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={photographerPortrait}
                  alt="Professional Photographer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-2xl" />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Equipment & Expertise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card p-12 rounded-2xl border border-border"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Professional Equipment & Expertise</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Top-Tier Cameras</h3>
                <p className="text-muted-foreground">
                  We use professional-grade Canon and Sony mirrorless cameras with full-frame sensors for exceptional image quality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Premium Lenses</h3>
                <p className="text-muted-foreground">
                  Our collection includes prime and zoom lenses from 16mm to 400mm, ensuring perfect shots in any situation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Pro Lighting</h3>
                <p className="text-muted-foreground">
                  Professional studio and portable lighting systems to create perfect illumination for every scene.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Awards & Certifications</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Best Wedding Photographer 2023",
                "Professional Photographers Association",
                "Master of Photography Certification",
                "Excellence in Event Photography Award",
              ].map((award, idx) => (
                <div
                  key={idx}
                  className="px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-sm"
                >
                  {award}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sample Work */}
          {portfolioSamples && portfolioSamples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Our Work in Action</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {portfolioSamples.map((item, idx) => {
                  const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []);
                  const displayImage = images[0];
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                    >
                      {displayImage && (
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-lg">{item.title}</h3>
                          <p className="text-primary text-sm uppercase">{item.category}</p>
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
        </div>
      </div>
    </div>
  );
};

export default About;