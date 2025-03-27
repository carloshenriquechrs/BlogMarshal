import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button, buttonVariants } from './ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '@/utils/zodSchemas'
import { SignUpUser } from '@/app/actions'
import { toast } from 'sonner'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Link2, MailIcon, UserIcon } from 'lucide-react'
import { PasswordInput } from './ui/password-input'


const SignupForm = () => {

  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

    const SignUpForm = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues:{
      name: '',
      email: '',
      password: '',
      imageUrl: '',
    }
})

async function handleSignUp(values){

    const result = await SignUpUser(values)

    if(result.status === "error"){
      toast.error(result.message)
      return
    }
    
    try{

      setLoading(true)
      setLoadingGoogle(true)

      const authCredential = await createUserWithEmailAndPassword(
        auth, values.email, values.password
      )
      
      const docRef = doc(db, "users", authCredential.user.uid);
     
      await setDoc(docRef,{
        name: values.name,
        email: values.email,
        password: values.password,
        imageUrl: values.imageUrl,
      })

    toast.success(result.message)
  }catch(e){
    console.error(e)
  }finally{
    setLoading(false)
    setLoadingGoogle(false)
  }
  }

  const handleGoogleSignIn = async () => {
    try{
      setLoadingGoogle(true)
      const provider = new GoogleAuthProvider()

      const authCredential = await signInWithPopup(auth,provider);

      const docRef = doc(db, "users", authCredential.user.uid);
     
      await setDoc(docRef,{
        name: authCredential.user.displayName,
        email: authCredential.user.email,
        imageUrl: authCredential.user.photoURL,
      })

      toast.success('Registration completed successfully')
    }catch(e){
      toast.error('You need to complete the authentication process to continue. Please click the "Sign up" button and try again.')
      setLoadingGoogle(false)
    }finally{
      setLoadingGoogle(false)
    }
  }

  return (
    <Form {...SignUpForm}>
    <form className="flex flex-col gap-4 w-full" onSubmit={SignUpForm.handleSubmit(handleSignUp)}>
      <FormField control={SignUpForm.control} name="name" render={({field})=>(
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter your name" {...field} suffix={<UserIcon/>} />
          </FormControl>
          <FormMessage/>
        </FormItem>
        )} />

        <FormField control={SignUpForm.control} name="email" render={({field})=>(
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input placeholder="Enter your email" suffix={<MailIcon/>} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField control={SignUpForm.control} name="password" render={({field})=>(
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Enter your password" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} />

        <FormField control={SignUpForm.control} name="imageUrl" render={({field})=>(
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input placeholder="Enter the url of your image" {...field} suffix={<Link2/>}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} />
        <Button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit"}
        </Button>
    </form>
        <Button disabled={loadingGoogle} onClick={handleGoogleSignIn} variant="secondary" className={`mt-3 w-full cursor-pointer`}>
          Sign up with Google
          <i className="fa-brands fa-google text-xl"></i>
        </Button>
    </Form>
)
}

export default SignupForm