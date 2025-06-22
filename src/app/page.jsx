import { ContactForm } from "@/components/contact-form"
import { Mail } from "lucide-react"

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-3xl mb-8 shadow-lg">
                            <Mail className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Contact Us</h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
                            We'd love to hear from you. Send us a message and we'll respond within 24 hours.
                        </p>
                    </div>
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
