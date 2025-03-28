'use client'

import { Button } from "@/components/ui/button";
import usePostById from "@/hooks/usePostById";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { PostSchema } from "@/utils/zodSchemas";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import DeletePostButton from "./DeletePostButton";
import { useAuth } from "@/context/AuthContext";


export default function Post(){
    const { post, loading } = usePostById();
    const [isEditing, setIsEditing] = useState(false);
    const [postState, setPostState] = useState(null);
    const { currentUser } = useAuth();
    const user = currentUser

    useEffect(() => {
      if (post) {
        setPostState(post);
      }
    }, [post]);

    const form = useForm({
        resolver: zodResolver(PostSchema),
        defaultValues: {
          title: post?.title || "",
          content: post?.content || "",
          imageUrl: post?.imageUrl || "",
        },
        mode: "onBlur", // Validate on blur
      });
      
      const { handleSubmit, formState: { errors, isDirty } } = form;

      const handleUpdate = async (values) => {
        if (!postState) return;
    
        const updatedFields = {};
        if (values.title !== post.title) updatedFields.title = values.title;
        if (values.content !== post.content) updatedFields.content = values.content;
        if (values.imageUrl !== post.imageUrl) updatedFields.imageUrl = values.imageUrl;

        if (Object.keys(updatedFields).length === 0) {
          toast.error("No changes detected.");
          setIsEditing(false);
          return;
        }
    
        try {
          const postRef = doc(db, "posts", postState.id);
          await updateDoc(postRef, updatedFields);
          setPostState((prev) => ({ ...prev, ...updatedFields }));
          toast.success("Post updated successfully!");
          setIsEditing(false);
        } catch (error) {
          toast.error("Error updating post");
        }
      };

    if (loading){
        return(
             <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full mr-2" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
    
                <div className='flex items-center justify-between mb-6 mt-4'>
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
    
                <Skeleton className="w-full h-[390px]" />
                <Skeleton className="w-full h-[70px] mt-4" />
            </div>
        )
} 

    if (!post) return notFound();

    const jsDate = new Date(post.created_At.seconds * 1000)

    return(
        <div className="max-w-3xl mx-auto pb-8 px-4">
            <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="relative size-10 overflow-hidden rounded-full">
                        <Image src={postState?.userImageUrl || "/NoUserImage.jpg"} alt="User Avatar" fill className="object-cover"/>
                    </div>
                    <p className="font-medium">{postState?.userName}</p>
                </div>
                    
                {user.uid === post.userId &&
                    <div className="flex items-center">
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                        <Button onClick={() => setIsEditing(true)}>
                            Edit Post
                        </Button>
                        </DialogTrigger>

                        <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Post</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="Post Title" />
                                    </FormControl>
                                    <FormMessage>{errors.title?.message}</FormMessage>
                                </FormItem>
                                )}
                            />

                            {/* Content Field */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                    <Textarea className="resize-none" {...field} placeholder="Post Content" />
                                    </FormControl>
                                    <FormMessage>{errors.content?.message}</FormMessage>
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="Enter the image url of your post" />
                                    </FormControl>
                                    <FormMessage>{errors.imageUrl?.message}</FormMessage>
                                </FormItem>
                                )}
                            />  

                            {/* Dialog Footer */}
                            <DialogFooter className="flex space-x-4">
                                <Button type="submit" disabled={!isDirty}>
                                Save
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                                Cancel
                                </Button>
                            </DialogFooter>
                            </form>
                        </Form>
                        </DialogContent>
                    </Dialog>
        
                    <div className="ml-3">
                        <DeletePostButton   postId={post.id} />
                    </div>
                </div>}
            </div>
                
            
            <div className="mb-6 mt-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-tight">{postState?.title}</h1>
                    <p className="text-[16px] text-gray-500">
                        {new Intl.DateTimeFormat("en-US",{
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }).format(jsDate)}
                    </p>
                </div>
            </div>
        
            
            <div className="relative h-[400px] w-full mb-4 overflow-hidden rounded-lg">
                <Image src={postState?.imageUrl || "/NoPostImage.jpg"} alt="Post Image" fill className="object-cover" priority />
            </div>  

            <Card>
                <CardContent>
                    <p className="text-gray-700">{postState?.content}</p>
                </CardContent>
            </Card>
        </div>
    )
}