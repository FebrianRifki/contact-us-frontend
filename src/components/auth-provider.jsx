"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => {
        try {
            const authData = localStorage.getItem("adminAuth")
            if (authData) {
                const parsed = JSON.parse(authData)
                if (parsed.isAuthenticated) {
                    setIsAuthenticated(true)
                    setUser({ email: parsed.email })
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = (userData) => {
        setIsAuthenticated(true)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("adminAuth")
        setIsAuthenticated(false)
        setUser(null)
        router.push("/admin/login")
    }

    // Redirect to login if not authenticated and trying to access admin pages
    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname?.startsWith("/admin") && pathname !== "/admin/login") {
            router.push("/admin/login")
        }
    }, [isAuthenticated, isLoading, pathname, router])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
