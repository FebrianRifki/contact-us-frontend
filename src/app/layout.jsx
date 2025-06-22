import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Contact us",
    description: "Clean and minimalist contact form design",
}

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className={inter.className}>
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    )
}
