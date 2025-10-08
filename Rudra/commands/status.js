module.exports.config = {
  name: "status",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT + NN + Jaylord La Peña",
  description: "Shows current protection status and if the bot is active",
  commandCategory: "system",
  usages: "/status",
  cooldowns: 5,
};

const PROTECTED_ADMINS = [
  "61559999326713", // Main Admin
  "61563731477181", // Another Protected Admin
  "61578564545419", // Another Bot UID (Protected)
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();

  try {
    // Check if bot is active by fetching its info
    const info = await api.getUserInfo([botID]);

    // If info is retrieved successfully, bot is active
    const botStatus = info[botID] ? "✅ Active" : "❌ Inactive";

    // Build the protected admins list
    const protectedList = PROTECTED_ADMINS.map(
      (uid, index) => `${index + 1}. ${uid}`
    ).join("\n");

    const message = `
🛡️ **Anti-Robbery System Status**
──────────────────────
🤖 Bot ID: ${botID}
📦 Version: 2.0.3 (Protection Module)
📊 Bot Status: ${botStatus}
──────────────────────
👑 **Protected Admins:**
${protectedList}

💡 Tip: Anyone who removes or kicks a protected admin will be demoted automatically.
    `.trim();

    api.sendMessage(message, threadID, messageID);
  } catch (err) {
    api.sendMessage(
      `⚠️ Error fetching bot status.\n${err.message}`,
      threadID,
      messageID
    );
  }
};
