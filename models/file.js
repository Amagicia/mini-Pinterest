import mongoose from "mongoose";

const FileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    description: { type: String },
    linkurl: { type: String },
    email: {
        type: String,
    },
}, { timestamps: true });

const file = mongoose.model("File", FileSchema);

export default file;
