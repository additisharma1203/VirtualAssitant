 import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"
 export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
return res.status(400).json({message:"user not found"})
        }

   return res.status(200).json(user)     
    } catch (error) {
       return res.status(400).json({message:"get current user error"}) 
    }
}

export const updateAssistant=async (req,res)=>{
   try {
      const {assistantName,imageUrl}=req.body
      let assistantImage;
if(req.file){
   assistantImage=await uploadOnCloudinary(req.file.path)
}else{
   assistantImage=imageUrl
}

const user=await User.findByIdAndUpdate(req.userId,{
   assistantName,assistantImage
},{new:true}).select("-password")
return res.status(200).json(user)

      
   } catch (error) {
       return res.status(400).json({message:"updateAssistantError user error"}) 
   }
}


export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    // Save command to history
    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;

    // Call Gemini
    const result = await geminiResponse(command, assistantName, userName);

    // Some Gemini responses include markdown ```json blocks — clean them
    let cleaned = result.response;
    if (cleaned.includes("```json")) {
      cleaned = cleaned.replace(/```json|```/g, "").trim();
    }

    // Try parsing cleaned text if it's JSON-like
    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = result; // fallback to original
    }

    // Determine type
    const type = parsed.type || result.type || "general";
    const userInput = parsed.userInput || result.userInput || command;
    const responseText = parsed.response || result.response || "Sorry, I didn’t understand that.";

    // Handle different command types
    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput,
          response: `📅 The current date is ${moment().format("YYYY-MM-DD")}.`,
        });

      case "get-time":
        return res.json({
          type,
          userInput,
          response: `⏰ The current time is ${moment().format("hh:mm A")}.`,
        });

      case "get-day":
        return res.json({
          type,
          userInput,
          response: `🗓️ Today is ${moment().format("dddd")}.`,
        });

      case "get-month":
        return res.json({
          type,
          userInput,
          response: `🌙 The current month is ${moment().format("MMMM")}.`,
        });

      // These are generic conversational responses
      case "general":
      default:
        return res.json({
          type: "general",
          userInput,
          response: responseText,
        });
    }
  } catch (error) {
    console.error("❌ askToAssistant Error:", error);
    return res.status(500).json({
      type: "error",
      response: "Something went wrong while processing your command.",
    });
  }
};
