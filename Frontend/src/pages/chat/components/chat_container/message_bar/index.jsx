import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from "react-icons/io5"
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '../../../../../store';
import { useSocket } from '../../../../../context/SocketContext';
import apiClient from '../../../../../lib/client_api';
import { UPLOAD_FILE_ROUTE } from '../../../../../utils/constants';

const MessageBar = () => {
    const [message, setMessage] = useState("");
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const emojiRef = useRef();
    const inputFileRef = useRef();
    const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore();
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
        } else if (selectedChatType === "channel") {
            socket.emit("send_channel_message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }
        setMessage("");
    };

    const handleAttachmentClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        try {
            const file = event.target.files[0];
            console.log(file);

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true,
                    onUploadProgress: (data) => {
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
                    }
                });
                console.log(response);

                if (response.status === 200 && response.data) {
                    setIsUploading(false);
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath
                        });
                    } else if (selectedChatType === "channel") {
                        socket.emit("send_channel_message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id
                        })
                    }
                }
            }
        } catch (error) {
            setIsUploading(false);
            console.log(error);
        }
    }

    return (
        <div className='h-[10vh] bg-[#c1c1d25] flex justify-center items-center px-8 mb-6 gap-5'>
            <div className='flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
                <input type="text" placeholder='Enter Message' value={message} onChange={(e) => setMessage(e.target.value)}
                    className='flex-1 p-4 bg-transparent rounded-md focus:border-none focus:outline-none' />
                <button onClick={() => handleAttachmentClick()}
                    className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-200 transition-all'>
                    <GrAttachment className='text-2xl' />
                </button>
                <input type="file" className='hidden' ref={inputFileRef} onChange={handleFileChange} />
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