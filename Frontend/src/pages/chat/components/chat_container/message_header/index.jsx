import React from 'react'
import { RiCloseFill } from "react-icons/ri";

const MessageHeader = () => {
    return (
        <div className='h-[10vh] border-b-2 border-[#2f303f] flex items-center justify-between px-20'>
            <div className='flex gap-5 items-center'>
                <div className='flex gap-3 items-center justify-center'>
                    {/* empty for now */}
                </div>
                <div className='flex items-center justify-center gap-5'>
                    {/* cross with a effect */}
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-200 transition-all'>
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageHeader