import { Router } from "express";
import { saveImg, allData } from "../controllers/fileUpload.js";

const router = Router();

// POST /upload  → handles file upload
router.post("/", saveImg);

// GET /upload/all → show all files
router.get("/all", allData);

export default router;

// Cannot GET /upload/upload