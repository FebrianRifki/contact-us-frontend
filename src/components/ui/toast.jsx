"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((toast) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = {
            id,
            type: "info",
            duration: 5000,
            ...toast,
        }

        setToasts((prev) => [...prev, newToast])

        if (newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, newToast.duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const removeAllToasts = useCallback(() => {
        setToasts([])
    }, [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within ToastProvider")
    }
    return context
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm w-full">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

function Toast({ toast, onClose }) {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    }

    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    }

    const iconStyles = {
        success: "text-emerald-500",
        error: "text-red-500",
        warning: "text-amber-500",
        info: "text-blue-500",
    }

    const Icon = icons[toast.type]

    return (
        <div
            className={`
        ${styles[toast.type]}
        border rounded-2xl p-4 shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        animate-in slide-in-from-right-full
        hover:scale-[1.02]
      `}
        >
            <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[toast.type]}`} />
                <div className="flex-1 min-w-0">
                    {toast.title && <div className="font-semibold text-sm mb-1">{toast.title}</div>}
                    <div className="text-sm leading-relaxed">{toast.message}</div>
                </div>
                <button onClick={onClose} className="flex-shrink-0 ml-2 p-1.5 rounded-xl hover:bg-black/5 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
