import { parse } from 'gettext-parser';
import { writeFileSync, unlinkSync } from 'fs';

export const config = { api: { bodyParser: false } };

export default async (req, res) => {
  const tempPath = `/tmp/${Date.now()}.po`;
  const chunks = [];
  
  for await (const chunk of req) chunks.push(chunk);
  const poContent = Buffer.concat(chunks).toString();

  try {
    const moPath = tempPath.replace('.po', '.mo');
    writeFileSync(moPath, parse(poContent).compile());
    
    res.setHeader('Content-Disposition', 'attachment; filename="output.mo"');
    require('fs').createReadStream(moPath).pipe(res);
    unlinkSync(moPath); // 🔥 安全清理
  } catch (error) {
    res.status(500).json({ error: "Conversion failed" });
  }
};
