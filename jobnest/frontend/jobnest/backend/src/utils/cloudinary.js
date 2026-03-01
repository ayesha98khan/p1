const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

async function uploadToCloudinary(buffer, folder, resource_type = "image") {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary not configured");
  }
  const dataUri = `data:${resource_type}/${resource_type === "raw" ? "pdf" : "png"};base64,${buffer.toString(
    "base64"
  )}`;

  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type,
  });
  return res.secure_url;
}

module.exports = { uploadToCloudinary };