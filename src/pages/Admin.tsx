import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    category: "",
    description: "",
    image_url: "",
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (adminError) {
      console.error("Error checking admin status:", adminError);
      toast.error("Error verifying admin access");
      navigate("/");
      return;
    }

    if (!adminData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    setIsAdmin(true);
  };

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: portfolioItems } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: typeof uploadData & { images: string[] }) => {
      const { error } = await supabase
        .from("portfolio_items")
        .insert([{
          title: data.title,
          category: data.category as "wedding" | "event" | "corporate" | "portrait" | "commercial",
          description: data.description || null,
          image_url: data.images[0] || data.image_url || null,
          images: data.images.length > 0 ? data.images : (data.image_url ? [data.image_url] : []),
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast.success("Portfolio item added successfully!");
      setUploadData({ title: "", category: "", description: "", image_url: "" });
    },
    onError: (error) => {
      console.error("Error uploading:", error);
      toast.error("Failed to add portfolio item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast.success("Portfolio item deleted");
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      // Clear the URL field when files are selected
      setUploadData({ ...uploadData, image_url: "" });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.category) {
      toast.error("Please fill in title and category");
      return;
    }

    // Check if either files are selected or a URL is provided
    if (selectedFiles.length === 0 && !uploadData.image_url) {
      toast.error("Please either upload images or provide an image URL");
      return;
    }

    const imageUrls: string[] = [];

    // If files are selected, upload them first
    if (selectedFiles.length > 0) {
      setUploadingFile(true);
      try {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio')
            .getPublicUrl(filePath);

          imageUrls.push(publicUrl);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Failed to upload images");
        setUploadingFile(false);
        return;
      }
      setUploadingFile(false);
    }

    uploadMutation.mutate({ ...uploadData, images: imageUrls });
    setSelectedFiles([]);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Portfolio Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
                
                <Select
                  value={uploadData.category}
                  onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Description (optional)"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Images (Multiple)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Input
                  placeholder="Image URL (alternative to file upload)"
                  value={uploadData.image_url}
                  onChange={(e) => {
                    setUploadData({ ...uploadData, image_url: e.target.value });
                    setSelectedFiles([]);
                  }}
                  disabled={selectedFiles.length > 0}
                />

                <Button 
                  onClick={handleUpload} 
                  disabled={uploadingFile || uploadMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingFile ? "Uploading..." : "Upload Item"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Requests */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Name:</strong> {booking.client_name}</div>
                        <div><strong>Service:</strong> {booking.service_type}</div>
                        <div><strong>Date:</strong> {booking.event_date}</div>
                        <div><strong>Email:</strong> {booking.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No booking requests yet</p>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {portfolioItems?.map((item) => {
                  const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []);
                  const displayImage = images[0];
                  
                  return (
                    <div key={item.id} className="relative group">
                      {displayImage && (
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm mt-2 font-medium">{item.title}</p>
                      {images.length > 1 && (
                        <p className="text-xs text-muted-foreground">{images.length} images</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;