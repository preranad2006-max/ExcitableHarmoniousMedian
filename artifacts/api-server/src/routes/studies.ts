import { Router, type IRouter } from "express";
import {
  AnalyzeStudyParams,
  AnalyzeStudyResponse,
  CreateStudyBody,
  CreateStudyResponse,
  GetStudyParams,
  GetStudyResponse,
  ListStudiesQueryParams,
  ListStudiesResponse,
  UpdateStudyReportBody,
  UpdateStudyReportParams,
  UpdateStudyReportResponse,
} from "@workspace/api-zod";

type Finding = {
  id: string;
  label: string;
  confidence: number;
  severity: "normal" | "low" | "moderate" | "high";
  description: string;
  heatmapRegion: string;
};

type Study = {
  id: string;
  patientId: string;
  patientName: string;
  accessionNumber: string;
  modality: "xray" | "mri";
  bodyPart: string;
  studyDate: string;
  status: "unread" | "review" | "finalized";
  priority: "routine" | "urgent" | "stat";
  imageCount: number;
  imageUrl: string;
  thumbnailUrl?: string;
  modelVersion: string | null;
  inferenceTimeMs: number | null;
  findings: Finding[];
  report: {
    indication: string;
    findings: string;
    impression: string;
    status: "draft" | "finalized";
    updatedAt: string;
  };
};

const demoXray = "/chest-xray-demo.png";
const demoMri = "/brain-mri-demo.png";

const studies: Study[] = [
  {
    id: "ST-2026-004218",
    patientId: "MRN-842019",
    patientName: "Elena Rodriguez",
    accessionNumber: "ACC-884120",
    modality: "xray",
    bodyPart: "Chest PA & Lateral",
    studyDate: "2026-08-24T09:42:00Z",
    status: "review",
    priority: "stat",
    imageCount: 2,
    imageUrl: demoXray,
    thumbnailUrl: demoXray,
    modelVersion: "MedVision CXR v2.4.1",
    inferenceTimeMs: 842,
    findings: [
      {
        id: "f-1",
        label: "Right lower lobe opacity",
        confidence: 0.94,
        severity: "high",
        description: "Focal air-space opacity in the right lower lung zone. Correlate with clinical signs of infection.",
        heatmapRegion: "right lower lobe",
      },
      {
        id: "f-2",
        label: "Small pleural effusion",
        confidence: 0.81,
        severity: "moderate",
        description: "Blunting of the right costophrenic angle suggests a small effusion.",
        heatmapRegion: "right costophrenic angle",
      },
    ],
    report: {
      indication: "Shortness of breath and fever",
      findings: "Right basilar air-space opacity with a small right pleural effusion.",
      impression: "Findings concerning for right lower lobe pneumonia. Small right pleural effusion.",
      status: "draft",
      updatedAt: "2026-08-24T09:46:00Z",
    },
  },
  {
    id: "ST-2026-004217",
    patientId: "MRN-721104",
    patientName: "Marcus Chen",
    accessionNumber: "ACC-884119",
    modality: "mri",
    bodyPart: "Brain MRI w/wo contrast",
    studyDate: "2026-08-24T09:18:00Z",
    status: "unread",
    priority: "urgent",
    imageCount: 184,
    imageUrl: demoMri,
    thumbnailUrl: demoMri,
    modelVersion: "MedVision Neuro v1.8.0",
    inferenceTimeMs: 4210,
    findings: [
      {
        id: "f-3",
        label: "Enhancing lesion",
        confidence: 0.89,
        severity: "high",
        description: "Focal enhancing lesion in the left frontal lobe. Segmentation mask available for review.",
        heatmapRegion: "left frontal lobe",
      },
      {
        id: "f-4",
        label: "Perilesional edema",
        confidence: 0.76,
        severity: "moderate",
        description: "Moderate surrounding T2/FLAIR hyperintensity.",
        heatmapRegion: "left frontal white matter",
      },
    ],
    report: {
      indication: "New onset seizure",
      findings: "Enhancing left frontal lesion with surrounding T2/FLAIR hyperintensity.",
      impression: "Left frontal enhancing lesion. Recommend correlation with prior imaging and neuro-oncology consultation.",
      status: "draft",
      updatedAt: "2026-08-24T09:19:00Z",
    },
  },
  {
    id: "ST-2026-004216",
    patientId: "MRN-665392",
    patientName: "Amina Patel",
    accessionNumber: "ACC-884118",
    modality: "xray",
    bodyPart: "Portable AP Chest",
    studyDate: "2026-08-24T08:55:00Z",
    status: "finalized",
    priority: "routine",
    imageCount: 1,
    imageUrl: demoXray,
    thumbnailUrl: demoXray,
    modelVersion: "MedVision CXR v2.4.1",
    inferenceTimeMs: 716,
    findings: [
      {
        id: "f-5",
        label: "No acute cardiopulmonary abnormality",
        confidence: 0.93,
        severity: "normal",
        description: "No focal consolidation, pleural effusion, or pneumothorax identified.",
        heatmapRegion: "none",
      },
    ],
    report: {
      indication: "Post-procedure line placement",
      findings: "Lungs are clear. Cardiomediastinal silhouette is within normal limits.",
      impression: "No acute cardiopulmonary abnormality.",
      status: "finalized",
      updatedAt: "2026-08-24T09:03:00Z",
    },
  },
  {
    id: "ST-2026-004215",
    patientId: "MRN-394201",
    patientName: "Thomas Williams",
    accessionNumber: "ACC-884117",
    modality: "mri",
    bodyPart: "Brain MRI without contrast",
    studyDate: "2026-08-24T08:21:00Z",
    status: "review",
    priority: "routine",
    imageCount: 152,
    imageUrl: demoMri,
    thumbnailUrl: demoMri,
    modelVersion: "MedVision Neuro v1.8.0",
    inferenceTimeMs: 3870,
    findings: [
      {
        id: "f-6",
        label: "Chronic microvascular changes",
        confidence: 0.72,
        severity: "low",
        description: "Scattered white matter hyperintensities, likely chronic small vessel ischemic change.",
        heatmapRegion: "periventricular white matter",
      },
    ],
    report: {
      indication: "Memory loss",
      findings: "Mild scattered periventricular white matter hyperintensities.",
      impression: "Mild chronic microvascular ischemic changes.",
      status: "draft",
      updatedAt: "2026-08-24T08:34:00Z",
    },
  },
];

const studiesRouter: IRouter = Router();

studiesRouter.get("/studies", (req, res) => {
  const params = ListStudiesQueryParams.parse(req.query);
  const search = params.search?.toLowerCase();
  const data = studies.filter((study) => {
    const statusMatch = !params.status || params.status === "all" || study.status === params.status;
    const modalityMatch = !params.modality || params.modality === "all" || study.modality === params.modality;
    const searchMatch =
      !search ||
      [study.patientName, study.patientId, study.accessionNumber, study.bodyPart]
        .join(" ")
        .toLowerCase()
        .includes(search);
    return statusMatch && modalityMatch && searchMatch;
  });
  res.json(ListStudiesResponse.parse(data));
});

studiesRouter.post("/studies", (req, res) => {
  const input = CreateStudyBody.parse(req.body);
  const now = new Date().toISOString();
  const study: Study = {
    id: `ST-${Date.now()}`,
    patientId: input.patientId,
    patientName: input.patientName,
    accessionNumber: input.accessionNumber,
    modality: input.modality,
    bodyPart: input.bodyPart,
    studyDate: now,
    status: "unread",
    priority: "routine",
    imageCount: input.imageCount,
    imageUrl: input.imageUrl,
    modelVersion: null,
    inferenceTimeMs: null,
    findings: [],
    report: {
      indication: "",
      findings: "",
      impression: "",
      status: "draft",
      updatedAt: now,
    },
  };
  studies.unshift(study);
  res.status(201).json(CreateStudyResponse.parse(study));
});

studiesRouter.get("/studies/:studyId", (req, res) => {
  const { studyId } = GetStudyParams.parse(req.params);
  const study = studies.find((item) => item.id === studyId);
  if (!study) {
    res.status(404).json({ error: "Study not found" });
    return;
  }
  res.json(GetStudyResponse.parse(study));
});

studiesRouter.post("/studies/:studyId/analyze", (req, res) => {
  const { studyId } = AnalyzeStudyParams.parse(req.params);
  const study = studies.find((item) => item.id === studyId);
  if (!study) {
    res.status(404).json({ error: "Study not found" });
    return;
  }
  study.modelVersion = study.modality === "xray" ? "MedVision CXR v2.4.1" : "MedVision Neuro v1.8.0";
  study.inferenceTimeMs = study.modality === "xray" ? 784 : 3940;
  study.status = "review";
  const completedAt = new Date().toISOString();
  res.json(
    AnalyzeStudyResponse.parse({
      studyId,
      modelName: study.modality === "xray" ? "MedVision Chest" : "MedVision Neuro",
      modelVersion: study.modelVersion,
      status: "complete",
      findings: study.findings,
      completedAt,
    }),
  );
});

studiesRouter.patch("/studies/:studyId/report", (req, res) => {
  const { studyId } = UpdateStudyReportParams.parse(req.params);
  const input = UpdateStudyReportBody.parse(req.body);
  const study = studies.find((item) => item.id === studyId);
  if (!study) {
    res.status(404).json({ error: "Study not found" });
    return;
  }
  const updatedAt = new Date().toISOString();
  study.report = {
    indication: input.indication,
    findings: input.findings,
    impression: input.impression,
    status: input.finalize ? "finalized" : "draft",
    updatedAt,
  };
  study.status = input.finalize ? "finalized" : "review";
  res.json(UpdateStudyReportResponse.parse(study));
});

export default studiesRouter;