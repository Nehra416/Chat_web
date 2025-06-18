import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import apiClient from '../../lib/client_api'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants'
import { useNavigate } from "react-router-dom";
import { useAppStore } from '../../store'
import { Loader2 } from 'lucide-react'

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirm_password: ""
  });

  const validateSignup = () => {
    if (!signupData.email.length) {
      toast.error("Email is required")
      return false;
    }
    if (!signupData.password.length) {
      toast.error("Password is required")
      return false;
    }
    if (signupData.password.length < 8) {
      toast.error("Atleast 8 Digit password is required")
      return false;
    }
    if (signupData.password !== signupData.confirm_password) {
      toast.error("Password and Confirm password is not same");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!loginData.email.length) {
      toast.error("Email is required")
      return false;
    }
    if (!loginData.password.length) {
      toast.error("Password is required")
      return false;
    }
    if (loginData.password.length < 8) {
      toast.error("Atleast 8 Digit password is required")
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setLoader(true);
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email: loginData.email, password: loginData.password }, { withCredentials: true });
        // console.log(response); 
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat")
          else navigate("/profile");
        }
      } catch (error) {
        toast.error(error.response.data);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      setLoader(true);
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email: signupData.email, password: signupData.password }, { withCredentials: true });
        // console.log(response);
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        toast.error(error.response.data);
      } finally {
        setLoader(false);
      }
    }
  };


  return (
    <div className='h-[100vh] w-[100vw] flex justify-center items-center '>
      <div className='md:h-[70vh] md:w-[60vw] p-5 border border-gray-200 rounded-xl shadow-xl flex flex-col items-center justify-center '>
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-3xl font-medium'>Welcome</h1>
          <p className='text-sm font-medium'>Fill the details to get started the <span className='font-bold'>QuickTalk</span></p>
        </div>
        <div>
          {/* login or signup form */}
          <Tabs defaultValue="login" className="md:w-[400px]">
            <TabsList className="w-full  my-3">
              <TabsTrigger value="login" className="w-[50%]">Login</TabsTrigger>
              <TabsTrigger value="signup" className="w-[50%]">SignUp</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              {/* <p>Login in your Account</p> */}
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 font-medium">
                <Input type="email" name="email" required placeholder="Email" value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, [e.target.name]: e.target.value })} />
                <Input type="password" name="password" required placeholder="Password" value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, [e.target.name]: e.target.value })} />
                {
                  loader ?
                    <Button className="w-full"><Loader2 className='animate-spin text-center' /></Button>
                    :
                    <Button className="w-full" onClick={handleLogin}>Login</Button>
                }
              </form>
            </TabsContent>
            <TabsContent value="signup">
              {/* <p>Create a new Account</p> */}
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 font-medium" >
                <Input type="email" name="email" required placeholder="Email" value={signupData.email}
                  onChange={e => setSignupData({ ...signupData, [e.target.name]: e.target.value })} />
                <Input type="password" name="password" required placeholder="Password" value={signupData.password}
                  onChange={e => setSignupData({ ...signupData, [e.target.name]: e.target.value })} />
                <Input type="password" name="confirm_password" required placeholder="Confirm Password" value={signupData.confirm_password}
                  onChange={e => setSignupData({ ...signupData, [e.target.name]: e.target.value })} />
                {
                  loader ?
                    <Button className="w-full"><Loader2 className='animate-spin text-center' /></Button>
                    :
                    <Button className="w-full" onClick={handleSignup}>Signup</Button>
                }
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Auth