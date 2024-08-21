import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai'

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
   })

   const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})
  
   const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)

export async function POST(req) {
  // Parse the request body as JSON
  const { url } = await req.json();

  

  try {
    const response = await fetch(url); // Fetch data from the provided URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    
    // Extract the desired data from the HTML
    const stars = $(".RatingValue__Numerator-qw8sqy-2.liyUjw").text().trim();
    const reviews = $(".Comments__StyledComments-dzzyvm-0.gRjWel").text().trim();
    const firstName = $("div.NameTitle__Name-dowf0z-0.cfjPUG span").first().text().trim();
    const lastName = $("div.NameTitle__Name-dowf0z-0.cfjPUG span.NameTitle__LastNameWrapper-dowf0z-2.glXOHH").text().trim();
    const professor = `${firstName} ${lastName}`;
    const courseName = $("a.TeacherDepartment__StyledDepartmentLink-fl79e8-0.iMmVHb b").text().trim();

    // Create the data object
    const data = {
      Professor: professor,
      subject: courseName,
      rating: stars,
      review: reviews,
    };

      // Create text embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${professor} teaches ${courseName}. Rating: ${stars}. Reviews: ${reviews}`,
        encoding_format: 'float',
      });
      const embedding = embeddingResponse.data[0].embedding;


    const namespace = process.env.PINECONE_NAMESPACE;
    // Insert data into Pinecone with namespace
    await index.namespace(namespace).upsert([
        {
          "id": professor,
          "values": embedding,
          "metadata": {
            "review": reviews,
            "subject": courseName,
            "rating": stars
          }
        }
      ])
      

    console.log(data)
    // Return the extracted data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error); 
    // Handle errors and send a JSON response with error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
