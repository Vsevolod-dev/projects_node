import express from "express";
const router = express.Router();
import ProfileRouter from "./ProfileRouter";
import ProjectRouter from "./ProjectRouter";
import applyExtraSetup from "../../sequelize/extra-setup";
/* router.use("/websites", checkAuth, require("./websites"));
router.use("/languages", checkAuth, require("./languages")); */
import sequelize from "../../sequelize";
applyExtraSetup(sequelize)

router.use("/profile", ProfileRouter);
router.use("/projects", ProjectRouter);

export default router;
