'use client'

import Loading from "./Loading"
import BlogPostCard from "./BlogPostCard"
import usePosts from "@/hooks/usePosts"

const Hero = () => {
  const { posts, loading } = usePosts();

  if(loading){
    return <Loading gridValor={6} />
  }

  return (
    <div className='py-6'>
      <h1 className='text-3xl font-bold tracking-tight mb-8'>Latest posts</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {posts.length > 0 ? (
        posts.map((post) => <BlogPostCard key={post.id} post={post} />)
      ) : (
        <p>No posts found.</p>
      )} 
      </div>
    </div>
  )
}

export default Hero

