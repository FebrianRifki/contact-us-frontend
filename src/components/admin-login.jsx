"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import authService from "@/services/auth-service";



export function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { addToast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            setIsLoading(true);

            const credentials = {
                email: email.trim(),
                password: password.trim(),
            }

            const response = await authService.login(credentials)

            if (response.status_code === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("admin", JSON.stringify(response.data.admin));
                addToast({
                    type: "success",
                    title: "Login Successful",
                    message: "Welcome back! Redirecting to dashboard...",
                    duration: 3000,
                });
                router.push("/admin/")
            }
            if (response.status_code === 401) {
                addToast({
                    type: "error",
                    title: "Login Failed",
                    message: "Invalid email or password. Please try again.",
                    duration: 5000,
                });
            }
            if (response.status_code === 404) {
                addToast({
                    type: "error",
                    title: "Login Failed",
                    message: "User not found. Please check your credentials.",
                    duration: 5000,
                });
            }
        } catch (error) {
            addToast({
                type: "error",
                title: "Login Error",
                message: "Something went wrong. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-3xl mb-6 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Login</h1>
                    <p className="text-slate-600">Sign in to access the admin dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 pr-12 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Demo Credentials Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
                    <div className="text-sm text-blue-800 space-y-1">
                        <p>
                            <strong>Email:</strong> admin@example.com
                        </p>
                        <p>
                            <strong>Password:</strong> admin123
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">Protected admin area. Authorized personnel only.</p>
                </div>
            </div>
        </div>
    )
}
