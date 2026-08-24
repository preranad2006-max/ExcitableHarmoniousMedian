import { Router, type IRouter } from "express";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";

const dashboardRouter: IRouter = Router();

dashboardRouter.get("/dashboard/summary", (_req, res) => {
  res.json(
    GetDashboardSummaryResponse.parse({
      studiesToday: 38,
      pendingReview: 12,
      statStudies: 3,
      finalizedToday: 26,
      avgTurnaroundMinutes: 18.4,
      modalityMix: [
        { label: "Chest X-ray", value: 24 },
        { label: "Brain MRI", value: 14 },
      ],
      activity: [
        { label: "06:00", value: 2 },
        { label: "08:00", value: 7 },
        { label: "10:00", value: 12 },
        { label: "12:00", value: 9 },
        { label: "14:00", value: 8 },
      ],
    }),
  );
});

export default dashboardRouter;