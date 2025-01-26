import React from 'react'
import { useAppStore } from '../../store'
import { Avatar, AvatarImage } from '../ui/avatar';
import { HOST } from '../../utils/constants';
import { getColor } from '../../lib/utils';

const ContactList = ({ contacts, isChannel = false }) => {
    const { selectedChatData, setSelectedChatData, selectedChatType, setSelectedChatType, setSelectedChatMessage } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);

        if (selectedChatData && selectedChatData._id !== contacts._id) {
            setSelectedChatMessage([]);
        }
    }
    console.log("contacts array is :", contacts)


    return (
        <div className='mt-5'>
            {
                contacts.map((contact) => (
                    <div key={contact._id} onClick={() => handleClick(contact)}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"} `}
                    >
                        <div className='flex gap-5 items-center text-neutral-300'>
                            {
                                !isChannel &&
                                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                    {contact.image ? (
                                        <AvatarImage
                                            src={`${HOST}/${contact.image}`} alt="Profile" className="object-cover w-full h-full bg-black" />
                                    ) : (
                                        <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${selectedChatData && selectedChatData._id === contact._id ? "bg-[ffffff22] border border-white/70" : getColor(contact.color)} `}>
                                            {
                                                contact.firstName ?
                                                    contact.firstName.split("").shift()
                                                    : contact.email.split("").shift()
                                            }
                                        </div>
                                    )}
                                </Avatar>
                            }

                            {
                                isChannel && (
                                    <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
                                        #
                                    </div>
                                )
                            }

                            {
                                isChannel ? (
                                    <span>{contact.name}</span>
                                ) : (
                                    <span>{`${contact.firstName} ${contact.lastName}`}</span>
                                )

                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList