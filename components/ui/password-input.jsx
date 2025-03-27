import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input";
import { EyeIcon, EyeOff } from "lucide-react";

function PasswordInput({className, ...props}) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <Input type={showPassword ? "text" : "password"} suffix={showPassword ? ( 
    <EyeIcon className="cursor-pointer" onClick={()=>setShowPassword(false)} /> 
    ) : (
     <EyeOff className="cursor-pointer" onClick={()=>setShowPassword(true)}/>
    )
  } 
  className={className} {...props} />
);
}

export { PasswordInput }
