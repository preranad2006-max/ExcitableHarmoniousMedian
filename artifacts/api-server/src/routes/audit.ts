import { Router, type IRouter } from "express";
import { ListAuditEventsResponse } from "@workspace/api-zod";

const auditRouter: IRouter = Router();

auditRouter.get("/audit-events", (_req, res) => {
  res.json(
    ListAuditEventsResponse.parse([
      {
        id: "evt-1",
        action: "Report finalized",
        actor: "Dr. Maya Singh",
        timestamp: "2026-08-24T09:03:00Z",
        detail: "Finalized ACC-884118 · Portable AP Chest",
      },
      {
        id: "evt-2",
        action: "AI analysis completed",
        actor: "MedVision AI",
        timestamp: "2026-08-24T08:57:00Z",
        detail: "MedVision CXR v2.4.1 · 716 ms inference",
      },
      {
        id: "evt-3",
        action: "Study opened",
        actor: "Dr. Maya Singh",
        timestamp: "2026-08-24T08:34:00Z",
        detail: "Reviewed MRN-394201 · Brain MRI without contrast",
      },
      {
        id: "evt-4",
        action: "Study uploaded",
        actor: "Radiology intake",
        timestamp: "2026-08-24T08:21:00Z",
        detail: "ACC-884117 · 152 image series",
      },
      {
        id: "evt-5",
        action: "AI analysis completed",
        actor: "MedVision AI",
        timestamp: "2026-08-24T08:18:00Z",
        detail: "MedVision Neuro v1.8.0 · 3.87 s inference",
      },
    ]),
  );
});

export default auditRouter;