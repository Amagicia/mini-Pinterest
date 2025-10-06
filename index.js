import "./config/env.js";

import express from "express";
import connect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.mjs";
import fileUpload from "express-fileupload";
const app = express();
app.set('view engine', 'ejs');

app.use(express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,          // optional, stores in temp folder first
    tempFileDir: '/tmp/',        // temp directory
    createParentPath: true       // auto-create folder if not exists
  }));
//   tempFilePath
const PORT = process.env.PORT || 4000;

//Routes for mount
import upload from "./routes/FileUpload.js";
app.use("/upload", upload);

import { allData } from "./controllers/fileUpload.js";
app.get("/",allData)
app.get("/mainpage", (req, res) => {
    res.render("main"); // main.ejs inside views folder
  });


connect()
    .then(() => {
        cloudinaryConnect();
        app.listen(PORT, () => {
            console.log(`✅ Server Running At http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
