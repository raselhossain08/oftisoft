
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import LiveChatPopup from "@/components/live-chat-popup";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <LiveChatPopup />
        </>
    );
}
