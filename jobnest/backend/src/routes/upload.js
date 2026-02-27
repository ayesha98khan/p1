const router = require("express").Router();
const multer = require("multer");
const { uploadToCloudinary } = require("../utils/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const url = await uploadToCloudinary(req.file.buffer, "jobnest/images", "image");
    res.json({ url });
  } catch (e) {
    next(e);
  }
});

router.post("/resume", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    // resume as "raw" is best (pdf/doc)
    const url = await uploadToCloudinary(req.file.buffer, "jobnest/resumes", "raw");
    res.json({ url });
  } catch (e) {
    next(e);
  }
});

module.exports = router;