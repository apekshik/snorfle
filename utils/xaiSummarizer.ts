import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: "xxx",
//   baseURL: "https://api.x.ai/v1",
// });

// Define the function that processes input_ and returns the result

export async function summarizeInput(input_: any[], openai: OpenAI) {
  var prompt = input_[0];
  var result = [prompt, []];

  // Loop through the array of search objects and process each one
  for (const searchObj of input_[1]) {
    // Call the OpenAI API to get a summary for each markdown content
    const rawSummary = await openai.chat.completions.create({
      model: "grok-preview",
      messages: [
        { role: "system", content: "You are a summary chatbot that turns user input into 3-5 concise human-readable sentences in paragraph form focusing on " + prompt },
        {
          role: "user",
          content: searchObj.markdown,
        },
      ],
    });

    // Append the title, website, and summary to the result array
    result[1].push({
      "title": searchObj.title,
      "website": searchObj.website,
      "summary": rawSummary.choices[0].message.content
    });
  }

  // Return the result after processing all search objects
  return result;
}

// // Example usage of the function
// (async () => {
//   var input_ = [
//     "good seafood restaurant in sf",
//     [
//       {
//         "title": "x1",
//         "website": "https://1...",
//         "markdown": "San Francisco boasts a rich seafood scene, with a variety of restaurants offering everything from classic dishes to modern, chef-driven plates. Scoma's Restaurant is a historic choice, known for its cioppino and warm ambiance right on the bay. For a contemporary twist, Popi’s Oysterette in the Marina District serves dishes like green cioppino and offers a raw bar with oysters, mussels, and more. If you're looking for Italian seafood, Portofino in North Beach stands out with its chalkboard menu of daily fresh catches. Meanwhile, Hog Island Oyster Co. at the Ferry Building provides a taste of their famous oysters, alongside other seafood delights. For those interested in upscale dining, Angler offers wood-fired and smoked seafood options, showcasing the city's innovative culinary scene. Each restaurant contributes to San Francisco's diverse seafood landscape, catering to different tastes and dining experiences."
//       },
//       {
//         "title": "x2",
//         "website": "https://2...",
//         "markdown": "San Francisco boasts a rich seafood scene, with a variety of restaurants offering everything from classic dishes to modern, chef-driven plates. Scoma's Restaurant is a historic choice, known for its cioppino and warm ambiance right on the bay. For a contemporary twist, Popi’s Oysterette in the Marina District serves dishes like green cioppino and offers a raw bar with oysters, mussels, and more. If you're looking for Italian seafood, Portofino in North Beach stands out with its chalkboard menu of daily fresh catches. Meanwhile, Hog Island Oyster Co. at the Ferry Building provides a taste of their famous oysters, alongside other seafood delights. For those interested in upscale dining, Angler offers wood-fired and smoked seafood options, showcasing the city's innovative culinary scene. Each restaurant contributes to San Francisco's diverse seafood landscape, catering to different tastes and dining experiences."
//       }
//     ]
//   ];

//   // Call the function and log the result
//   const result = await summarizeInput(input_);
//   console.log(result);
// })();
