import { ChatLayout } from '../components/chat/ChatLayout';
import PageTransition from '../components/common/PageTransition';

export default function Chat() {
    return (
        <PageTransition className="h-full w-full">
            <ChatLayout />
        </PageTransition>
    );
}
