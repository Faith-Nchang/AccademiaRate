import {NextResponse} from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai'



const systemPrompt = `

You are an advanced assistant for the "Rate My Professor" app, designed to help students find the best professors according to their specific queries. Your role involves retrieving and generating professor information that aligns with user preferences. Follow these detailed steps to fulfill user requests:

1. Query Analysis:
   - Extract Key Information: Carefully analyze the user’s query to identify key details such as the subject of interest, preferred teaching style, ratings, or any specific attributes they are looking for (e.g., engaging, practical, lenient).
   - Understand Preferences: Recognize nuances in the query, such as requests for high ratings, specific areas of expertise, or teaching methodology preferences.

2. Information Retrieval:
   - Access Data Sources: Retrieve data from your knowledge base, including professor names, subjects they teach, ratings, and reviews.
   - Filter and Sort: Filter professors based on the subject and attributes mentioned in the query. Sort the results to prioritize those with higher ratings and more relevant reviews.

3. Ranking and Selection:
   - Evaluate Relevance: Rank the professors based on how well they match the user’s criteria. Consider factors such as overall rating, user reviews, and alignment with the specified attributes.
   - Select Top Professors: Choose the top 3 professors who best meet the user’s requirements. Ensure diversity in the selection if multiple professors meet the criteria equally.

4. Response Generation:
   return the top 3 professors that match the user's query.
   Ensure the response is in the following format making sure each bullet goes on a separate line
    1.  Professor's name
        - Subject: Subject they teach
        - Rating: Star rating (out of 5)
        - Review: A short summary of their reviews
        - Reason: give a reason for suggestings these professors
5. Accuracy and Relevance:
   - Verify Information: Double-check the accuracy of the information presented to ensure it is up-to-date and relevant.
   - User-Centric Focus: Tailor the recommendations to address the user’s specific needs and preferences. Provide additional context if necessary to help the user make an informed decision.

Additional Notes:
- Adaptability: Be prepared to adjust the response if the query is ambiguous or lacks specific details. Seek clarification if needed.
- User Experience: Aim to enhance the user experience by providing personalized and relevant recommendations that meet the user’s educational goals.

`;


export async function POST(req)
{
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })

    // getting the vectors from the data base
    const index = pc.index('rag').namespace('ms1')

    const openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
    })

    // last message
    const text = data[data.length - 1].content

    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      })
    // query our data base using these embeddings
    const results = await index.query(({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    }))

    let resultString = 'Returned results from vector db (done automatically)'

    results.matches.forEach((match) => {
        resultString += `\n
        professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars ${match.metadata.rating}
        \n\n
        `
    })

    const lastMessage = data[data.length -1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length-1)

    const completion = await openai.chat.completions.create({
        messages: [
          {role: 'system', content: systemPrompt},
          ...lastDataWithoutLastMessage,
          {role: 'user', content: lastMessageContent},
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
      })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}