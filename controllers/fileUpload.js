import File from "../models/file.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadToCloudinary(file) {
  const supportedTypes = [".jpg", ".jpeg", ".png"];
  const fileType = path.extname(file.name).toLowerCase();

  if (!isFileTypeSupported(fileType, supportedTypes)) {
    throw new Error("File type not supported: " + fileType);
  }

  const options = { upload_preset: "file_upload" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export const saveImg = async (req, res) => {
  try {
    let imageUrl = null;

    // Only assign response, don't send anything inside uploadToCloudinary
    if (req.files && req.files.imageUrl) {
      const response = await uploadToCloudinary(req.files.imageUrl);
      imageUrl = response.secure_url;
    }

    // If no file but link is provided
    if (!imageUrl && req.body.linkUrl) {
      imageUrl = req.body.linkUrl;
    }

    // If still no image → reject once
    if (!imageUrl) {
      return res.status(400).send("Please upload a file or provide a link");
    }

    const { name, description } = req.body;

    const newData = new File({
      name,
      imageUrl,
      linkUrl: req.body.linkUrl || null,
      description,
    });

    await newData.save();

    // ✅ Only one response is sent
    return res.redirect("/");  
  } catch (err) {
    console.error("❌ Error saving image:", err);
    // Only one response in error as well
    return res.status(500).send("Server error");
  }
};

/* ------------------------- Fetch All Data ------------------------- */
export const allData = async (req, res) => {
    try {
        const items = await File.find().sort({ createdAt: -1 });
        res.render("alldata", { items });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
