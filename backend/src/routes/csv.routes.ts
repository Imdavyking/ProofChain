import express from "express";
import { processCSVUpload } from "../controllers/csv.controllers";

const csvRoutes = express.Router();
csvRoutes.post("/", processCSVUpload);
export default csvRoutes;
