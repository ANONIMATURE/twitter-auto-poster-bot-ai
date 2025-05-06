import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function runBot() {
  try {
    console.log("🧠 Generuję tekst przez Gemini...");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Brakuje GEMINI_API_KEY!");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `Stwórz chwytliwe i krótkie zdanie promujące Discorda dla maturzystów. 
Skup się na zachęceniu do dołączenia, podkreślając dostęp do materiałów, przecieków arkuszy i wsparcia przed maturą. 
Dodaj link: https://discord.gg/NKtRwQDp. 
Mogą też być hashtagi typu #Matura2025, #Matematyka, #LGBT, #Debata, #Przecieki. 
Ogranicz się do 280 znaków.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log("✅ Odpowiedź Gemini:", text);

    console.log("🐦 Łączenie z Twitter API...");
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    await client.v2.tweet(text);
    console.log("🎉 Tweet wysłany pomyślnie!");
  } catch (error) {
    console.error("❌ Wystąpił błąd:", error.message);
    process.exit(1);
  }
}

runBot();
