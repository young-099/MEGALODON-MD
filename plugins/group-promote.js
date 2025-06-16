const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "addadmin"],
    desc: "Promotes a group member to admin",
    category: "group",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Check if the user is an admin
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    // Check if the bot is an admin
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return reply("❌ Please reply to a message or provide a number to promote.");
    }

    // Prevent promoting the bot itself
    if (number === botNumber) return reply("❌ I am already an admin.");

    const jid = number + "@s.whatsapp.net";

    // Check if user is already an admin
    if (groupAdmins.includes(jid)) return reply("❌ This user is already an admin.");

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        reply(`✅ Successfully promoted @${number} to group admin.`, { mentions: [jid] });
    } catch (error) {
        console.error("Promote command error:", error);
        reply(`❌ Failed to promote the member.\n\nError: ${error?.message || error}`);
    }
});
