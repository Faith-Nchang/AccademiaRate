'use client'
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import AddProfessor from "../Components/AddProfessor"
import Chatbot from "../Components/Chatbot"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"

export default function Dashboard()
{
    const [isChatbotOpen, setIsChatbotOpen] = useState(true);
    const [submitProfile, IsSubmitted] = useState(false)
    const user = new useUser();
    const router = useRouter()
    const handleRecommendation = () =>{
        setIsChatbotOpen(true)
        IsSubmitted(false)
    }
    if(!user) {
        router.push('/')
    }

    const handleSubmitUrl = () =>{
        IsSubmitted(true)
        setIsChatbotOpen(false)
    }
    return (
        <Box minHeight ='100vh' sx={{backgroundColor: 'black'}}>
            <AppBar position='static' sx={{backgroundColor:'#5E60CE'}}>
            <Toolbar sx={{justifyContent:'space-between'}}>
                        <Button onClick={handleRecommendation} sx={{color:'white'}}> Get Recommendation from AI</Button>


                        <Button onClick={handleSubmitUrl} sx={{color:'white'}}>Submit New Professor Link</Button>

                    <UserButton />
                </Toolbar>
            </AppBar>
           <Box> 
              
            </Box>

                {/* opens the chat bot */}
                <Chatbot open={isChatbotOpen} />
                {/* let the user input the url */}
                <AddProfessor open={submitProfile} />


        </Box>
    )
}