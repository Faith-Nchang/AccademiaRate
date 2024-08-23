import { useState } from "react"
import styles from '../page.module.css'

const { Typography, TextField, Button, Box, CircularProgress } = require("@mui/material")

const AddProfessor = ({open} ) =>{
    const [inputUrl, setInputUrl] = useState(''); // For storing the URL input
    const [data, setData] = useState(null); // For storing the response data
    const [error, setError] = useState(null); // For storing any error that might occur
    const [loading, setLoading] = useState(false);
 
    // to scrape the data to obtain information about the professor
    
  const handleScrape = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await fetch('/api/fetch-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setData(responseData); // Store the response data in state
      alert("Professor Information successfully scraped")
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message); // Store the error message in state
      setData(null); // Clear any previous data
    } finally{
      setLoading(false)
    }
  };


  return (
    
    open && 
    <Box color='white' p={4}>
   <Box display={'flex'}>
      <form onSubmit={handleScrape} style={{ display: 'flex', flexGrow: 1 }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter professor URL"
          style={{ flexGrow: 1, padding: '8px', marginRight: '8px', fontSize:'40px' }} // Basic inline styling
        />
        <Button
          type="submit"
          sx={{ padding: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#7400B8' }}
        >
          Scrape Data
        </Button>
      </form>
    </Box>

    {/* Display the data */}
    {data && (
      <Box color='black' sx={{
        p:5,
        mt:10,
        width: "100%",
        height: "90%",
        backgroundImage: "linear-gradient(to right, #6930C3, #4EA8DE, #72EFDD)",
        fontSize:'20px'
      }}>
        <h1 style={{ color: 'white' }}>Professor: {data.Professor}</h1>
        <p><span className={styles.spanText}>Subject: </span>{data.subject}</p>
        <p><span className={styles.spanText}>Rating: </span> {data.rating}</p>
        <p><span className={styles.spanText}>Review: </span>{data.review}</p>
      </Box>
    )}

    {loading && (
  <Typography variant="h6" px={60} py={30}>
    <CircularProgress />
    <p>Scraping website</p>
  </Typography>
)}

    {/* Display the error */}
    {error && <p>Error: {error}</p>}
  </Box>

    
  );
}

export default AddProfessor