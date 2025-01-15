import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store"
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors, getColor } from "../../lib/utils";
import { FaTrash, FaPlus } from 'react-icons/fa'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { toast } from "sonner"
import apiClient from '../../lib/client_api'
import { ADD_PROFILE_IMAGE, DELETE_PROFILE_IMAGE, HOST, UPDATE_PROFILE_DATA } from '../../utils/constants'

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hoverd, setHoverd] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const inputFileRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup === true) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateData = () => {
    if (!firstName) {
      toast.error("Firstname is required")
      return false;
    } else if (!lastName) {
      toast.error("Lastname is required")
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateData()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE_DATA, { firstName, lastName, color: selectedColor }, { withCredentials: true });
        console.log(response);

        if (response.status === 200 && response.data.user) {
          setUserInfo(response.data.user);
          toast.success("Profile Updated Successfully!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goBackFunction = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile first");
    }
  };

  const handleFileInputClick = () => {
    inputFileRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, { withCredentials: true });
      console.log(response);

      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image })
        toast.success("Profile image is Updated!");
      }

      // const reader = new FileReader();
      // reader.onload = () => {
      //   console.log(reader.result);
      //   setImage(reader.result);
      // }
      // reader.readAsDataURL(file);

    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE, { withCredentials: true })
      console.log(response);

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Profile image is Removed!");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack onClick={goBackFunction} className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHoverd(true)}
            onMouseLeave={() => setHoverd(false)}
          // onClick={() => handleFileInputClick()}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image} alt="Profile" className="object-cover w-full h-full bg-black" />
              ) : (
                <div className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                  {
                    firstName ? firstName.split("").shift()
                      : userInfo.email.split("").shift()
                  }
                </div>
              )}
            </Avatar>

            {
              hoverd && (
                <div className="absolute inset-0 inset-y-14 md:inset-y-6 flex items-center justify-center bg-black/50 rounded-full"
                  onClick={image ? handleDeleteImage : handleFileInputClick}>
                  {image ?
                    <FaTrash className="text-white cursor-pointer text-3xl" />
                    : <FaPlus className="text-white cursor-pointer text-3xl" />}
                </div>
              )
            }
            {/* for the change of profile */}
            <input type="file" ref={inputFileRef} className="hidden" onChange={handleImageChange} name="profileImage" accept=".png, .jpg, .jpeg, .svg" />
          </div>
          <div className="flex flex-col gap-5 text-white items-center justify-center min-w-32 md:min-w-64 ">
            <div className="w-full">
              <Input placeholder="Email" type="email" value={userInfo.email} disabled className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            <div className="w-full">
              <Input placeholder="First Name" type="text" value={firstName} name="firstName"
                onChange={(e) => setFirstName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            <div className="w-full">
              <Input placeholder="Last Name" type="text" value={lastName} name="lastName"
                onChange={(e) => setLastName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            {/* for color selection */}
            <div className="w-full flex gap-5">
              {
                colors.map((color, index) => (
                  <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-200 ${selectedColor === index ? "outline outline-white/70 outline-2" : ""}`}
                    key={index} onClick={() => setSelectedColor(index)}>

                  </div>))
              }
            </div>
          </div>
        </div>
        {/* save changes button */}
        <div>
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile