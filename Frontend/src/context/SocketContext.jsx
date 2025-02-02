import { createContext, useContext, useRef, useEffect } from "react";
import { useAppStore } from "../store/index.js";
import { HOST } from "../utils/constants.js";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo.id
                }
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            })

            const handleRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDmContacts } = useAppStore.getState();

                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    // console.log("message rec:", message);
                    addMessage(message);
                }
                addContactsInDmContacts(message);
            }

            const handleChannelRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    // console.log("message rec:", message);
                    addMessage(message);
                }
                addChannelInChannelList(message);
            }

            socket.current.on("recieveMessage", handleRecieveMessage);
            socket.current.on("recieve_channel_message", handleChannelRecieveMessage);

            return () => {
                socket.current.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider >
    )
}