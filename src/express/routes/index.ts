import express from "express";

import ProfileRouter from "./ProfileRouter";
import ProjectRouter from "./ProjectRouter";
import AuthRouter from "./AuthRouter";
import fileRouter from "./fileRouter";

import applyExtraSetup from "../../sequelize/extra-setup";
import sequelize from "../../sequelize";
import checkAuth from "../middleware/authMiddleware";


const router = express.Router();
applyExtraSetup(sequelize)

router.use("/profile", checkAuth, ProfileRouter);
router.use("/projects", ProjectRouter);
router.use("/auth", AuthRouter);
router.use("/", fileRouter);

export default router;
