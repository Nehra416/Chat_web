import React from 'react'
import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from '../../../../../store';
import { Avatar, AvatarImage } from '../../../../../components/ui/avatar';
import { getColor } from '../../../../../lib/utils';

const MessageHeader = () => {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    // console.log("setSelectedChatData", selectedChatData);

    return (
        <div className='h-[10vh] border-b-2 border-[#2f303f] flex items-center justify-between md:px-20 px-5'>
            <div className='flex gap-5 items-center w-full justify-between'>
                <div className='flex gap-3 items-center justify-center'>
                    <div className="w-12 h-12 relative">
                        {
                            selectedChatType === "contact" ?
                                <Avatar className="md:h-12 h-10 md:w-12 w-10 rounded-full overflow-hidden">
                                    {selectedChatData.image ? (
                                        <AvatarImage
                                            src={selectedChatData.image} alt="Profile" className="object-cover w-full h-full rounded-full bg-black" />
                                    ) : (
                                        <div className={`uppercase md:h-12 h-10 md:w-12 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                                            {
                                                selectedChatData.firstName ?
                                                    selectedChatData.firstName.split("").shift()
                                                    : selectedChatData.email.split("").shift()
                                            }
                                        </div>
                                    )}
                                </Avatar> :
                                <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
                                    #
                                </div>
                        }

                    </div>
                    <div className='flex flex-col'>
                        {
                            selectedChatType === "channel" && selectedChatData.name
                        }
                        {
                            selectedChatType === "contact" && selectedChatData.firstName && selectedChatData.lastName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email
                        }
                        {/* <span className='text-xs'>{selectedChatData.email}</span> */}
                    </div>
                </div>

                <div className='flex items-center justify-center gap-5'>
                    {/* cross with a effect */}
                    <button onClick={closeChat}
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-200 transition-all'>
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageHeader