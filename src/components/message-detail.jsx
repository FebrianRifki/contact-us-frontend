"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Trash2, Clock, User, MessageSquare, Send, Reply } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/toast"
import emailService from "@/services/email-service"
import { useRouter, useParams } from "next/navigation"
import { title } from "process"

export function MessageDetail() {
    const [isReplying, setIsReplying] = useState(false)
    const [replySubject, setReplySubject] = useState("")
    const [replyMessage, setReplyMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { addToast } = useToast()
    const [isReplied, setReplied] = useState(false);
    const [message, setMessage] = useState({})
    const { id } = useParams()
    const router = useRouter()


    const fetchDetailMail = async () => {
        setIsLoading(true)
        try {
            const response = await emailService.getEmailById(parseInt(id))
            if (response.status_code === 200) {
                setMessage(response.data)
            } else {
                throw new Error("Failed to fetch message")
            }
        } catch (error) {
            console.error("Failed to fetch message:", error)
            addToast({
                type: "error",
                title: "Error",
                message: "Failed to load message details. Please try again later.",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }


    const updateStatus = async () => {
        try {
            const payload = { status: 1 };
            const response = await emailService.updateEmailStatus(parseInt(id), payload);
            if (response.status_code === 200) {
                addToast({
                    type: "success",
                    title: "Update Success",
                    message: "Message status has been updated",
                    duration: 3000,
                });
                fetchDetailMail();
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.log("failed to update status", error);
            addToast({
                type: "error",
                title: "Error",
                message: "Failed to update status",
                duration: 5000,
            })
        }
    }

    const fetchReplyMessage = async () => {
        try {
            const response = await emailService.getReplyMessage(parseInt(id));
            if (response.status_code === 200 && response.data && response.data.length > 0) {
                setIsReplying(true);
                setReplySubject(response.data[0].subject);
                setReplyMessage(response.data[0].message);
                setReplied(true);
            }
        } catch (error) {
            console.log(error);
            addToast({
                type: "error",
                title: "Error",
                message: "Failed to load reply message. Please try again later.",
                duration: 5000,
            });
            return null;
        }
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
        }
        fetchDetailMail();
        fetchReplyMessage();
    }, []);

    if (!message) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Not Found</h2>
                    <p className="text-slate-600 mb-4">The message you're looking for doesn't exist.</p>
                    <Link href="/admin">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "unread":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "read":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "replied":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const handleReply = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                message: replyMessage
            }

            let response = await emailService.reply(id, payload);
            if (response.status_code === 200) {
                addToast({
                    type: "success",
                    title: "Reply Sent",
                    message: "Your reply has been sent successfully.",
                    duration: 5000,
                });
                // setIsReplying(false);
                // setReplyMessage("");
                fetchDetailMail();
            }
        } catch (error) {
            addToast({
                type: "error",
                title: "Failed to Send",
                message: "Something went wrong. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");

        if (!confirmDelete) return; // Kalau user klik "Cancel", hentikan

        try {
            const response = await emailService.deleteEmail(parseInt(id)); // pastikan kamu mengirim ID
            if (response.status_code === 200) {
                addToast({
                    type: "success",
                    title: "Deleted",
                    message: "The message has been deleted successfully.",
                    duration: 5000,
                });
                router.push("/admin/");
            }
        } catch (error) {
            addToast({
                type: "error",
                title: "Failed to Delete",
                message: "Something went wrong. Please try again.",
                duration: 5000,
            });
        }
    };


    const startReply = () => {
        setIsReplying(true)
        setReplySubject(`Re: ${message.subject}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button variant="outline" className="rounded-xl">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Message Details</h1>
                            <p className="text-slate-600">View and reply to contact message</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Message Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                            {/* Message Header */}
                            <div className="border-b border-slate-200 pb-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{message.subject}</h2>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${getStatusColor(
                                                message.status === 0
                                                    ? "unread"
                                                    : message.status === 1
                                                        ? "read"
                                                        : message.status === 2
                                                            ? "replied"
                                                            : ""
                                            )} border`}>
                                                <span className="capitalize">
                                                    {message.status === 0
                                                        ? "unread"
                                                        : message.status === 1
                                                            ? "read"
                                                            : message.status === 2
                                                                ? "replied"
                                                                : ""}
                                                </span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button disabled={isReplied} onClick={startReply} className="rounded-xl">
                                        <Reply className="w-4 h-4 mr-2" />
                                        Reply
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDate(message.created_at)}</span>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Message Content
                                    </h3>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reply Form */}
                        {isReplying && (
                            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 mt-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Send Reply
                                </h3>

                                <form onSubmit={handleReply} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="replySubject" className="text-sm font-semibold text-slate-800">
                                            Subject
                                        </Label>
                                        <Input
                                            id="replySubject"
                                            value={replySubject}
                                            onChange={(e) => setReplySubject(e.target.value)}
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                            required
                                            disabled={isReplied}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="replyMessage" className="text-sm font-semibold text-slate-800">
                                            Message
                                        </Label>
                                        <Textarea
                                            id="replyMessage"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            rows={8}
                                            className="bg-slate-50 border-slate-200 rounded-xl resize-none"
                                            placeholder="Type your reply here..."
                                            required
                                            disabled={isReplied}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={isSubmitting || isReplied} className="rounded-xl">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Reply
                                                </>
                                            )}
                                        </Button>
                                        <Button disabled={isReplied} type="button" variant="outline" onClick={() => setIsReplying(false)} className="rounded-xl">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-600">Name</p>
                                    <p className="font-medium text-slate-900">
                                        {message.first_name} {message.last_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Email</p>
                                    <p className="font-medium text-slate-900">{message.sender_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Received</p>
                                    <p className="font-medium text-slate-900">{formatDate(message.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" onClick={updateStatus} className="w-full justify-start rounded-xl">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Mark as Read
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDelete}
                                    className="w-full justify-start rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
