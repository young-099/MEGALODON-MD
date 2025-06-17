const { cmd } = require("../command");

cmd({
  pattern: "vcf",
  alias: ["contacts", "groupvcf"],
  desc: "Generate a VCF file with all group members (Owner only).",
  category: "tools",
  react: "📇",
  filename: __filename
}, async (conn, m, store, { from, isGroup, reply, isOwner }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isOwner) return reply("❌ This command is restricted to the bot owner.");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const metadata = await conn.groupMetadata(from);
    const participants = metadata.participants;

    let vcfContent = "";

    participants.forEach((p, i) => {
      const number = p.id.split("@")[0];
      const name = store.contacts[p.id]?.name || p?.notify || `Group Contact ${i + 1}`;
      const safeName = name.replace(/[^\w\s\-]/g, ""); // sanitize name

      vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${safeName}
N:${safeName};;;;
TEL;type=CELL;waid=${number}:+${number}
END:VCARD
`;
    });

    await conn.sendMessage(
      from,
      {
        document: Buffer.from(vcfContent, "utf-8"),
        mimetype: "text/vcard",
        fileName: "MEGALODON_MD.vcf"
      },
      { quoted: m }
    );

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    await reply(`✅ VCF file generated with ${participants.length} contacts.`);

  } catch (err) {
    console.error("❌ VCF Error:", err);
    reply("An error occurred while generating the VCF file.");
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});
