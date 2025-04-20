import { parse } from 'gettext-parser';
import { writeFileSync, unlinkSync, createReadStream } from 'fs';

export const config = { api: { bodyParser: false } };

export default async (req, res) => {
  const tempPath = `/tmp/${Date.now()}.po`;
  const chunks = [];
  
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  try {
    const poContent = Buffer.concat(chunks).toString();
    const po = parse(poContent);
    const moPath = tempPath.replace('.po', '.mo');
    
    writeFileSync(moPath, po.compile());
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="output.mo"');
    
    createReadStream(moPath).pipe(res).on('finish', () => {
      unlinkSync(moPath);
    });
  } catch (error) {
    console.error('PO转换失败:', error);
    res.status(500).json({ error: 'PO文件解析失败' });
  }
};
