import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from "react-icons/io5"
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '../../../../../store';
import { useSocket } from '../../../../../context/SocketContext';

const MessageBar = () => {
    const [message, setMessage] = useState("");
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const emojiRef = useRef();
    const { selectedChatType, selectedChatData, userInfo } = useAppStore();
    const socket = useSocket();

    // *****
    // when we click outside the EmojiPicker then it will close EmojiPicker
    useEffect(() => {
        function handleClickOutside(evnet) {
            // Check is the click was outside the EmojiPicker container
            if (emojiRef.current && !emojiRef.current.contains(evnet.target)) {
                setOpenEmojiPicker(false);
            }
        };

        // Add the event listener for the click
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function for removing the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [emojiRef])


    // this will add Emoji to the exisisting text 
    const handleAddEmoji = (e) => {
        // console.log("emoji is ", e);
        // setMessage(((msj) => msj + e.emoji)); // alternative
        setMessage(message + e.emoji);
    };

    const sendMessage = async () => {
        if (selectedChatType === "contact") {
            // console.log("socket is :",socket)
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            });
            setMessage("");
        }
    };

    return (
        <div className='h-[10vh] bg-[#c1c1d25] flex justify-center items-center px-8 mb-6 gap-5'>
            <div className='flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
                <input type="text" placeholder='Enter Message' value={message} onChange={(e) => setMessage(e.target.value)}
                    className='flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none' />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-200 transition-all'>
                    <GrAttachment className='text-2xl' />
                </button>
                <div className="relative">
                    <button onClick={() => setOpenEmojiPicker(true)}
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-200 transition-all'>
                        <RiEmojiStickerLine className='text-2xl' />
                    </button>
                    <div className='absolute bottom-16 right-0' ref={emojiRef}>
                        <EmojiPicker
                            open={openEmojiPicker} onEmojiClick={(e) => handleAddEmoji(e)}
                            // onEmojiClick={handleAddEmoji}
                            theme='dark' autoFocusSearch={false}
                        />
                    </div>
                </div>
            </div>

            <button onClick={sendMessage}
                className=' bg-[#8417ff] rounded-md flex items-center justify-center py-4 px-5 hover:bg-[#741bda] focus:border-none focus:text-white focus:outline-none duration-200 transition-all'>
                <IoSend className='text-2xl' />
            </button>
        </div>
    )
}

export default MessageBar