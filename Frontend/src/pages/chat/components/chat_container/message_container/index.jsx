import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../../../../store';
import moment from "moment";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE, HOST } from '../../../../../utils/constants';
import apiClient from "../../../../../lib/client_api";
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5"
import { Avatar, AvatarImage } from '../../../../../components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { getColor } from '../../../../../lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const MessageContainer = () => {
    const scrollRef = useRef();
    const [showImage, setShowImage] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const { selectedChatType, selectedChatData, userInfo, selectedChatMessage, setSelectedChatMessage, setIsDownloading, setFileDownloadProgress } = useAppStore();

    // Fetching the messages of the conversation of channel or direct message
    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post(`${GET_ALL_MESSAGES_ROUTE}?page=${page}&limit=${15}`, { id: selectedChatData._id }, { withCredentials: true });
                // console.log("response is:", response);

                if (response.data.messages) {
                    setSelectedChatMessage((prevChat) => [...response.data.messages, ...prevChat]);
                    setHasMore(response.data.hasMore); 
                }
            } catch (error) {
                // console.log(error);
                toast.error(error.response?.data || "Error in message fetching!")
            }
        };

        const getChannelMessages = async () => {
            try {
                const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`, { withCredentials: true });
                // console.log("Channel messages:", response);

                if (response.data.messages) {
                    setSelectedChatMessage(response.data.messages);
                }
            } catch (error) {
                // console.log(error);
                toast.error(error.response?.data || "Error in message fetching!")
            }
        }

        if (selectedChatData._id) {
            if (selectedChatType === "contact") {
                getMessages();
            } else if (selectedChatType === "channel") {
                getChannelMessages();
            }
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessage, page])

    // For Reach at the bottom (last message) of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessage]);

    const renderMessages = () => {
        let lastDate = null;
        // console.log(selectedChatMessage);

        return selectedChatMessage?.map((message, index) => {
            const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate; // Show date once for all message of day on the top where the message of this day start
            lastDate = messageDate;

            return (
                <div key={index}>
                    {
                        showDate && (
                            <div className='text-center text-gray-500 my-2'>
                                {moment(message.createdAt).format("LL")}
                            </div>
                        )
                    }

                    {
                        selectedChatType === "contact" && renderDmMessages(message)
                    }
                    {
                        selectedChatType === "channel" && renderChannelMessages(message)
                    }
                </div>
            )
        })
    };

    const renderDmMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
            {/* Show text message */}
            {
                message.messageType === "text" && (
                    <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )
            }
            {/* Show file message*/}
            {
                message.messageType === "file" && (
                    <div className={`${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {
                            checkIfImage(message.fileUrl) ?
                                <div onClick={() => {
                                    setShowImage(true);
                                    setImageUrl(message.fileUrl)
                                }}
                                    className='cursor-pointer '>
                                    <img src={message.fileUrl} height={300} width={300} />
                                </div>
                                :
                                <div className='flex items-center justify-center gap-4'>
                                    {/* ZIP icon */}
                                    <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                                        <MdFolderZip />
                                    </span>
                                    {/* Show the name from last like -> abc-12345-file.zip to file.zip*/}
                                    <span className='truncate max-w-[50%]'>{message.fileUrl.split("/").pop()}</span>
                                    {/* Download ZIP file */}
                                    <span onClick={() => downloadFile(message.fileUrl)}
                                        className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>
                        }
                    </div>
                )
            }
            {/* Show timestamp of message */}
            <div className='text-xs text-gray-600'>
                {
                    moment(message.createdAt).format("LT")
                }
            </div>
        </div>
    )

    const renderChannelMessages = (message) => {
        return <div className={`mt-5 ${message.sender._id === userInfo.id ? "text-right" : "text-left"}`}>
            {/* Show the text */}
            {
                message.messageType === "text" && (
                    <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}>
                        {message.content}
                    </div>
                )
            }
            {/* Show the file */}
            {
                message.messageType === "file" && (
                    <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
                        {
                            checkIfImage(message.fileUrl) ?
                                <div onClick={() => {
                                    setShowImage(true);
                                    setImageUrl(message.fileUrl)
                                }}
                                    className='cursor-pointer '>
                                    {
                                        message?.status ?
                                            <div className='flex gap-4'>
                                                <Loader2 className='animate-spin' />
                                                <img src={message.fileUrl} height={300} width={300} />
                                            </div>
                                            :
                                            <img src={message.fileUrl} height={300} width={300} />
                                    }
                                    {/* <img src={message.fileUrl} height={300} width={300} /> */}
                                </div>
                                :
                                <div className='flex items-center justify-center gap-4'>
                                    <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                                        <MdFolderZip />
                                    </span>
                                    <span>{message.fileUrl.split("-").pop()}</span>
                                    <span onClick={() => downloadFile(message.fileUrl)}
                                        className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
                                        <IoMdArrowRoundDown />
                                    </span>
                                </div>
                        }
                    </div>
                )
            }
            {/* Show avatar and name of other users in channel chat  */}
            {
                message.sender._id !== userInfo.id ?
                    <div className='flex items-center justify-start gap-3'>
                        <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                            {
                                message.sender.image && (
                                    <AvatarImage
                                        src={`${HOST}/${message.sender.image}`} alt="Profile" className="object-cover w-full h-full bg-black" />
                                )
                            }
                            {
                                <AvatarFallback className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>
                                    {
                                        message.sender.firstName ?
                                            message.sender.firstName.split("").shift()
                                            : message.sender.email.split("").shift()
                                    }
                                </AvatarFallback>
                            }
                        </Avatar>
                        <span className='text-sm text-white/60 '>{`${message.sender.firstName}${message.sender.lastName}`}</span>
                        <span className='text-sm text-white/60'>{moment(message.createdAt).format("LT")}</span>
                    </div> : <div className='text-sm text-white/60 mt-1'>
                        {moment(message.createdAt).format("LT")}
                    </div>
            }
        </div>
    }

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    }

    const downloadFile = async (fileUrl) => {
        toast.success("Downloading . . .")
        setShowImage(false);
        // setIsDownloading(true);
        // setFileDownloadProgress(0);
        const response = await apiClient.get(fileUrl, {
            responseType: "blob",
            // onDownloadProgress: (progressEvent) => {
            //     const { loaded, total } = progressEvent;
            //     const percentCompleted = Math.round((loaded * 100) / total);
            //     setFileDownloadProgress(percentCompleted);
            // }
        });
        const blob = new Blob([response.data]);
        const urlBlob = window.URL.createObjectURL(blob);

        // Get file name from fileUrl
        const filename = fileUrl.split("-").pop();

        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(urlBlob);
        toast.success("Download Complete");
        // setIsDownloading(false);
        // setFileDownloadProgress(0);
    }

    return (
        <div className='scrollbar-hidden flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl-[80vw] w-full'>
            {hasMore && (
                <div className='w-full flex justify-center mb-5'>
                    <button onClick={() => setPage((prevPage) => prevPage + 1)} className='bg-[#2a2b33]/5 hover:bg-[#2a2b33] text-white/80 border-[#ffffff]/20 border p-2 rounded text-sm'>Load Previous</button>
                </div>
            )}
            {renderMessages()}
            {
                showImage && <div className='fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col'>
                    <div>
                        <img src={imageUrl} alt="Preview image" className='h-[80vh] mt-10 w-full bg-cover' />
                    </div>
                    <div className='flex gap-5 fixed top-0 mt-4'>
                        <button onClick={() => downloadFile(imageUrl)}
                            className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                        >
                            <IoMdArrowRoundDown />
                        </button>
                        <button onClick={() => {
                            setShowImage(false);
                            setImageUrl(null);
                        }}
                            className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                        >
                            <IoCloseSharp />
                        </button>
                    </div>
                </div>
            }
            <div ref={scrollRef}></div>
        </div>
    )
}

export default MessageContainer