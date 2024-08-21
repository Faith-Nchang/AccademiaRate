'use client'
import Image from "next/image";
import { Box, TextField, Typography, Toolbar, Stack, Button, AppBar} from "@mui/material";
import styles from "./page.module.css";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import useRadioGroup from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const {user} = useUser();
  const router = useRouter()

  if (user)
  {
    router.push('/dashboard')
  }
  
  return (
    <Box minWidth={'100vw'} sx={{ backgroundColor: 'black', color: 'white', height: '100vh' }}>
   <AppBar position='static' sx={{height:'80px', mb:2, backgroundColor:'#5E60CE'}}>
      <Toolbar>
      <Typography variant="h2" style={{ flexGrow: 1 }}>
        AcademiaRate 
      </Typography>
      <Button  variant="outlined"  href="/sign-in" sx={{backgroundColor: "#7400B8", color:'white', marginRight:5}}>
        Login
      </Button>

      <Button variant="outlined" href='/sign-up' sx={{backgroundColor: "#7400B8", color:'white'}}>
        Signup
      </Button>
      </Toolbar>
   </AppBar>

   

   <Box sx={{p: 20, textAlign: "center"}} >
    <Typography variant="h1">Welcome to AcademiaRate.</Typography> 
    <Typography variant="h4">Connect With the Right the Teachers</Typography>

    <Button variant="outlined" href='/sign-up' sx={{backgroundColor: "#7400B8", color:'white'}}>
      Let us get you started
    </Button>
    {/* <Image />
     */}
   </Box>
 </Box>

  )
}