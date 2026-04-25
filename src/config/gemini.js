const API_KEY = import.meta.env.VITE_API_KEY;

async function runChat(prompt) {
  console.log("=== runChat called ===");
  console.log("Prompt:", prompt);
  console.log("API Key exists:", !!API_KEY);
  console.log("API Key preview:", API_KEY ? API_KEY.substring(0, 10) + "..." : "MISSING");

  try {
    console.log("Sending request to Groq...");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
  {
    role: "system",
    content: "You are a Computer Science tutor for college students. Only answer CS related questions like DSA, OS, DBMS, Networks, OOP, Python, Java, Web Development. If question is not CS related, say: I am a CS Assistant, please ask Computer Science related questions only."
  },
  { role: "user", content: prompt }
],
        temperature: 0.9,
        max_tokens: 2048,
      })
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Full response data:", data);

    if (data.error) {
      console.error("Groq API Error:", data.error);
      return "Error: " + data.error.message;
    }

    const result = data.choices[0].message.content;
    console.log("Result:", result);
    return result;

  } catch (error) {
    console.error("Fetch failed:", error);
    return "Error: " + error.message;
  }
}

export default runChat;