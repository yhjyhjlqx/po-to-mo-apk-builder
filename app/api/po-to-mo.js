import { createWriteStream, unlinkSync } from 'fs';
import polib from 'polib';
export const config = { api: { bodyParser: false } };
export default (req, res) => {
  const tempPath = `/tmp/${Date.now()}.po`;
  req.pipe(createWriteStream(tempPath)).on('finish', () => {
    const po = polib.pofile(tempPath);
    const moPath = tempPath.replace('.po', '.mo');
    po.save_as_mofile(moPath);
    res.setHeader('Content-Disposition', 'attachment; filename="output.mo"');
    require('fs').createReadStream(moPath).pipe(res);
    [tempPath, moPath].forEach(f => unlinkSync(f));
  });
};
