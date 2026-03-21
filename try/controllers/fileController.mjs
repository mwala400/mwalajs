import fs from 'fs';
import path from 'path';

export const fileController = {
  uploadFile: (req, res) => {
    const file = req.file;
    if (file) {
      const uploadPath = path.join(__dirname, '../public/uploads/', file.originalname);
      fs.writeFileSync(uploadPath, file.buffer);
      res.send('File uploaded successfully');
    } else {
      res.status(400).send('No file uploaded');
    }
  },
};
