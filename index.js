import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// === Prompt ===
const prompt = `Stwórz chwytliwe i krótkie zdanie promujące Discorda dla maturzystów. 
Skup się na zachęceniu do dołączenia, podkreślając dostęp do materiałów, przecieków arkuszy i wsparcia przed maturą. 
Dodaj link: https://discord.gg/NKtRwQDp. 
Mogą też być hashtagi typu #Matura2025, #Matematyka, #LGBT, #Debata, #Przecieki. 
Ogranicz się do 280 znaków.`;

// === Gemini AI ===
console.log("🧠 Generuję tekst przez Gemini...");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(prompt);
const text = await result.response.text();

console.log("✅ Odpowiedź Gemini:", text);

// === Twitter API ===
console.log("🐦 Łączenie z Twitter API...");
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

try {
  await client.v2.tweet(text);
  console.log("🎉 Tweet wysłany pomyślnie!");
} catch (error) {
  console.error("❌ Błąd podczas wysyłania tweeta:", error);
}
