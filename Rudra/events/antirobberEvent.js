module.exports.config = {
  name: "antirobberyEvent",
  eventType: ["log:thread-admins", "log:unsubscribe"],
  version: "2.0.3",
  credits: "ChatGPT + NN + Jaylord La Peña",
  description: "Protects specific admins and bot accounts from removal or demotion",
};

// 👑 Protected Admins & Bot UIDs (ilagay lahat ng Facebook ID mo at ng mga bot mo dito)
const PROTECTED_ADMINS = [
  "61559999326713", // Main Admin
  "61563731477181", // Another Protected Admin
  "61578564545419", // Another Bot UID (Protected)
];

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageType, logMessageData, author } = event;

  try {
    const botID = api.getCurrentUserID(); // Current bot UID

    // ✅ Case 1: Protected admin removed as admin
    if (
      logMessageType === "log:thread-admins" &&
      logMessageData.ADMIN_EVENT === "remove_admin" &&
      PROTECTED_ADMINS.includes(logMessageData.TARGET_ID)
    ) {
      const protectedAdmin = logMessageData.TARGET_ID;

      // Demote attacker agad, but not if bot itself
      if (author && author !== botID) {
        await api.changeAdminStatus(threadID, author, false);
      }

      // Ibalik si protected admin
      await api.changeAdminStatus(threadID, protectedAdmin, true);

      // Fetch names for better log messages
      const info = await api.getUserInfo([protectedAdmin, author]);
      const protectedName = info[protectedAdmin]?.name || "Protected Admin";
      const attackerName = info[author]?.name || "Attacker";

      // Notify GC
      api.sendMessage(
        `⚠️ Anti-Robbery Activated!\n\n👑 ${protectedName} has been restored as admin.\n❌ ${
          author !== botID ? `${attackerName} has been demoted for removing a protected admin.` : ""
        }`,
        threadID
      );
    }

    // ✅ Case 2: Protected admin kicked from GC
    if (
      logMessageType === "log:unsubscribe" &&
      PROTECTED_ADMINS.includes(logMessageData.leftParticipantFbId)
    ) {
      const protectedAdmin = logMessageData.leftParticipantFbId;

      // Demote attacker agad, but not if bot itself
      if (author && author !== botID) {
        await api.changeAdminStatus(threadID, author, false);
      }

      // Ibalik sa GC si protected admin
      try {
        await api.addUserToGroup(protectedAdmin, threadID);
        await api.changeAdminStatus(threadID, protectedAdmin, true);
      } catch (err) {
        console.warn(`⚠️ Unable to re-add ${protectedAdmin}:`, err.message);
      }

      // Fetch names
      const info = await api.getUserInfo([protectedAdmin, author]);
      const protectedName = info[protectedAdmin]?.name || "Protected Admin";
      const attackerName = info[author]?.name || "Attacker";

      // Notify GC
      api.sendMessage(
        `⚠️ Anti-Kick Activated!\n\n👑 ${protectedName} has been re-added and restored as admin.\n❌ ${
          author !== botID ? `${attackerName} has been demoted for kicking a protected admin.` : ""
        }`,
        threadID
      );
    }
  } catch (err) {
    console.error("Anti-robbery error:", err);
  }
};
