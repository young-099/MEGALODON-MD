//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
//https://whatsapp.com/channel/0029VbAdcIXJP216dKW1253g
// Credits DybyTech - MEGALODON-MD 💜 

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363401051937059@newsletter',
        newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
        serverMessageId: 143,
    },
});

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'No description available.';
        const memberCount = metadata.participants.length;

        for (const user of update.participants) {
            const username = user.split('@')[0];
            const time = new Date().toLocaleString();
            let userPP;

            try {
                userPP = await conn.profilePictureUrl(user, 'image');
            } catch {
                userPP = fallbackPP;
            }

            const sendMessage = async (caption, image = false, mentions = [user]) => {
                const msg = {
                    caption,
                    mentions,
                    contextInfo: getContextInfo({ sender: user }),
                };
                if (image) msg.image = { url: userPP };
                else msg.text = caption;
                await conn.sendMessage(update.id, msg);
            };

            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcome = 
`╭─〔 🎉 *NEW MEMBER* 〕─╮
│👋 Welcome @${username}
│👥 Member Count: *${memberCount}*
│🏷 Group: *${groupName}*
│🕒 Joined: *${time}*
╰──╮
  📌 *Description:* 
  ${groupDesc}
╰────────────────╯`;

                await sendMessage(welcome, true);

            } else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbye = 
`╭─〔 👋 *MEMBER LEFT* 〕─╮
│😢 Goodbye @${username}
│👥 Remaining: *${memberCount}*
│🕒 Time: *${time}*
╰────────────────╯`;

                await sendMessage(goodbye, true);

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];
                const promoteMsg = 
`╭─〔 🔺 *PROMOTION* 〕─╮
│🎖️ @${username} is now an admin
│🙌 Promoted by: @${promoter}
│🕒 Time: *${time}*
╰────────────────╯`;

                await sendMessage(promoteMsg, false, [user, update.author]);

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];
                const demoteMsg = 
`╭─〔 🔻 *DEMOTION* 〕─╮
│⚠️ @${username} is no longer admin
│👎 Demoted by: @${demoter}
│🕒 Time: *${time}*
╰────────────────╯`;

                await sendMessage(demoteMsg, false, [user, update.author]);
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
