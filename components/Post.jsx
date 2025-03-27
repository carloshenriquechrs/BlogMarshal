'use client'

import Loading from "@/components/Loading";
import { buttonVariants } from "@/components/ui/button";
import usePostById from "@/hooks/usePostById";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";


export default function Post(){
    const { post, loading } = usePostById();

    if (loading){
        return(
            <div className="max-w-3xl mx-auto px-4">
                <div className='flex items-center justify-between'>
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-8 w-[100px]" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center py-4">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16 ml-2" />
                    </div>
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
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
                    <Link className={buttonVariants({variant: 'secondary'})} href="/">Back to posts</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative size-10 overflow-hidden rounded-full">
                            <Image src={post.userImageUrl || "/NoUserImage.jpg"} alt="User Avatar" fill className="object-cover"/>
                        </div>
                        <p className="font-medium">{post.userName}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat("en-US",{
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }).format(jsDate)}
                    </p>
                </div>
            </div>
            <div className="relative h-[400px] w-full mb-4 overflow-hidden rounded-lg">
               <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority />
            </div>

            <Card>
                <CardContent>
                    <p className="text-gray-700">{post.content}</p>
                </CardContent>
            </Card>
        </div>
    )
}