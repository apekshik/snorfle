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

export async function generateSmartFilters(searchQuery: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              "type": "text",
              "text": `Here's a search query: ${searchQuery}. Can you come up with 3-4 search filters based on this search query so the search can be better refined? But instead of coming up with generic filters like Time, Genre, Release Date, etc., come up with ones that are specific to the search query itself. Make sure to ONLY return the filter names in JSON format please.`
            }
          ]
        }
      ],
      temperature: 0.52,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        "type": "json_object"
      },
    });
    // Ensure `content` is defined and a string before parsing it.
    let content = response.choices[0]?.message?.content;

    if (!content) {
      console.error('No content in response.');
      throw new Error("No content received from OpenAI.");
    }

    // Parse the JSON content only after ensuring it's a valid string.
    const filters = JSON.parse(content).filters;
    return filters;
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    throw new Error("Failed to generate smart filters.");
  }
}