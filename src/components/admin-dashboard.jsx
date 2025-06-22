"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Search, Eye, Clock, CheckCircle, LogOut, User } from "lucide-react"
import Link from "next/link"
import emailService from "@/services/email-service";
import { useToast } from "@/components/ui/toast"
import authService from "@/services/auth-service"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
    const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const { addToast } = useToast()
    const [ureadMessages, setUnreadMessage] = useState(0);
    const [isReadMessages, setIsReadMessage] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const router = useRouter()

    const filteredMessages = messages.filter((message) => {
        const matchesSearch =
            message.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || message.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const displayUnreadMessage = () => {
        const unreadMessages = allMessages.filter((message) => message.status === 0);
        console.log(unreadMessages);
        setMessages(unreadMessages);
    }
    const displayReadedMessage = () => {
        const readMessages = allMessages.filter((message) => message.status === 1);
        console.log(readMessages);
        setMessages(readMessages);
    }
    const displayAllMessages = () => {
        setMessages(allMessages);
    }
    const displayRepliedMessages = () => {
        const repliedMessages = allMessages.filter((message) => message.status === 2);
        setMessages(repliedMessages);
    }

    const fetchEmails = async () => {
        try {
            setIsLoading(true);
            const response = await emailService.getAllEmails();
            setMessages(response.data);
            setAllMessages(response.data);
            const readMessages = response.data.filter((message) => message.status === 1);
            setIsReadMessage(readMessages.length);

            const unreadMessages = response.data.filter((message) => message.status === 0);
            setUnreadMessage(unreadMessages.length);
        } catch (error) {
            console.error("Failed to fetch emails:", error);
            addToast({
                title: "Error",
                description: "Failed to fetch emails. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const getUserData = () => {
        const user = localStorage.getItem("admin");
        if (user) {
            setUserData(JSON.parse(user));
        } else {
            setUserData(null);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
        }
        fetchEmails();
        getUserData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case "unread":
                return <Mail className="w-4 h-4" />
            case "read":
                return <Eye className="w-4 h-4" />
            case "replied":
                return <CheckCircle className="w-4 h-4" />
            default:
                return <Mail className="w-4 h-4" />
        }
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

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleFilterClick = (status) => {
        setStatusFilter(status);

        if (status === "unread") displayUnreadMessage();
        else if (status === "read") displayReadedMessage();
        else if (status === "all") displayAllMessages();
        else if (status === "replied") displayRepliedMessages();
    };


    const getStats = () => {
        const total = messages.length
        const unread = messages.filter((m) => m.status === "unread").length
        const read = messages.filter((m) => m.status === "read").length
        const replied = messages.filter((m) => m.status === "replied").length

        return { total, unread, read, replied }
    }

    const stats = getStats()

    const handleLogout = async () => {
        await authService.logout();
        addToast({
            type: "info",
            title: "Logged Out",
            message: "You have been logged out successfully.",
            duration: 3000,
        })
        router.push("/admin/login")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">

                {/* Loading shimmer */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 animate-pulse"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="w-24 h-10 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                        <div className="container mx-auto px-4 py-8">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                                            <p className="text-slate-600">Manage contact form submissions</p>
                                        </div>
                                    </div>

                                    {/* User Menu */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium">{userData.email}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-xl">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                                                <p className="text-sm text-slate-600">Total Messages</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-100 rounded-xl">
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{ureadMessages}</p>
                                                <p className="text-sm text-slate-600">Unread</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-xl">
                                                <Eye className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{isReadMessages}</p>
                                                <p className="text-sm text-slate-600">Read</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-xl">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-slate-900">{stats.replied}</p>
                                                <p className="text-sm text-slate-600">Replied</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Input
                                                placeholder="Search messages..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={statusFilter === "all" ? "default" : "outline"}
                                            onClick={() => handleFilterClick("all")}
                                            className="rounded-xl"
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={statusFilter === 0 ? "default" : "outline"}
                                            onClick={() => handleFilterClick(0)}
                                            className="rounded-xl"
                                        >
                                            Unread
                                        </Button>
                                        <Button
                                            variant={statusFilter === 1 ? "default" : "outline"}
                                            onClick={() => handleFilterClick(1)}
                                            className="rounded-xl"
                                        >
                                            Read
                                        </Button>
                                        <Button
                                            variant={statusFilter === 2 ? "default" : "outline"}
                                            onClick={() => handleFilterClick(2)}
                                            className="rounded-xl"
                                        >
                                            Replied
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="space-y-4">
                                {filteredMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {message.first_name} {message.last_name}
                                                    </h3>
                                                    <Badge className={`${getStatusColor(
                                                        message.status === 0
                                                            ? "unread"
                                                            : message.status === 1
                                                                ? "read"
                                                                : message.status === 2
                                                                    ? "replied"
                                                                    : ""
                                                    )} border`}>
                                                        <div className="flex items-center gap-1">
                                                            {getStatusIcon(
                                                                message.status === 0
                                                                    ? "unread"
                                                                    : message.status === 1
                                                                        ? "read"
                                                                        : message.status === 2
                                                                            ? "replied"
                                                                            : ""
                                                            )}
                                                            <span className="capitalize">
                                                                {message.status === 0
                                                                    ? "unread"
                                                                    : message.status === 1
                                                                        ? "read"
                                                                        : message.status === 2
                                                                            ? "replied"
                                                                            : ""}
                                                            </span>
                                                        </div>
                                                    </Badge>
                                                </div>

                                                <p className="text-slate-600 mb-1">{message.email}</p>
                                                <p className="font-medium text-slate-800 mb-2">{message.subject}</p>
                                                <p className="text-slate-600 line-clamp-2">{message.message}</p>

                                                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(message.created_at)}</span>
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                <Link href={`/admin/message/${message.id}`}>
                                                    <Button className="rounded-xl">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredMessages.length === 0 && (
                                <div className="text-center py-12">
                                    <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">No messages found</h3>
                                    <p className="text-slate-500">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}
