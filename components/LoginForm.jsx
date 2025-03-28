import { LoginUser } from "@/app/actions"
import { useAuth } from "@/context/AuthContext"
import { LoginSchema } from "@/utils/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { MailIcon } from "lucide-react"
import { Button} from "./ui/button"
import { Input } from "./ui/input"
import { PasswordInput } from "./ui/password-input"
import { auth } from "@/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"

const LoginForm = () => {

    const {login} = useAuth() 
    const [loading, setLoading] = useState(false)
    

    const LoginForm = useForm({
      resolver: zodResolver(LoginSchema),
      defaultValues:{
        email: '',
        password: '',
      }
    })
  
    
    async function handleLogin(values){
  
    const result = await LoginUser(values)
  
    if(result.status === "error"){
         toast.error(result.message)
         return
    }
      
      try{
      await login(values.email, values.password)
      toast.success(result.message)
    }catch(e){
      toast.error('Invalid email or password')
    }
    }

    const handleGoogleSignIn = async () => {
      try{
        setLoading(true)
        const provider = new GoogleAuthProvider()
  
         await signInWithPopup(auth,provider);
  
        toast.success('Login Successful')
      }catch(e){
        toast.error('You need to complete the authentication process to continue. Please try again')
      }finally{
        setLoading(false)
      }
    }
  
  return (
    <Form {...LoginForm}>
        <form className="flex flex-col gap-4 w-full" onSubmit={LoginForm.handleSubmit(handleLogin)}>
            <FormField control={LoginForm.control} name="email" render={({field})=>(
            <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                <Input placeholder="Enter your email" suffix={<MailIcon/>} {...field} />
                </FormControl>
                <FormMessage/>
            </FormItem>
            )} />

            <FormField control={LoginForm.control} name="password" render={({field})=>(
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage/>
            </FormItem>
            )} />
        <Button disabled={loading} type="submit">Submit</Button>
        <Button type="button" disabled={loading} onClick={handleGoogleSignIn} variant="secondary" className={`w-full cursor-pointer`}>
            Sign in with Google
            <i className="fa-brands fa-google text-xl"></i>
        </Button>
        </form>
    </Form>
)
}

export default LoginForm