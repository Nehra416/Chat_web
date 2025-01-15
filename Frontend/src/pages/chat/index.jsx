import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store"
import { useEffect } from "react";
import { toast } from "sonner";
import ContactContainer from "./components/contact_container";
import EmptyChatContainer from "./components/empty_chat_container";
import ChatContainer from "./components/chat_container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup profile to continue")
      navigate("/profile");
    }
  }, [userInfo, navigate])

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  )
}

export default Chat