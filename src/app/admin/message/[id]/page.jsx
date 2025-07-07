import { MessageDetail } from "@/components/message-detail"

export const metadata = {
    title: "Message Detail - Admin Dashboard",
    description: "View and reply to contact message",
}

export default async function MessageDetailPage({ params }) {
    let param = await params;
    return <MessageDetail messageId={param.id} />
}
