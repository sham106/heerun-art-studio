import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const serviceDetails = [
  {
    id: 0,
    title: "Wedding Photography",
    description: "Preserve the magic of your special day with our comprehensive wedding photography packages.",
    features: [
      "Full day coverage",
      "Engagement session included",
      "Professional editing",
      "Online gallery delivery",
      "Custom album design",
    ],
    pricing: "Starting from Rs 2,500",
  },
  {
    id: 1,
    title: "Corporate Events",
    description: "Professional coverage for conferences, seminars, and business gatherings.",
    features: [
      "Event documentation",
      "Speaker photography",
      "Candid moments",
      "Brand-aligned editing",
      "Fast turnaround",
    ],
    pricing: "Starting from Rs 1,200",
  },
  {
    id: 2,
    title: "Portrait Sessions",
    description: "Stunning professional headshots and personal portraits for any occasion.",
    features: [
      "Studio or location shoot",
      "Wardrobe consultation",
      "Professional retouching",
      "Multiple looks",
      "High-res files",
    ],
    pricing: "Starting from Rs 450",
  },
  {
    id: 3,
    title: "Event Coverage",
    description: "Dynamic photography for concerts, festivals, and special celebrations.",
    features: [
      "Action photography",
      "Atmosphere capture",
      "Crowd moments",
      "Stage coverage",
      "Social media ready",
    ],
    pricing: "Starting from Rs 800",
  },
];

interface ServiceContentProps {
  currentFace: number;
}

const ServiceContent = ({ currentFace }: ServiceContentProps) => {
  const service = serviceDetails[currentFace];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentFace}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col justify-center p-8"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {service.title}
        </h3>
        
        <p className="text-lg text-muted-foreground mb-6">
          {service.description}
        </p>

        <div className="space-y-3 mb-6">
          {service.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-primary mb-4">{service.pricing}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceContent;