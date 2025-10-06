import { v2 as cloudinary } from "cloudinary";

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
        console.log("✅ Cloudinary connected");
        
    } catch (error) {
        console.log(error);
    }
};
export default cloudinaryConnect;

// # CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dv10qiuta
