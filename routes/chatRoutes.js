const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/products");

//new chatbot route (atlas search + Gemini)
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    //aggregation pipeline
    const relevantProducts = await Product.aggregate([
      {
        $search: {
          index: "chatBotSearch",
          text: {
            query: message,
            path: ["title", "description", "price", "category"],
          },
        },
      },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          price: 1,
          stock: 1,
          description: 1,
          score: { $meta: "searchScore" },
        },
      },
    ]);

    const prompt = `You are a helpful ecommerce assistant for CartWish.
  
  User asked: "${message}"
  
  Relevant products:
  ${JSON.stringify(relevantProducts, null, 2)}
  
  Give a SHORT recommendation in maximum 3-4 lines (less than 50 words).
  Mention products name and price only.
  No long descriptions. Be direct and concise.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: "AI is tired right now." });
  }
});

module.exports = router;
