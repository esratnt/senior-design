// controllers/video.js
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const storage = new Storage({
  projectId: "5cd3d7416bb34b4f32bae6582a2c32c4965d673b",
  keyFilename:
    "/Users/esra/Desktop/b2b/auth/server/aerobic-botany-423409-m4-5cd3d7416bb3.json",
});
const bucket = storage.bucket("ekiptakip");

const multer = Multer({
  storage: Multer.memoryStorage(),
});

exports.upload = multer.single("video");
exports.uploadVideo = (req, res) => {
  const { category, subcategory } = req.body;

  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }

  if (!category) {
    console.error("No category specified.");
    return res.status(400).send("No category specified.");
  }

  const path = subcategory ? `${category}/${subcategory}` : category;
  const blob = bucket.file(`${path}/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    console.error("Blob stream error:", err);
    res.status(500).send({ message: err.message });
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    console.log("File successfully uploaded to", publicUrl);
    res.status(200).send({ url: publicUrl });
  });

  console.log("Uploading file to path:", `${path}/${req.file.originalname}`);
  blobStream.end(req.file.buffer);
};

exports.listVideosByCategory = async (req, res) => {
  const { category, subcategory } = req.params;
  const path = subcategory ? `${category}/${subcategory}` : category;

  try {
    const [files] = await bucket.getFiles({
      prefix: `${path}/`,
    });

    const videoUrls = files.map((file) => {
      return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    });

    res.status(200).json(videoUrls);
  } catch (err) {
    console.error("Error listing videos by category:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();

    const categories = new Set();
    files.forEach((file) => {
      const [category, subcategory] = file.name.split("/");
      if (category) {
        categories.add(category);
      }
      if (subcategory) {
        categories.add(`${category}/${subcategory}`);
      }
    });

    res.status(200).json([...categories]);
  } catch (err) {
    console.error("Error listing categories:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  const { category, subcategory } = req.body;

  if (!category) {
    return res.status(400).send("No category specified.");
  }

  const path = subcategory ? `${category}/${subcategory}` : category;
  const file = bucket.file(`${path}/.placeholder`);

  try {
    await file.save("");
    res.status(201).send({ message: "Category created." });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).send({ message: err.message });
  }
};
