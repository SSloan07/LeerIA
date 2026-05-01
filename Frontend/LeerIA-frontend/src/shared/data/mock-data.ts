import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  FileText,
  FolderOpen,
  HelpCircle,
  Layers3,
  Network,
  PlaySquare,
  Sigma,
  Sparkles,
  Video,
} from "lucide-react";

export type Subject = {
  id: string;
  name: string;
  documents: number;
  status: string;
  icon: LucideIcon;
  iconClassName: string;
};

export type RecentFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  badge: string;
  badgeClassName: string;
};

export type StudyMetric = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const appConfig = {
  name: "StudyRAG AI",
  user: {
    name: "Simón Sloan",
    plan: "Plan Pro",
    initials: "SS",
  },
};

export const subjects: Subject[] = [
  {
    id: "telematica",
    name: "Telemática",
    documents: 12,
    status: "Activa",
    icon: Network,
    iconClassName: "bg-emerald-400/15 text-emerald-300",
  },
  {
    id: "calculo-3",
    name: "Cálculo 3",
    documents: 8,
    status: "Disponible",
    icon: Sigma,
    iconClassName: "bg-violet-400/15 text-violet-300",
  },
  {
    id: "proyecto-2",
    name: "Proyecto 2",
    documents: 6,
    status: "Disponible",
    icon: FolderOpen,
    iconClassName: "bg-orange-400/15 text-orange-300",
  },
  {
    id: "estadistica-multivariada",
    name: "Estadística Multivariada",
    documents: 7,
    status: "Disponible",
    icon: BarChart3,
    iconClassName: "bg-blue-400/15 text-blue-300",
  },
];

export const recentFiles: RecentFile[] = [
  {
    id: "file-1",
    name: "Apuntes_Telemática.pdf",
    type: "PDF",
    size: "12 MB",
    date: "Hoy",
    badge: "PDF",
    badgeClassName: "border-red-400/20 bg-red-500/15 text-red-300",
  },
  {
    id: "file-2",
    name: "Ejercicios_redes.docx",
    type: "DOCX",
    size: "2.1 MB",
    date: "Ayer",
    badge: "DOC",
    badgeClassName: "border-blue-400/20 bg-blue-500/15 text-blue-300",
  },
  {
    id: "file-3",
    name: "Capas_OSI.pptx",
    type: "PPTX",
    size: "4.3 MB",
    date: "3 días",
    badge: "PPT",
    badgeClassName: "border-orange-400/20 bg-orange-500/15 text-orange-300",
  },
  {
    id: "file-4",
    name: "Práctica_tráfico.xlsx",
    type: "XLSX",
    size: "1.7 MB",
    date: "5 días",
    badge: "XLS",
    badgeClassName: "border-emerald-400/20 bg-emerald-500/15 text-emerald-300",
  },
];

export const detectedTopics = [
  "Introducción a las redes",
  "Modelo OSI y TCP/IP",
  "Direccionamiento IP",
  "Enrutamiento y protocolos",
  "Seguridad en redes",
];

export const studyMetrics: StudyMetric[] = [
  {
    id: "topics",
    value: "5",
    label: "temas detectados",
    description: "Estructura del contenido",
    icon: BookOpen,
    iconClassName: "bg-emerald-400/15 text-emerald-300",
  },
  {
    id: "questions",
    value: "12",
    label: "preguntas generadas",
    description: "Para tu quiz",
    icon: HelpCircle,
    iconClassName: "bg-violet-400/15 text-violet-300",
  },
  {
    id: "video",
    value: "1",
    label: "video listo",
    description: "Explicación en minutos",
    icon: PlaySquare,
    iconClassName: "bg-orange-400/15 text-orange-300",
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "summary",
    label: "Resumir",
    icon: FileText,
  },
  {
    id: "quiz",
    label: "Crear quiz",
    icon: HelpCircle,
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: Layers3,
  },
  {
    id: "video",
    label: "Generar video",
    icon: Video,
  },
];

export const productHighlights = [
  {
    id: "secure",
    icon: Sparkles,
    label: "Tutor IA basado en tus documentos",
  },
];