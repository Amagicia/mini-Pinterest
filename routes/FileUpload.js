import { Router } from "express";
import { saveImg, allData } from "../controllers/fileUpload.js";

const router = Router();

router.post("/upload", saveImg);   // Upload file or link
// router.get("/all", allData);       // Show all files

export default router;
