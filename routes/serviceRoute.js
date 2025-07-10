import express from "express";
import {
  listServices,
  addService,
  removeService,
  singleService,
} from "../controllers/serviceController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const serviceRouter = express.Router();

//upload for sending multiple images using the middleware
serviceRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addService
);
serviceRouter.post("/remove", adminAuth, removeService);
serviceRouter.post("/single", singleService);
serviceRouter.get("/list", listServices);

export default serviceRouter;
