
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useVerification } from "@/context/vendor-verification-context";
import { useUser } from "@/context/user-context";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setAsVerified, setAsUnverified, setVendorType } = useVerification();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const loginSuccess = (type: 'both' | 'personalized' | 'corporate', isVerified: boolean) => {
        if (isVerified) {
            setAsVerified();
        } else {
            setAsUnverified();
        }
        setVendorType(type);
        toast({
            title: "Login Successful",
            description: "Redirecting to your vendor dashboard.",
        });
        router.push("/vendor/dashboard");
    };

    const loginFail = () => {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
        });
    }

    if (password !== "vendorpass") {
        loginFail();
        return;
    }

    switch(email) {
        case 'vendor@example.com':
            loginSuccess('both', true);
            break;
        case 'unverified@example.com':
            loginSuccess('both', false);
            break;
        case 'personalized@example.com':
            loginSuccess('personalized', true);
            break;
        case 'corporate@example.com':
            loginSuccess('corporate', true);
            break;
        default:
            loginFail();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-muted/40">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Vendor Portal</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard. Use `unverified@example.com` to see the verification flow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot your password?
                  </Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-muted" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="font-normal">
                Remember me
                </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-sm text-center text-muted-foreground">
                Don't have a vendor account?{" "}
                <Link href="/vendor/signup" className="font-semibold text-primary hover:underline">
                    Sign Up
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
