import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const categories = ["All", "Wedding", "Event", "Corporate", "Portrait", "Commercial"];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredItems = portfolioItems?.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our latest work and creative photography
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-secondary"
                    : "hover:border-primary"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Portfolio Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => {
                  const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []);
                  const displayImage = images[0];
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      {displayImage && (
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                          {item.description && (
                            <p className="text-white/80 text-sm">{item.description}</p>
                          )}
                          {images.length > 1 && (
                            <p className="text-white/60 text-xs mt-2">+{images.length - 1} more photos</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No portfolio items found in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl">
          {selectedItem && (() => {
            const images = selectedItem.images && selectedItem.images.length > 0 
              ? selectedItem.images 
              : (selectedItem.image_url ? [selectedItem.image_url] : []);
            
            return (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                  {selectedItem.description && (
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  )}
                </div>
                
                {images.length > 1 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((imageUrl: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video w-full overflow-hidden rounded-lg">
                            <img
                              src={imageUrl}
                              alt={`${selectedItem.title} - ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10 md:-left-12" />
                    <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10 md:-right-12" />
                  </Carousel>
                ) : images.length === 1 ? (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={images[0]}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : null}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;