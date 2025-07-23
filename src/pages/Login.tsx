import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeddingAuth } from "@/contexts/WeddingAuthContext";
import { useToast } from "@/hooks/use-toast";
import Background from "@/components/Background";
import { ArrowRightLeft, LucideArrowLeftSquare } from "lucide-react";
import { WebEntry } from "@/types/wedding";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, setUserId, globalIsLoading } = useWeddingAuth();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            } else if (result.user) {
                toast({
                    title: "Success",
                    description: "Logged in successfully!",
                });
                setUserId(result.user.id);
                navigate(`/wedding/${result.user.id}`);
            } else {
                toast({
                    title: "Error",
                    description: "Login failed: No user returned.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "An unexpected error occurred",
                variant: "destructive",
            });
            console.log("Error logging in:", error?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Background>
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center flex-col justify-around w-full">
                <div className="w-full p-6 flex justify-center items-center">
                    <div className="backdrop-blur-md bg-white/30 rounded-3xl p-8 border border-white/20 shadow-2xl w-full max-w-md">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            Login
                        </h1>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="backdrop-blur-sm bg-white/50"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="backdrop-blur-sm bg-white/50"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {globalIsLoading ? "Logging in..." : "Login"}
                            </Button>
                            <div className="text-center">
                                <Link
                                    to="/"
                                    className="p-2 mt-5 underline w-full text-muted-foreground"
                                >
                                    <LucideArrowLeftSquare className="inline mr-2" />
                                    Back to home{" "}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-full md:max-h-20 max-h-10">
                    <Footer />
                </div>
            </div>
        </Background>
    );
};

export default Login;
