const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

// Konfiguracja klienta Twitter API
const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

// Konfiguracja Google Generative AI
const generationConfig = {
  maxOutputTokens: 280, // Limit znaków na tweeta
};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

// Funkcja do pobierania popularnych hashtagów w Polsce
async function getTrendingHashtags() {
  try {
    const trends = await twitterClient.v1.trendsByPlace(23424923); // WOEID dla Polski
    const hashtags = trends[0].trends
      .filter((trend) => trend.name.startsWith("#"))
      .slice(0, 5) // Wybierz top 5 hashtagów
      .map((trend) => trend.name);
    return hashtags.join(" ");
  } catch (error) {
    console.error("Error fetching trends:", error);
    return "#matura #egzaminy #nauka"; // Domyślne hashtagi, jeśli wystąpi błąd
  }
}

// Funkcja generująca treść tweeta
async function generateTweet() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    const prompt = `
      Write a tweet in the style of:
      "Dołącz do naszego Discorda i zyskaj dostęp do najnowszych przecieków maturalnych. Materiały, które mogą Ci pomóc na maturze. Arkusze z matematyki już są: https://discord.gg/NKtRwQDp". 
      Use varied language to keep it fresh, but keep the link and polish context.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Dodaj hashtagi
    const hashtags = await getTrendingHashtags();
    return `${text} ${hashtags}`;
  } catch (error) {
    console.error("Error generating tweet:", error);
    return "Dołącz do naszego Discorda i zyskaj dostęp do najnowszych przecieków maturalnych. Materiały, które mogą Ci pomóc na maturze. Arkusze z matematyki już są: https://discord.gg/NKtRwQDp #matura #egzaminy #nauka";
  }
}

// Funkcja wysyłająca tweeta
async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}

// Uruchomienie bota
(async function run() {
  const tweetText = await generateTweet();
  console.log("Generated Tweet:", tweetText);
  await sendTweet(tweetText);
})();
