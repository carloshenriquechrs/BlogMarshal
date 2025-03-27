"use client"

import { CreatePost, SignUpUser } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/firebase"
import { PostSchema } from "@/utils/zodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { Send } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const CreateBlogRoute = () => {
  const {currentUser} = useAuth()
  const { reset } = useForm();
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if(!currentUser){
    return redirect("/dashboard")
  }

  const PostForm = useForm({
    resolver: zodResolver(PostSchema),
    defaultValues:{
      title: '',
      content: '',
      imageUrl: ''
    }
  })

  async function handleSubmit(values) {

    const result = await CreatePost(values)

    if(result.status === "error"){
      toast.error(result.message)
      return
    }

    try{

    setLoading(true)

    const newDocRef = doc(collection(db,"posts"));
    
    await setDoc(newDocRef,{
      userId: currentUser.uid,
      title: values.title,
      content: values.content,
      imageUrl: values.imageUrl,
      created_At: serverTimestamp(),
      last_update_At: serverTimestamp(), 
      documentId: newDocRef.id
    })
    
    toast.success(result.message)
    router.push('/dashboard')
  }catch(e){
    console.error(e)
    // setLoading(false)
  }finally{
    setLoading(false)
  }
}
  
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Create to share with the world</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...PostForm}>
          <form className="flex flex-col gap-4 w-full" onSubmit={PostForm.handleSubmit(handleSubmit)}>
            <FormField control={PostForm.control} name="title" render={({field})=>(
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
              )} />

              <FormField control={PostForm.control} name="content" render={({field})=>(
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" placeholder="Content" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )} />

              <FormField control={PostForm.control} name="imageUrl" render={({field})=>(
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a url da sua imagem" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )} />
            <Button disabled={loading} type="submit">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateBlogRoute 