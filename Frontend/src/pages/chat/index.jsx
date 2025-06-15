import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store"
import { useEffect } from "react";
import { toast } from "sonner";
import ContactContainer from "./components/contact_container";
import EmptyChatContainer from "./components/empty_chat_container";
import ChatContainer from "./components/chat_container";

const Chat = () => {
  const { userInfo, selectedChatType, isUploading, isDownloading, fileUploadProgress, fileDownloadProgress } = useAppStore();
  const navigate = useNavigate();

  // Protect from the user who created the account and login but without creating profile try to go to chat page by url
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup profile to continue")
      navigate("/profile");
    }
  }, [userInfo, navigate])

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h4 className="text-5xl animate-pulse">Uploading File</h4>
          {fileUploadProgress}%
        </div>
      }
      {/* disable the downloading progress div because it disturb the user from using the application*/}
      {/* {
        isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h4 className="text-5xl animate-pulse">Downloading File</h4>
          {fileDownloadProgress}%
        </div>
      } */}
      <ContactContainer />
      {
        selectedChatType === undefined ?
          <EmptyChatContainer />
          : <ChatContainer />
      }
    </div>
  )
}

export default Chat