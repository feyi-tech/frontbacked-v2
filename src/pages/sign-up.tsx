import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation';
import Head from 'next/head';
import { useBackend } from '../lib/BackendProvider';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
  
    const { auth, user } = useBackend();

    const showMessage = (message: string, isError = false) => {
        setMessage(message);
        setIsError(isError);
    };

    const handleSignUp = async () => {
        if (!firstName || !email || !password) {
        showMessage("Please fill in all fields.", true);
        return;
        }
        
        if (password.length < 6) {
        showMessage("Password should be at least 6 characters.", true);
        return;
        }

        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the user's profile with their first name
        await updateProfile(userCredential.user, {
            displayName: firstName
        });
        
        showMessage("Account created successfully!");
        } catch (error: any) {
        console.error("Sign-up error:", error);
        showMessage(`Sign-up failed: ${error.message}`, true);
        }
    };

    return (
        <>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Generate sites" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Navigation />
                <Card className="w-full max-w-sm bg-card border-border shadow-elegant">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-foreground">
                            Create Account
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <div className="space-y-6">
                            <p className="text-muted-foreground text-center">
                                Create your new account
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-foreground">
                                        First Name
                                    </Label>
                                    <Input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        autoComplete="given-name"
                                        className="bg-input border-border focus:ring-ring"
                                    />
                                </div>

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
                                            autoComplete="new-password"
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
                                onClick={handleSignUp}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Create Account
                                </Button>
                                
                                <div className="text-center">
                                    <span className="text-muted-foreground text-sm">
                                        Already have an account?{' '}
                                    </span>
                                    <Link 
                                        href="/sign-in" 
                                        className="text-primary hover:text-primary/80 text-sm font-medium"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    

                        {/* Message Box */}
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

export default SignUp;