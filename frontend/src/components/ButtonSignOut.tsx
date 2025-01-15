"use client"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

export const ButtonSignOut = () => {
    return (
        <Button
            onClick = { 
                async () =>  {
                    await signOut({
                        callbackUrl:'/login'
                    }) 
                }
            }
        >
            Logout
        </Button>
    )
}