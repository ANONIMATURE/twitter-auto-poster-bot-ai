// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 400,
};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });

  // Write your prompt here
  const prompt =
    "Purpose: The bot should generate short, engaging, and actionable content for social media platforms like Discord announcements or Twitter. The content can promote a Discord server or share valuable advice, tips, or resources in an engaging manner.

Tone: The tone should be conversational, helpful, and slightly persuasive to encourage clicks or engagement. Content should be concise and attention-grabbing.

Examples of Content:

Discord Promotion Example:
"Dołącz do naszego Discorda i zyskaj dostęp do najnowszych przecieków maturalnych. Materiały, które mogą Ci pomóc na maturze. Arkusze z matematyki już są: https://discord.gg/NKtRwQDp"

Web Development Tips Example:
"🎯 Tip of the Day: Use :has() in CSS for parent-child selection. Need a parent to react when a child is checked? This game-changer is now supported in most modern browsers. Test it out! More tricks? Join us: https://discord.gg/NKtRwQDp"

Content for Students Example:
"📚 Twoja matura to nie loteria – to strategia! Poznaj metody skutecznej nauki, podziel się materiałami i przygotuj się na sukces razem z nami. Dołącz: https://discord.gg/NKtRwQDp"

Web Development Unique Advice:
"💻 Think HTML is boring? Think again. You can create dynamic, data-driven UIs using custom attributes and data-* with JavaScript. It's lightweight, flexible, and perfect for interactive projects. For more hacks, join: https://discord.gg/NKtRwQDp"

How It Works:

Use the provided Discord link consistently: https://discord.gg/NKtRwQDp.
Keep sentences concise, below 280 characters for Twitter compatibility.
Alternate between promotional content, educational advice, and engaging tips.
  say it only in polish language";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  sendTweet(text);
}

run();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
