// import File from "../models/file.js";
// import { v2 as cloudinary } from "cloudinary";

// import { fileURLToPath } from "url";
// import path from "path";
// import { render } from "ejs";
// // Convert current module URL to file path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const LocalFileUpload = (req, res) => {
//     try {
//         /* ------------------------ Fetch filefrom request ------------------------ */
//         const file = req.files.file;

//         /* ---------------------------- connect the path ---------------------------- */

//         // const uploadDir = path.join(__dirname, "files");
//         // console.log(uploadDir);

//         /* --------------------- check if not exists then create -------------------- */

//         // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
//         // const filePath = path.join(uploadDir, Date.now()+ `${file.name.split(".")[1]}`);

//         /* ----------------------------- fetch extention ---------------------------- */
//         const ext = path.extname(file.name); // ".jpg"

//         /* ------------------------------- make a path ------------------------------ */

//         const filePath = path.join(__dirname, "files", Date.now() + ext);

//         console.log("Path is -> ", filePath);

//         /* ------------------------------- size in kb ------------------------------- */
//         const sizeInkb = file.size / 1024;
//         console.log("sizeInKB", sizeInkb); // ~0.133 KB
//         /* ---------------------------- move/copy file to path(destination) --------------------------- */
//         file.mv(filePath, (err) => {
//             if (err) {
//                 console.error("❌ File move failed:", err);
//                 return res
//                     .status(500)
//                     .json({ success: false, message: err.message });
//             }
//             console.log("✅ File created at:", filePath);
//         });
//         console.log("Local File Uploaded Successfully - ", file.name);

//         res.status(200).json({
//             success: true,
//             sizeofFile: sizeInkb,
//             path: filePath,
//             message: "Local File Uploaded Successfully",
//         });
//     } catch (error) {
//         console.log("Error is -> ", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };
// function isFileTypeSupported(type, supportedTypes) {
//     return supportedTypes.includes(type);
// }

// export const ImageUpload = async (req, res) => {
//     console.log("Image Section called");

//     try {
//         console.log(req.body); // { name: "Aman Tiwari", email: "amn@gmail.com" }
//         console.log(req.files); // { imageFile: {...} }
//         /* ------------------------------- Data fetch ------------------------------- */

//         const file = req.files.imageFile;
//         console.log(file);
//         // const linkurl = req.body;
//         // if (!req.files && !linkurl) {
//         //     return res.status(400).send("Please upload an image or provide a link");
//         // }
//         // if (req.files && linkurl) {
//         //     return res.status(400).send("You can upload only image/file or provide link, not both");
//         // }

//         /* ----------------------- validations supported types ---------------------- */
//         const supportedTypes = [".jpg", ".png", ".jpeg"];
//         const fileType = path.extname(file.name).toLowerCase();
//         console.log("fileType -> ", fileType);
//         if (!isFileTypeSupported(fileType, supportedTypes)) {
//             console.log("File type not matching pls cheack ");

//             return res.status(400).json({
//                 success: false,
//                 message: "File Type Not Support",
//                 type_of_file: fileType,
//             });
//         }
//         const options = { upload_preset: "file_upload" };
//         const response = await cloudinary.uploader.upload(
//             file.tempFilePath,
//             options
//         );
//         console.log("Image is Uploaded");
//         return response;
//         // return res.status(200).json({
//         //     success: true,
//         //     response,
//         //     message: "Image is Uploaded ",
//         // });
//     } catch (error) {
//         console.log("error while image uploading !!");

//         console.log(error);
//         return res.status(400).json({
//             success: false,
//             message: "error while image uploading",
//             error: error,
//         });
//     }
// };

// export const saveimg = async (req, res) => {
//     try {
//         const data = await ImageUpload(req,res);
//         console.log("data",data);
//         const { name ,linkurl,description} = req.body;
//         const newData = new File({ name, imageUrl:data.secure_url, linkurl,description });
//         await newData.save();
//         // res.status(200).json({
//         //     success:true,
//         //     data:data,
//         //     url:data.secure_url
//         // })
//         return res.redirect("/"); // redirect to homepage
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error");
//     }
// };
// export const alldata = async (req,res)=>{

// try {
   

//     const items = await File.find().sort({ createdAt: -1 });
//     console.log(items);
//     res.render("alldata", { items });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// }











//     // const result = await File.deleteMany({
//     //     $or: [
//     //       { imageurl: { $exists: false } },  // field does not exist
//     //       { imageurl: "" }                   // field exists but is empty string
//     //     ]
//     //   });
  
//     //   console.log("Deleted documents:", result.deletedCount);
//     // return  res.status(200).json({items});















import File from "../models/file.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

/* ------------------------- Upload to Cloudinary ------------------------- */
async function uploadToCloudinary(file) {
  const supportedTypes = [".jpg", ".jpeg", ".png"];
  const fileType = path.extname(file.name).toLowerCase();

  if (!isFileTypeSupported(fileType, supportedTypes)) {
    throw new Error("File type not supported: " + fileType);
  }

  const options = { upload_preset: "file_upload" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

/* ------------------------- Save Image or Link ------------------------- */
export const saveImg = async (req, res) => {
  try {
    let imageUrl = null;

    // CASE 1: If file is uploaded
    if (req.files && req.files.imageFile) {
      const response = await uploadToCloudinary(req.files.imageFile);
      imageUrl = response.secure_url;
    }

    // CASE 2: If no file but a link is provided
    if (!imageUrl && req.body.linkUrl) {
      imageUrl = req.body.linkUrl;
    }

    // If still no image → reject
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
    return res.redirect("/"); // Redirect to home after upload
  } catch (err) {
    console.error("❌ Error saving image:", err);
    res.status(500).send("Server error");
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
