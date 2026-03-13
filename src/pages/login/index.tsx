import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';
import Head from 'next/head';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(user && !loading) {
      const next = router.query.next as string;
      if(next) {
        router.push(next);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  const showMessage = (message: string, isError = false) => {
    setMessage(message);
    setIsError(isError);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showMessage("Please enter both email and password.", true);
      return;
    }

    try {
      await login({ email, password });
      showMessage("Signed in successfully!");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      showMessage(`Sign-in failed: ${error.message}`, true);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | FrontBacked</title>
      </Head>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Navigation />
        <Card className="w-full max-w-sm bg-card border-border shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              Sign In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <p className="text-muted-foreground text-center">
                Sign in to your account
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="bg-input border-border focus:ring-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="bg-input border-border focus:ring-ring pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="text-center">
                  <span className="text-muted-foreground text-sm">
                    Don't have an account?{' '}
                  </span>
                  <Link 
                    href="/register"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>

            {message && (
              <div className={`text-center text-sm p-3 rounded-md ${
                isError 
                  ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                  : 'bg-primary/10 text-primary border border-primary/20'
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
