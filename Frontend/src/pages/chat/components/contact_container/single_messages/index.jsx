import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "../../../../../components/ui/input"
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from '../../../../../lib/utils';
import apiClient from "../../../../../lib/client_api"
import { SEARCH_CONTACT_ROUTES } from "../../../../../utils/constants"
import { ScrollArea } from "../../../../../components/ui/scroll-area"
import { } from "../../../../../components/ui/avatar"
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { useAppStore } from '../../../../../store'
import { toast } from 'sonner'

const SingleMessages = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
    const [searchContacts, setSearchContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            searchContactInput(searchTerm);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler); // clear the timeout if the user types again within delay
        };
    }, [searchTerm]);

    const searchContactInput = async (searchTerm) => {
        try {
            let trimValue = searchTerm.trim();
            if (trimValue.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACT_ROUTES, { searchTerm: trimValue }, { withCredentials: true })
                // console.log(response);

                if (response.status === 200 && response.data.contacts) {
                    setSearchContacts(response.data.contacts);
                }
            } else {
                setSearchContacts([]);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data || "Search Failed!");
        }
    };

    const selectedContact = (contact) => {
        setSelectedChatData(contact);
        setSelectedChatType("contact");
        setOpenNewContactMenu(false);
        // empty the array of search contacts
        setSearchContacts([]);
    };

    return (
        <>
            {/* tooltip + icon for open dialog */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus onClick={() => setOpenNewContactMenu(true)}
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        <p>Select New Contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* dialog box */}
            <Dialog open={openNewContactMenu} onOpenChange={setOpenNewContactMenu}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[450px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Select a Contact to Chat</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-lg p-6 border-none bg-[#2c2e3b]" />
                    </div>
                    {/* scrollarea or the search contact div will show when it contain some result only */}
                    {
                        searchContacts.length > 0 && (
                            <ScrollArea className="h-[250px] ">
                                <div className='flex flex-col gap-5'>
                                    {
                                        searchContacts.map((contact) => <div onClick={() => selectedContact(contact)} key={contact._id} className='flex items-center cursor-pointer gap-3'>
                                            {/* display the search contact's profile */}
                                            <div className="w-12 h-12 relative">
                                                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                    {contact.image ? (
                                                        <AvatarImage
                                                            src={contact.image} alt="Profile" className="object-cover w-full h-full bg-black rounded-full" />
                                                    ) : (
                                                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                            {
                                                                contact.firstName ?
                                                                    contact.firstName.split("").shift()
                                                                    : contact.email.split("").shift()
                                                            }
                                                        </div>
                                                    )}
                                                </Avatar>
                                            </div>
                                            {/* display the search contacts name and email */}
                                            <div className='flex flex-col'>
                                                <span className='truncate max-w-[280px]'>
                                                    {
                                                        contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                    }
                                                </span>
                                                <span className='text-xs truncate'>{contact.email}</span>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </ScrollArea>
                        )
                    }
                    {/* this default div is shown until the scrolarea is shown  */}
                    {
                        searchContacts.length <= 0 ?
                            <div className='flex-1 md:flex flex-col justify-center items-center mt-10 md:mt-0 transition-all duration-1000'>
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                    <h2 className='poppins-medium'>
                                        Hi<span className='text-purple-500'>! </span>
                                        Search new<span className='text-purple-500 italic'> Contact. </span>
                                    </h2>
                                </div>
                            </div>
                            : <div></div>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SingleMessages