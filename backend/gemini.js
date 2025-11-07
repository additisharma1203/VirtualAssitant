import axios from "axios";
import https from "https";

const agent = new https.Agent({  
  rejectUnauthorized: false,  // ⛔ disables SSL cert validation (dev only!)
});

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `You are a virtual assistant named ${assistantName}, created by ${userName}.
Respond ONLY in this JSON format:
{
  "type": "general",
  "userInput": "<the user's query>",
  "response": "<your short reply>"
}
User said: ${command}`;

    const result = await axios.post(
      apiUrl,
      { contents: [{ parts: [{ text: prompt }] }] },
      { httpsAgent: agent }  // ✅ this line is key
    );

    const rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        type: "general",
        userInput: command,
        response: rawText || "Sorry, I didn’t understand that.",
      };
    }

    return parsed;
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      type: "error",
      userInput: command,
      response: "There was a problem connecting to the AI service.",
    };
  }
};

export default geminiResponse;
