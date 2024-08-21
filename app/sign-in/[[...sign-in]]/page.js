import { SignIn } from "@clerk/nextjs"
import { Box, Container, Typography, Button } from "@mui/material"

export default function SignInPage()
{
    return (
    <Box
    padding={2}
    minHeight={'100vh'}
    minWidth={"100vw"}
    sx={{ backgroundImage: 'linear-gradient(to right, #6930C3, #48BFE3)', color:'white' }}
    >       
    <Container maxWidth="sm" sx={{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'} }>
         
         <Button href="/" sx={{backgroundColor: 'purple', position:'absolute', left:10, top:20}}>
            Home
        </Button>
        <Typography variant="h3" mb={2} >
            Sign In
        </Typography>
        <SignIn />

    </Container>
     </Box>
    )
}