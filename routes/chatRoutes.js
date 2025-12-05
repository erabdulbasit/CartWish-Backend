const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Product = require("../models/products");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    // 1. Get all products from your database (Just title, price, and category to save space)
    const products = await Product.find({}).select(
      "title price category description"
    );
    // Convert products to a string so the AI can read it
    const productContext = products
      .map((p) => `${p.title} (Price: $${p.price}, Category: ${p.category})`)
      .join("\n");

    //did'nt understand
    // 2. Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 3. Create the prompt (The "System Instructions")
    const prompt = `
      You are a helpful shopping assistant for an e-commerce store called CartWish.
      
      Here is our list of available products:
      ${productContext}

      User Question: "${message}"

      Rules:
      1. Only recommend products from the list above.
      2. If the user asks about something we don't have, politely say we don't have it.
      3. Keep your answer short (max 3 sentences).
      4. If you mention a product, mention its price.
    `;

    //did'nt understand
    // 4. Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send answer back to frontend
    res.json({ reply: text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "AI is tired right now." });
  }
});

module.exports = router;
