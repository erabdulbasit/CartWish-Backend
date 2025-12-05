// // check-models.js
// const https = require("https");
// require("dotenv").config();

// // 1. PUT YOUR KEY HERE DIRECTLY (Just for this test)
// //const API_KEY = "AIzaSyAAYo0EltAgbqKXhJwtuHVywWD3-KGTvq8";
// const API_KEY = process.env.GEMINI_API_KEY;

// const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

// console.log("Checking available models...");

// https
//   .get(url, (res) => {
//     let data = "";

//     // Collect the data chunks
//     res.on("data", (chunk) => {
//       data += chunk;
//     });

//     // Process the full response
//     res.on("end", () => {
//       try {
//         const response = JSON.parse(data);

//         if (response.error) {
//           console.error("❌ API Error:", response.error.message);
//         } else if (response.models) {
//           console.log("✅ SUCCESS! Here are your available models:\n");
//           // Filter only the ones that can 'generateContent'
//           const chatModels = response.models
//             .filter((m) =>
//               m.supportedGenerationMethods.includes("generateContent")
//             )
//             .map((m) => m.name.replace("models/", "")); // Clean up the name

//           console.log(chatModels.join("\n"));
//           console.log(
//             "\n👉 Please pick one of the names above for your chatRoutes.js file."
//           );
//         } else {
//           console.log("⚠️ No models found. This is weird.");
//           console.log(response);
//         }
//       } catch (e) {
//         console.error("Error parsing JSON:", e.message);
//         console.log("Raw output:", data);
//       }
//     });
//   })
//   .on("error", (err) => {
//     console.error("Connection Error:", err.message);
//   });
