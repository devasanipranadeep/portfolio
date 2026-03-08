import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Attempting login with:', { email, passwordLength: password.length });
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    console.log('Auth response:', { data, error });
    
    if (error) {
      console.error('Login error details:', error);
      toast({ 
        title: "Login failed", 
        description: error.message || "Authentication failed", 
        variant: "destructive" 
      });
      setLoading(false);
      return;
    }
    
    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User data:', user);
    
    if (!user) {
      toast({ title: "Login failed", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    console.log('User roles:', roles);
    
    const isAdmin = roles?.some((r) => r.role === "admin");
    console.log('Is admin:', isAdmin);
    
    if (!isAdmin) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You are not an admin.", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass-card rounded-xl p-8"
      >
        <h1 className="text-2xl font-display font-bold text-foreground mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Sign in to manage your portfolio</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
