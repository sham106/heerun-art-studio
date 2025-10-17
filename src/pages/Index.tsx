import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import RotatingCube from "@/components/RotatingCube";
import ServiceContent from "@/components/ServiceContent";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentFace, setCurrentFace] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent portfolio items
  const { data: portfolioItems } = useQuery({
    queryKey: ["recent-portfolio"],
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Capturing Moments,
              <br />
              Creating Memories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional photography and videography services for weddings, events, and corporate functions
            </p>
          </motion.div>

          {/* Split Screen Layout */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Rotating Cube */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RotatingCube />
            </motion.div>

            {/* Right: Synchronized Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ServiceContent currentFace={currentFace} />
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 relative overflow-visible"
              onClick={(e) => {
                e.preventDefault();
                const button = e.currentTarget as HTMLButtonElement;
                const rect = button.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;
                const particles: HTMLDivElement[] = [];
                const count = 18;
                for (let i = 0; i < count; i++) {
                  const p = document.createElement("div");
                  const angle = (i / count) * Math.PI * 2;
                  const distance = 20 + Math.random() * 30;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;
                  p.style.position = "fixed";
                  p.style.left = `${originX}px`;
                  p.style.top = `${originY}px`;
                  p.style.width = "6px";
                  p.style.height = "6px";
                  p.style.borderRadius = "50%";
                  p.style.pointerEvents = "none";
                  p.style.zIndex = "9999";
                  p.style.background = "conic-gradient(from 0deg, var(--primary), var(--secondary))";
                  document.body.appendChild(p);
                  particles.push(p);
                  const keyframes: Keyframe[] = [
                    { transform: "translate(0, 0) scale(1)", opacity: 1 },
                    { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 },
                  ];
                  const duration = 500 + Math.random() * 250;
                  p.animate(keyframes, {
                    duration,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards",
                  }).onfinish = () => p.remove();
                }
                setTimeout(() => navigate("/booking"), 550);
              }}
            >
              Book Your Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "1000+", label: "Events Covered" },
              { number: "15+", label: "Years Experience" },
              { number: "50+", label: "Awards Won" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      {portfolioItems && portfolioItems.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Recent Work</h2>
              <p className="text-muted-foreground mb-8">
                Check out some of our latest photography and videography projects
              </p>
              <Link to="/portfolio">
                <Button variant="outline" size="lg" className="hover:border-primary">
                  View Full Portfolio <Eye className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {portfolioItems.map((item, idx) => {
                const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []);
                const displayImage = images[0];
                const hasVideo = !!item.video_url;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    {hasVideo ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="text-white text-sm">Video</div>
                      </div>
                    ) : displayImage ? (
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                        <p className="text-primary text-sm uppercase">{item.category}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & John",
                text: "Absolutely stunning wedding photos! Every moment was captured beautifully.",
                rating: 5,
              },
              {
                name: "Tech Corp Inc.",
                text: "Professional and efficient. Perfect for our corporate event coverage.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                text: "The portrait session was amazing. Felt comfortable and the results are incredible!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-card p-6 rounded-xl border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Portfolio Button */}
      <Link to="/portfolio">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-2xl rounded-full h-16 w-16 p-0"
          >
            <Eye className="w-6 h-6" />
          </Button>
        </motion.div>
      </Link>
    </div>
  );
};

export default Index;