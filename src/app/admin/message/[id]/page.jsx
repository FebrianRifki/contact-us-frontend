import { MessageDetail } from "@/components/message-detail"

export const metadata = {
    title: "Message Detail - Admin Dashboard",
    description: "View and reply to contact message",
}

export default function MessageDetailPage({ params }) {
    return <MessageDetail messageId={params.id} />
}
