import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from '../../../../../lib/utils'
import { useAppStore } from "../../../../../store";
import { HOST, LOGOUT_ROUTE } from "../../../../../utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5"
import client_api from "../../../../../lib/client_api"
import { toast } from "sonner"

const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const Logout = async () => {
        try {
            const response = await client_api.get(LOGOUT_ROUTE, { withCredentials: true });
            // console.log(response);

            if (response.status === 200) {
                setUserInfo(null);
                toast.success("Logout Successfully!");
                navigate("/auth");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data);
        }
    };

    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]'>
            <div className='flex gap-3 items-center justify-center'>
                <div className="w-12 h-12 relative">
                    {/* Profile */}
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={userInfo.image} alt="Profile" className="object-cover w-full h-full bg-black" />
                        ) : (
                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {
                                    userInfo.firstName ?
                                        userInfo.firstName.split("").shift()
                                        : userInfo.email.split("").shift()
                                }
                            </div>
                        )}
                    </Avatar>
                </div>
                {/* Name of User */}
                <div className="truncate max-w-[160px]">
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                {/* Edit Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 onClick={() => navigate("/profile")}
                                className="text-purple-500 text-xl font-medium" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Edit Profile!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* LogOut Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp onClick={() => Logout()}
                                className="text-red-500 text-xl font-medium" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Logout!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo