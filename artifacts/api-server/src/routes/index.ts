import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studiesRouter from "./studies";
import dashboardRouter from "./dashboard";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studiesRouter);
router.use(dashboardRouter);
router.use(auditRouter);

export default router;
