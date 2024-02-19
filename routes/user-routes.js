import express from "express"; 
import { getAllusers, login, signup } from "../controllers/user-controller.js";

const router = express.Router(); 

router.get("/", getAllusers);
router.post("/signup", signup ); 
router.post("/login" , login ); 

export default router; 