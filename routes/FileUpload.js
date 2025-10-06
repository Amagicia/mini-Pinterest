import { Router } from "express";
// ImageUpload,VideoUpload,ImageReduceUpload,
import { alldata,saveimg,LocalFileUpload ,ImageUpload} from "../controllers/fileUpload.js";
const routes = Router();

routes.post("/LocalFileUpload", LocalFileUpload);

routes.post("/ImageUpload", ImageUpload);
routes.post("/save", saveimg);
// routes.get("/alldata", alldata);
export default routes;
