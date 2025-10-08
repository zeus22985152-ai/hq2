const { getCurrentUserID } = require("../../utils/apiHelper"); // optional if your framework uses helper files

module.exports.config = {
  name: "status",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT + NN + Jaylord La Peña",
  description: "Shows current protection status and protected admin list",
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
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  try {
    const info = await api.getUserInfo(PROTECTED_ADMINS);
    const protectedList = PROTECTED_ADMINS.map(
      (uid, index) => `${index + 1}. ${info[uid]?.name || "Unknown User"} (${uid})`
    ).join("\n");

    const message = `
🛡️ **Anti-Robbery System Status**
──────────────────────
🤖 Bot ID: ${botID}
📦 Version: 2.0.3 (Protection Module)
📊 Status: ✅ Active & Monitoring
──────────────────────
👑 **Protected Admins:**
${protectedList}

💡 Tip: Anyone who removes or kicks a protected admin will be demoted automatically.
    `.trim();

    api.sendMessage(message, threadID);
  } catch (err) {
    api.sendMessage(
      `⚠️ Error fetching status.\n${err.message}`,
      threadID
    );
  }
};
