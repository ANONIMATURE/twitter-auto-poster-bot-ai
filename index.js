const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");
const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,});
const generationConfig = {
  maxOutputTokens: 400,};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);
async function run() {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });

  const prompt =
    "Stwórz chwytliwe i krótkie zdanie promujące Discorda dla maturzystów. Skup się na zachęceniu do dołączenia, podkreślając dostęp do materiałów, arkuszy i wsparcia przed maturą. Dodaj link: https://discord.gg/NKtRwQDp.";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Pobierz najpopularniejsze hashtagi
  const trendingHashtags = await getTwitterTrends(); // Lub `scrapeTrendingHashtags()`
  const hashtags = trendingHashtags.join(" ");
  let tweetText = `${text}\n\n${hashtags}`;

  if (tweetText.length > 280) {
    tweetText = `${text.substring(0, 280 - hashtags.length - 3)}...\n\n${hashtags}`;
  }

  console.log(tweetText);
  sendTweet(tweetText);
}
}
run();
async function sendTweet(tweetText) { try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
