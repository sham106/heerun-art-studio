import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully!");
      navigate("/admin");
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please sign in.");
      setIsSignUp(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isSignUp ? "Admin Sign Up" : "Admin Login"}
        </h1>
        <div className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (isSignUp ? handleSignUp() : handleSignIn())}
          />
          <Button 
            onClick={isSignUp ? handleSignUp : handleSignIn} 
            disabled={isLoading} 
            className="w-full bg-gradient-to-r from-primary to-secondary"
          >
            {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Sign Up" : "Sign In")}
          </Button>
          <Button 
            onClick={() => setIsSignUp(!isSignUp)} 
            variant="ghost" 
            className="w-full"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;