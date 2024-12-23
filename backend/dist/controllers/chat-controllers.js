import User from "../models/User.js";
import OpenAI from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        if (!message || typeof message !== "string") {
            return res.status(400).json({ message: "Invalid or missing message" });
        }
        if (!res.locals.jwtData?.id) {
            return res.status(401).json({ message: "Unauthorized: Missing user ID in token" });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }
        //grab all chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role: role, // Ensure the role matches expected values
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        //send all chats with new one through openAI API
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_SECRET,
            organization: process.env.OPENAI_ORGANIZATION,
        });
        //get latest response
        let chatResponse;
        try {
            chatResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: chats,
            });
        }
        catch (apiError) {
            console.log(apiError);
            console.error("OpenAI API Error:", apiError.response?.data || apiError.message);
            return res.status(500).json({ message: "Failed to get a response from OpenAI" });
        }
        // Validate OpenAI response
        if (!chatResponse.choices || !chatResponse.choices[0]?.message) {
            return res.status(500).json({ message: "Failed to get a valid response from OpenAI" });
        }
        const aiMessage = chatResponse.choices[0].message;
        // Add AI response to user chats
        user.chats.push(aiMessage);
        // Save user chats to database
        try {
            await user.save();
        }
        catch (dbError) {
            console.error("Database Save Error:", dbError.message);
            return res.status(500).json({ message: "Failed to save chat history" });
        }
        // Return updated chats
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error("Error in generateChatCompletion:", {
            message: error.message,
            stack: error.stack,
        });
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    //user token check
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User is not registered OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions did not match");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "error", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    //user token check
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User is not registered OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions did not match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "error", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map