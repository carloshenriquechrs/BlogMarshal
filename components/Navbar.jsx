'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import Image from "next/image"

const Navbar = () => {
    const {currentUser,logout,userDataObj} = useAuth() 
    const [data, setData] = useState({})

    useEffect(()=>{
        if(!currentUser || !userDataObj){
        return
        }
        setData(userDataObj)
    },[currentUser,userDataObj])
  
  return (
    <nav className='py-5 flex items-center justify-between'>
            <div className='flex items-center gap-6'>
                <Link href="/">
                    <h1 className='text-3xl font-semibold'>
                        Blog<span className='text-blue-500'>Marshal</span>
                    </h1>
                </Link>
                
                <div className='hidden sm:flex items-center gap-6'>
                    <Link className='text-sm font-medium hover:text-blue-500 transition-colors' href="/">Home</Link>
                    <Link className='text-sm font-medium hover:text-blue-500 transition-colors' href="/dashboard">Dashboard</Link>
                </div>
            </div>
    
            {!currentUser ? ( 
                <div className="flex items-center gap-4">
                    <Link href={'/dashboard'}>
                        <Button>Login</Button>
                    </Link>
                    <Link href={'/dashboard'}>
                        <Button variant="secondary">Sign Up</Button>
                    </Link>
                </div> 
                ) : (
                    <div className="flex items-center gap-10">
                        <Button onClick={logout}>Logout</Button>
                        <div>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium">{data.name}</p>
                                <div className="relative size-10 overflow-hidden rounded-full">
                                    <Image src={data.imageUrl || "/NoUserImage.jpg"} alt="User Avatar" fill className="object-cover"/>
                                </div>
                            </div> 
                        </div> 
                    </div>                                     
            ) }                
        </nav>
)
}

export default Navbar