import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

import type {
  FlashcardsContent,
  GeneratedItem,
} from "../../../shared/api/generatedItems";

type FlashcardsViewerProps = {
  item: GeneratedItem;
  onBackToChat: () => void;
};

type Flashcard = {
  front: string;
  back: string;
};

export function FlashcardsViewer({
  item,
  onBackToChat,
}: FlashcardsViewerProps) {
  const cards = useMemo(() => getFlashcardsFromItem(item), [item]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [item.id]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
          <p className="text-lg font-semibold text-zinc-100">
            No hay flashcards disponibles
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            No pude encontrar tarjetas válidas en el contenido generado.
          </p>

          <button
            type="button"
            onClick={onBackToChat}
            className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Volver al chat
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  function handlePrev() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  function handleNext() {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function handleFlip() {
    setIsFlipped((prev) => !prev);
  }

  function handleReset() {
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Flashcards
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            {getItemTitle(item)}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Tarjeta {currentIndex + 1} de {cards.length}
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToChat}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
        >
          Volver al chat
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-4xl [perspective:1400px]">
            <button
              type="button"
              onClick={handleFlip}
              className="group block w-full text-left"
            >
              <div
                className={[
                  "relative h-[430px] w-full rounded-[2rem] transition-transform duration-700 [transform-style:preserve-3d]",
                  isFlipped ? "[transform:rotateY(180deg)]" : "",
                ].join(" ")}
              >
                {/* Front */}
                <div className="absolute inset-0 rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-300/[0.10] via-white/[0.05] to-cyan-300/[0.06] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] [backface-visibility:hidden]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-200">
                        Frente
                      </span>

                      <span className="text-xs text-zinc-400">
                        Haz clic para voltear
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                      <p className="max-w-3xl text-center text-3xl font-semibold leading-[1.35] text-zinc-50">
                        {currentCard.front}
                      </p>
                    </div>

                    <p className="text-center text-sm text-zinc-400">
                      Piensa la respuesta antes de girar la tarjeta.
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.10] via-white/[0.05] to-emerald-300/[0.06] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200">
                        Respuesta
                      </span>

                      <span className="text-xs text-zinc-400">
                        Haz clic para volver
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                      <p className="max-w-3xl text-center text-xl leading-8 text-zinc-100">
                        {currentCard.back}
                      </p>
                    </div>

                    <p className="text-center text-sm text-zinc-400">
                      Repasa esta idea y pasa a la siguiente tarjeta.
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>

            <button
              type="button"
              onClick={handleFlip}
              className="rounded-2xl bg-emerald-300 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
            >
              Voltear
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                }}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  index === currentIndex
                    ? "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.45)]"
                    : "bg-white/20 hover:bg-white/35",
                ].join(" ")}
                aria-label={`Ir a tarjeta ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getFlashcardsFromItem(item: GeneratedItem): Flashcard[] {
  const content = item.content as FlashcardsContent;

  if (!content || !Array.isArray(content.cards)) {
    return [];
  }

  return content.cards.filter(
    (card) =>
      typeof card.front === "string" &&
      card.front.trim() !== "" &&
      typeof card.back === "string" &&
      card.back.trim() !== ""
  );
}

function getItemTitle(item: GeneratedItem): string {
  const content = item.content as FlashcardsContent;

  if (content && typeof content.title === "string" && content.title.trim()) {
    return content.title;
  }

  return "Flashcards generadas";
}