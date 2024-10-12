import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Store your API Key in a .env file
});

export async function generateSummary(webpageContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Can you analyze the webpage content and return a short 4-5 line summary (return just the summary)? If no content was provided, then return No Content Provided. Content: ${webpageContent}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message?.content;
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    throw new Error("Failed to generate summary.");
  }
}