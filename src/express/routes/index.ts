import express from "express";
const router = express.Router();
import ProfileRouter from "./ProfileRouter";
import ProjectRouter from "./ProjectRouter";
import AuthRouter from "./AuthRouter";
import applyExtraSetup from "../../sequelize/extra-setup";
import sequelize from "../../sequelize";
import checkAuth from "../middleware/authMiddleware";


applyExtraSetup(sequelize)

router.use("/profile", checkAuth, ProfileRouter);
router.use("/projects", ProjectRouter);
router.use("/auth", AuthRouter);

export default router;
