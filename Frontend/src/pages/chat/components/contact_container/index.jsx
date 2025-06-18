import React, { useEffect } from 'react'
import ProfileInfo from './profile_info'
import SingleMessages from './single_messages'
import apiClient from '../../../../lib/client_api'
import { GET_CONTACT_FOR_DM_ROUTES, GET_USER_CHANNEL_ROUTE } from '../../../../utils/constants'
import { useAppStore } from '../../../../store'
import ContactList from '../../../../components/show contact list/ContactList'
import CreateChannel from './create_channel'
import { toast } from 'sonner'

const ContactContainer = () => {
  const { setDirectMessageContacts, directMessageContacts, channels, setChannels } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_CONTACT_FOR_DM_ROUTES, { withCredentials: true });
        // console.log("response of contact :", response);

        if (response.data.contacts) {
          setDirectMessageContacts(response.data.contacts);
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }

    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, { withCredentials: true });
        // console.log("response of contact :", response);

        if (response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }

    getChannels();
    getContacts();
  }, [setChannels, setDirectMessageContacts])

  return (
    <div className='relative w-[100vw] md:w-[35vw] lg:w-[30vw] xl-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]'>
      <div className='pt-3'>
        {Logo()}
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-5'>
          <h5 className='uppercase tracking-widest text-neutral-400 pl-5 font-light text-opacity-90 text-sm'>
            Direct Message</h5>
          <SingleMessages />
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-5'>
          <h5 className='uppercase tracking-widest text-neutral-400 pl-5 font-light text-opacity-90 text-sm'>
            Channels</h5>
          <CreateChannel />
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer

// Logo for our app
const Logo = () => {
  return (
    <div className='flex p-5 justify-start items-center gap-2'>
      <svg id='logo-38' width={78} height={32} viewBox='0 0 78 32' fill='none' xmlns='http://www.w3.org.2000/svg'>
        {" "}
        <path d='M55.5 0H77.5L58.5 32H36.5L55.5 0Z' className='ccustom' fill='#8338ec'></path>
        {" "}
        <path d='M35.5 0H51.5L32.5 32H16.5L35.5 0Z' className='ccompli1' fill='#975aed'></path>
        {" "}
        <path d='M19.5 0H31.5L12.5 32H0.5L19.5 0Z' className='ccompli2' fill='#a16ee8'></path>
        {" "}
      </svg>
      <span className='text-3xl font-semibold italic'>QuickTalk</span>
    </div>
  )
}