"use server";

import { LoginSchema, PostSchema, SignUpSchema } from "@/utils/zodSchemas";

export async function SignUpUser(values) {

    const result = SignUpSchema.safeParse(values)

    if(!result.success){
        return{
            status: 'error',
            message: result.error.message,
        }
    }

    return{
        status: 'success',
        message: 'User registered successfully'
    }
}

export async function LoginUser(values) {
    
    const result = LoginSchema.safeParse(values)

    if(!result.success){
        return{
            status: 'error',
            message: result.error.message,
        }
    }

    return{
        status: 'success',
        message: 'Login Successful'
    }
}

export async function CreatePost(values) {
    const result = PostSchema.safeParse(values)

    if(!result.success){
        return{
            status: 'error',
            message: result.error.message,
        }
    }

    return{
        status: 'success',
        message: 'Post created successfully'
    }
}
