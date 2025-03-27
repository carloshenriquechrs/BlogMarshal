import Image from "next/image"
import Link from "next/link"

const BlogPostCard = ({post}) => {

  const jsDate = new Date(post.created_At.seconds * 1000)
  
  return (
    <div className='group relative overflow-hidden rounded-lg boder border-gray-200 bg-white shadow-md transition-all hover:shadow-lg'>
      <Link href={`/post/${post.documentId}`} className="block w-full h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={post.imageUrl} alt="Image for blog" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>

        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{post.title}</h3>
          
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">{post.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative size-8 overflow-hidden rounded-full">
                <Image src={post.userImageUrl || "/NoUserImage.jpg"} alt="User Avatar" fill className="object-cover"/>
              </div>
              <p className="text-sm font-medium text-gray-700">{post.userName}</p>
            </div>
            <time className="text-xs text-gray-500">
              {new Intl.DateTimeFormat("en-US",{
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }).format(jsDate)}
            </time>
          </div>
        </div>
      </Link>
    </div>
)
}

export default BlogPostCard