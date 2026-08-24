import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { LogIn, AlertCircle } from "lucide-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address (must contain @ and .)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      if (err.response?.status === 404) {
        setErrors({ email: message });
      } else if (err.response?.status === 401) {
        setErrors({ password: message });
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-1">Welcome back</h2>
          <p className="text-sm text-surface-500">Sign in to your account</p>
        </div>

        <TabsList className="w-full mb-6">
          <TabsTrigger value="student" activeValue={activeTab} onValueChange={setActiveTab} className="flex-1">
            Student
          </TabsTrigger>
          <TabsTrigger value="professor" activeValue={activeTab} onValueChange={setActiveTab} className="flex-1">
            Professor
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={activeTab === "professor" ? "professor@university.edu" : "student@university.edu"}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              className={errors.email ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.email && (
              <p className="text-xs text-danger flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              className={errors.password ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.password && (
              <p className="text-xs text-danger flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                Sign In as {activeTab === "professor" ? "Professor" : "Student"}
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
