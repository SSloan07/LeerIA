import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { AppSidebar } from "../../widgets/AppSidebar/AppSidebar";
import { ChatComposer } from "../../widgets/ChatComposer/ChatComposer";
import { RightInspector } from "../../widgets/RightInspector/RightInspector";
import { UploadHero } from "../../widgets/UploadHero/UploadHero";
import type { Subject } from "../../shared/data/mock-data";
import { getSubjects, type ApiSubject } from "../../shared/api/subjects";

function mapApiSubjectToSidebarSubject(subject: ApiSubject): Subject {
  return {
    id: subject.id,
    name: subject.name,
    documents: 0,
    status: "Activa",
    icon: BookOpen,
    iconClassName: "bg-emerald-400/15 text-emerald-300",
  };
}

export function StudyWorkspacePage() {
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>();
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const apiSubjects = await getSubjects();
        const sidebarSubjects = apiSubjects.map(mapApiSubjectToSidebarSubject);

        setSubjects(sidebarSubjects);

        if (sidebarSubjects.length > 0) {
          setSelectedSubjectId(sidebarSubjects[0].id);
        }
      } catch (error) {
        console.error("Error cargando materias:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080B10] text-zinc-100">
      <BackgroundEffects />

      <div className="relative z-10 grid min-h-screen grid-cols-[300px_1fr_360px] gap-4 p-4">
        <AppSidebar
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={setSelectedSubjectId}
        />

        <main className="flex min-w-0 flex-col rounded-[2rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <section className="flex min-h-0 flex-1 items-center justify-center px-8 py-10">
            {isLoadingSubjects ? (
              <p className="text-sm text-zinc-400">Cargando materias...</p>
            ) : (
              <UploadHero />
            )}
          </section>

          <div className="border-t border-white/[0.08] px-6 py-5">
            <ChatComposer />
          </div>
        </main>

        <RightInspector />
      </div>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-10rem] top-[8rem] h-[26rem] w-[26rem] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.055),transparent_32rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18rem)]" />
    </div>
  );
}