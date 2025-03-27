'use client'

import Loading from "@/components/Loading"
import Login from "@/components/Login"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import BlogPostCard from "./BlogPostCard"
import usePosts from "@/hooks/usePosts"

export default function Dashboard() {
  const { currentUser} = useAuth()
  const user = currentUser
  const { posts, loading } = usePosts(user ? user.uid : null);
  
  if(loading){
  return <Loading gridValor={3} />
  }

  if(!currentUser){
    return <Login/>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mt-6">
        <h2 className="text-xl font-medium">Your Blog Articles</h2>
        <Link className={`${buttonVariants()}`} href="/dashboard/create">Create Post</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <BlogPostCard key={post.id} post={post} />)
          ) : (
            <p>No posts found.</p>
          )} 
      </div>
    </div>
  );
}