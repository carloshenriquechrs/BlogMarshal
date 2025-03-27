'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const { reset } = useForm();
  
  function handleIsRegister(){
    setIsRegister(!isRegister);
    reset();
  }

  return (
    <div className="w-full flex min-h-screen items-start justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">{isRegister ? 'Registration Form' : 'Login Form'}</CardTitle>
          <CardDescription className="text-center">
            {isRegister ? 'Enter your information and complete your registration' : 'Enter your information and login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
        {isRegister ? (
          <SignupForm/>
        ) : (
          <LoginForm/>
        )}
        <div onClick={handleIsRegister} className="text-center mt-2">{isRegister ? 'Already have an account ? ' : 'Don\'t have an account ?'} <span className="text-indigo-600 cursor-pointer">{isRegister ? 'Sign in' : 'Sign up'}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}