import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "../../../../../components/ui/input"
import apiClient from "../../../../../lib/client_api"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, SEARCH_CONTACT_ROUTES } from "../../../../../utils/constants"
import { useAppStore } from '../../../../../store'
import { Button } from "@/components/ui/button"
import MultipleSelector from '../../../../../components/ui/multipleselect'
import { toast } from 'sonner'

const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
    const [openNewChannelMenu, setOpenNewChannelMenu] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true })
                // console.log(response);
                setAllContacts(response.data.contacts);
            } catch (error) {
                toast.error(error.response?.data || "Error in getting Channels")
            }
        }
        getData();
    }, []);

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContact.length > 0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value)
                }, { withCredentials: true });

                if (response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setOpenNewChannelMenu(false);
                    addChannel(response.data.channel);
                }
            } else if (channelName.length == 0) {
                toast.error("Channel name is Required!")
            } else {
                toast.error("Select atleast one contact!")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data || "Error in create Channel!")
        }
    }

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
                        <FaPlus onClick={() => setOpenNewChannelMenu(true)}
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        <p>Create New Channel</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* dialog box */}
            <Dialog open={openNewChannelMenu} onOpenChange={setOpenNewChannelMenu}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[450px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Create new channel</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name" value={channelName} onChange={(e) => setChannelName(e.target.value)}
                            className="rounded-lg p-6 border-none bg-[#2c2e3b]" />
                    </div>
                    <div>
                        <MultipleSelector defaultOptions={allContacts} placeholder="Search Contacts" value={selectedContacts} onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 ">
                                    No results found !!
                                </p>}
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white">

                        </MultipleSelector>
                    </div>
                    <div>
                        <Button onClick={() => createChannel()}
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                        >
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel