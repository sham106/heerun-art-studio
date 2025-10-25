import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  client_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  service_type: z.string().min(1, "Please select a service"),
  event_date: z.string().min(1, "Please select a date"),
  location: z.string().min(3, "Location must be at least 3 characters").max(200),
  duration: z.string().min(1, "Please select duration"),
  requirements: z.string().max(1000).optional(),
  budget: z.string().max(50).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Booking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationUrl = useLocation();
  const searchParams = new URLSearchParams(locationUrl.search);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      email: "",
      phone: "",
      service_type: searchParams.get("service") || "",
      event_date: "",
      location: "",
      duration: "",
      requirements: "",
      budget: "",
    },
  });

  useEffect(() => {
    const serviceFromUrl = searchParams.get("service");
    if (serviceFromUrl) {
      form.setValue("service_type", serviceFromUrl);
    }
  }, [locationUrl, form, searchParams]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error } = await supabase.from("booking_requests").insert([{
        client_name: values.client_name,
        email: values.email,
        phone: values.phone,
        service_type: values.service_type,
        event_date: values.event_date,
        location: values.location,
        duration: values.duration,
        requirements: values.requirements || null,
        budget: values.budget || null,
      }]);
      
      if (error) throw error;

      // Format WhatsApp message
      const message = `
New Booking Request:
Name: ${values.client_name}
Email: ${values.email}
Phone: ${values.phone}
Service: ${values.service_type}
Date: ${values.event_date}
Location: ${values.location}
Duration: ${values.duration}
${values.requirements ? `Requirements: ${values.requirements}` : ""}
${values.budget ? `Budget: ${values.budget}` : ""}
      `.trim();

      // Replace with your actual WhatsApp number (format: country code + number, no + or spaces)
      const whatsappNumber = "254748804536";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      toast.success("Booking request submitted! Redirecting to WhatsApp...");
      form.reset();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Book Your Session
            </h1>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and we'll get back to you shortly
            </p>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-8 rounded-2xl border border-border shadow-card"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="client_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Wedding Photography">Wedding Photography</SelectItem>
                            <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                            <SelectItem value="Portrait Session">Portrait Session</SelectItem>
                            <SelectItem value="Event Coverage">Event Coverage</SelectItem>
                            <SelectItem value="Commercial">Commercial Photography</SelectItem>
                            <SelectItem value="Custom">Custom Package</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event/Session Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Event venue or address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration Needed *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Half Day (4 hours)">Half Day (4 hours)</SelectItem>
                          <SelectItem value="Full Day (8 hours)">Full Day (8 hours)</SelectItem>
                          <SelectItem value="Multiple Days">Multiple Days</SelectItem>
                          <SelectItem value="Hourly">Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Under Rs 500">Under Rs 500</SelectItem>
                          <SelectItem value="Rs 500 - Rs 1,000">Rs 500 - Rs 1,000</SelectItem>
                          <SelectItem value="Rs 1,000 - Rs 2,500">Rs 1,000 - Rs 2,500</SelectItem>
                          <SelectItem value="Rs 2,500 - Rs 5,000">Rs 2,500 - Rs 5,000</SelectItem>
                          <SelectItem value="Over Rs 5,000">Over Rs 5,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your event and any specific requirements..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;