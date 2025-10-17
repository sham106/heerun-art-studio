import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/heerun-studio-logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="Heerun Studio" 
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-foreground hover:text-primary transition-colors ${
                  location.pathname === item.path ? "text-primary font-semibold" : ""
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                  />
                )}
              </Link>
            ))}
            <Button
              variant="default"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 relative overflow-visible"
              onClick={(e) => {
                const button = e.currentTarget as HTMLButtonElement;
                const rect = button.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;
                const particles: HTMLDivElement[] = [];
                const count = 16;
                for (let i = 0; i < count; i++) {
                  const p = document.createElement("div");
                  const angle = (i / count) * Math.PI * 2;
                  const distance = 18 + Math.random() * 28;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;
                  p.style.position = "fixed";
                  p.style.left = `${originX}px`;
                  p.style.top = `${originY}px`;
                  p.style.width = "5px";
                  p.style.height = "5px";
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
                  const duration = 450 + Math.random() * 250;
                  p.animate(keyframes, {
                    duration,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards",
                  }).onfinish = () => p.remove();
                }
                setTimeout(() => navigate("/booking"), 520);
              }}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-foreground hover:text-primary transition-colors ${
                    location.pathname === item.path ? "text-primary font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 relative overflow-visible"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  const button = e.currentTarget as HTMLButtonElement;
                  const rect = button.getBoundingClientRect();
                  const originX = rect.left + rect.width / 2;
                  const originY = rect.top + rect.height / 2;
                  const particles: HTMLDivElement[] = [];
                  const count = 16;
                  for (let i = 0; i < count; i++) {
                    const p = document.createElement("div");
                    const angle = (i / count) * Math.PI * 2;
                    const distance = 16 + Math.random() * 26;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    p.style.position = "fixed";
                    p.style.left = `${originX}px`;
                    p.style.top = `${originY}px`;
                    p.style.width = "5px";
                    p.style.height = "5px";
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
                    const duration = 420 + Math.random() * 240;
                    p.animate(keyframes, {
                      duration,
                      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                      fill: "forwards",
                    }).onfinish = () => p.remove();
                  }
                  setTimeout(() => navigate("/booking"), 500);
                }}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;