"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, ArrowRight, User, MessageSquare, LogIn } from "lucide-react"
import emailService from "@/services/email-service"
// import { submitContactForm } from "@/app/actions"
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addToast } = useToast()
    const router = useRouter();

    async function handleSubmit(formData) {
        setIsSubmitting(true)
        try {
            const payload = {
                first_name: formData.get("firstName"),
                last_name: formData.get("lastName"),
                sender_email: formData.get("email"),
                subject: formData.get("subject"),
                message: formData.get("message"),
            }

            const result = await emailService.sendEmail(payload);
            if (result.success) {
                addToast({
                    type: "success",
                    title: "Message Sent!",
                    message: "Thank you! We'll get back to you soon.",
                    duration: 6000,
                })

                const form = document.getElementById("contact-form")
                form?.reset()
            } else {
                addToast({
                    type: "error",
                    title: "Failed to Send",
                    message: result.error || "Something went wrong. Please try again.",
                    duration: 8000,
                })
            }
            // const form = document.getElementById("contact-form")
            // form?.reset();
        } catch (error) {
            addToast({
                type: "error",
                title: "An Error Occurred",
                message: "Unable to send message. Please check your internet connection.",
                duration: 8000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-12">
            {/* Header with Login Button */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Contact Us</h2>
                    <p className="text-slate-600">Get in touch with our team</p>
                </div>
                <Button
                    onClick={() => {
                        addToast({
                            type: "info",
                            title: "Redirecting to Login",
                            message: "Taking you to the admin login page...",
                            duration: 3000,
                        })

                        router.push('/admin/login');

                    }}
                    variant="outline"
                    className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-900 font-medium rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    Admin Login
                </Button>
            </div>
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-2 border-slate-100">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Send Message</h2>
                    <p className="text-slate-600">Fill out the form below and we'll get back to you as soon as possible</p>
                </div>

                <form id="contact-form" action={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                First Name *
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="h-12 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200 font-medium"
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Last Name *
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="h-12 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200 font-medium"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="h-12 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200 font-medium"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            name="subject"
                            type="text"
                            className="h-12 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200 font-medium"
                            placeholder="What is your message about?"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message *
                        </Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            className="bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-200 resize-none font-medium"
                            placeholder="Write your message here..."
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 group shadow-lg hover:shadow-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Sending Message...
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                    <p className="text-slate-600 font-medium">hello@example.com</p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
                        <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                    <p className="text-slate-600 font-medium">+62 274 123 4567</p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Location</h3>
                    <p className="text-slate-600 font-medium">Yogyakarta, Indonesia</p>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                    <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Business Hours</h3>
                <div className="space-y-2 text-lg">
                    <p className="text-slate-300">
                        <span className="font-semibold text-white">Monday - Friday:</span> 8:00 AM - 5:00 PM WIB
                    </p>
                    <p className="text-slate-300">
                        <span className="font-semibold text-white">Saturday:</span> 8:00 AM - 12:00 PM WIB
                    </p>
                </div>
                <p className="text-slate-400 mt-6 text-base">We'll respond to your email within 24 hours on business days</p>
            </div>
        </div>
    )
}
