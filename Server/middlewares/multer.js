import multer from 'multer';

// Use memoryStorage to hold the file as a buffer in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;