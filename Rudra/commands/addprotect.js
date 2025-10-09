const { getData, setData } = require("../../database.js");

// 👑 Jaylord only
const OWNER_ID = "61559999326713";

module.exports.config = {
  name: "addprotect",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ChatGPT + Jaylord La Peña",
  description: "Add UID to protected list (Firebase)",
  usages: "/addprotect <uid>",
  commandCategory: "system",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { senderID, threadID, messageID } = event;
  if (senderID !== OWNER_ID)
    return api.sendMessage("🚫 Only Jaylord can add protected UIDs.", threadID, messageID);

  const uid = args[0];
  if (!uid || isNaN(uid))
    return api.sendMessage("⚠️ Please provide a valid UID.\nExample: /addprotect 61554885397487", threadID, messageID);

  try {
    let list = (await getData("protectedAdmins")) || [];
    if (list.includes(uid))
      return api.sendMessage("ℹ️ That UID is already protected.", threadID, messageID);

    list.push(uid);
    await setData("protectedAdmins", list);

    return api.sendMessage(`✅ UID ${uid} added to protected list.`, threadID, messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error saving to Firebase.", threadID, messageID);
  }
};
