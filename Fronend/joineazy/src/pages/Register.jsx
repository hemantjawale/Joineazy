import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { UserPlus, AlertCircle, Check } from "lucide-react";

export default function Register() {
  const [activeTab, setActiveTab] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email (must contain @ and .)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => setErrors((p) => ({ ...p, [field]: undefined }));

  const passwordChecks = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Passwords match", met: password.length > 0 && password === confirmPassword },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const user = await register(name.trim(), email.toLowerCase().trim(), password, activeTab);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      if (err.response?.status === 409) {
        setErrors({ email: message });
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
          <h2 className="text-xl font-semibold text-surface-900 mb-1">Create account</h2>
          <p className="text-sm text-surface-500">Join Joineazy to get started</p>
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError("name"); }}
              className={errors.name ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.name && (
              <p className="text-xs text-danger flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder={activeTab === "professor" ? "professor@university.edu" : "student@university.edu"}
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              className={errors.email ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.email && (
              <p className="text-xs text-danger flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              className={errors.password ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.password && (
              <p className="text-xs text-danger flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
              className={errors.confirmPassword ? "border-danger ring-1 ring-danger/20" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-danger flex items-center gap-1"><AlertCircle size={12} /> {errors.confirmPassword}</p>
            )}
          </div>

          {password.length > 0 && (
            <div className="bg-surface-50 rounded-lg p-3 space-y-1.5">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${check.met ? "bg-success text-white" : "bg-surface-200"}`}>
                    {check.met && <Check size={10} />}
                  </div>
                  <span className={`text-xs ${check.met ? "text-success" : "text-surface-400"}`}>{check.label}</span>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={16} />
                Create {activeTab === "professor" ? "Professor" : "Student"} Account
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
