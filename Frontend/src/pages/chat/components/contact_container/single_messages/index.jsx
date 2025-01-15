import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FaPlus } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "../../../../../components/ui/input"
import Lottie from "react-lottie";
import { animationDefaultOptions } from '../../../../../lib/utils';

const SingleMessages = () => {
    const [openNewContactMenu, setOpenNewContactMenu] = useState(false);
    const [searchContacts, setSearchContacts] = useState([]);

    const searchContactInput = async (value) => {

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
                        <DialogTitle className="text-center">Please select a Contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" onChange={(e) => searchContactInput(e.target.value)}
                            className="rounded-lg p-6 border-none bg-[#2c2e3b]" />
                    </div>
                    {
                        searchContacts.length <= 0 ?
                            <div className='flex-1 md:flex flex-col justify-center items-center mt-5 md:mt-0 transition-all duration-1000'>
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