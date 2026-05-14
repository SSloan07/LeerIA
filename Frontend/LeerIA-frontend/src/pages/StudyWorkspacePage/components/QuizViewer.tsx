import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { MathText } from "../../../shared/ui/MathText";


import type {
  GeneratedItem,
  QuizContent,
} from "../../../shared/api/generatedItems";

type QuizViewerProps = {
  item: GeneratedItem;
  onBackToChat: () => void;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
};

export function QuizViewer({ item, onBackToChat }: QuizViewerProps) {
  const questions = useMemo(() => getQuizQuestionsFromItem(item), [item]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );

  if (questions.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 text-center">
          <p className="text-lg font-semibold text-zinc-100">
            No hay preguntas disponibles
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            No pude encontrar preguntas válidas en el contenido generado.
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

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = questions.reduce((total, question, index) => {
    return selectedAnswers[index] === question.correct_answer ? total + 1 : total;
  }, 0);

  function handleSelectAnswer(optionIndex: number) {
    if (hasAnswered) return;

    setSelectedAnswers((current) => ({
      ...current,
      [currentIndex]: optionIndex,
    }));
  }

  function handlePrev() {
    setCurrentIndex((current) =>
      current === 0 ? questions.length - 1 : current - 1
    );
  }

  function handleNext() {
    setCurrentIndex((current) =>
      current === questions.length - 1 ? 0 : current + 1
    );
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelectedAnswers({});
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Quiz
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            <MathText text={getItemTitle(item)} />
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Pregunta {currentIndex + 1} de {questions.length}
            <span className="mx-2 text-zinc-600">•</span>
            Puntaje: {score}/{answeredCount || 0}
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

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <article className="w-full max-w-4xl rounded-[2rem] border border-white/[0.08] bg-white/[0.045] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-200">
              Pregunta {currentIndex + 1}
            </span>

            {hasAnswered && (
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                  isCorrect
                    ? "bg-emerald-300/10 text-emerald-200"
                    : "bg-red-400/10 text-red-200",
                ].join(" ")}
              >
                {isCorrect ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {isCorrect ? "Correcta" : "Incorrecta"}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-semibold leading-snug text-zinc-50">
            <MathText text={currentQuestion.question} />
          </h3>

          <div className="mt-7 grid gap-3">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selectedAnswer === optionIndex;
              const isCorrectOption =
                currentQuestion.correct_answer === optionIndex;

              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  onClick={() => handleSelectAnswer(optionIndex)}
                  disabled={hasAnswered}
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                    getOptionClassName({
                      hasAnswered,
                      isSelected,
                      isCorrectOption,
                    }),
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-7 w-7 shrink-0 place-items-center rounded-xl border text-xs font-bold",
                      hasAnswered && isCorrectOption
                        ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                        : hasAnswered && isSelected
                          ? "border-red-400/30 bg-red-400/15 text-red-200"
                          : "border-white/[0.08] bg-black/10 text-zinc-400",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>

                  <span className="text-sm leading-6 text-zinc-200">
                    <MathText text={option} />
                  </span>
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <p className="text-sm font-semibold text-zinc-100">
                Explicación
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                <MathText text={currentQuestion.explanation} />
              </p>
            </div>
          )}
        </article>
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
            onClick={handleReset}
            className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-zinc-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-2xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {questions.map((_, index) => {
            const answered = selectedAnswers[index] !== undefined;
            const correct =
              answered &&
              selectedAnswers[index] === questions[index].correct_answer;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  index === currentIndex
                    ? "scale-125 bg-white"
                    : answered && correct
                      ? "bg-emerald-300"
                      : answered
                        ? "bg-red-300"
                        : "bg-white/20 hover:bg-white/35",
                ].join(" ")}
                aria-label={`Ir a pregunta ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getQuizQuestionsFromItem(item: GeneratedItem): QuizQuestion[] {
  const content = item.content as QuizContent;

  if (!content || !Array.isArray(content.questions)) {
    return [];
  }

  return content.questions.filter((question) => {
    return (
      typeof question.question === "string" &&
      question.question.trim() !== "" &&
      Array.isArray(question.options) &&
      question.options.length >= 2 &&
      typeof question.correct_answer === "number" &&
      question.correct_answer >= 0 &&
      question.correct_answer < question.options.length &&
      typeof question.explanation === "string"
    );
  });
}

function getItemTitle(item: GeneratedItem): string {
  const content = item.content as QuizContent;

  if (content && typeof content.title === "string" && content.title.trim()) {
    return content.title;
  }

  return "Quiz generado";
}

function getOptionClassName({
  hasAnswered,
  isSelected,
  isCorrectOption,
}: {
  hasAnswered: boolean;
  isSelected: boolean;
  isCorrectOption: boolean;
}) {
  if (!hasAnswered) {
    return "border-white/[0.08] bg-white/[0.035] hover:border-emerald-300/30 hover:bg-emerald-300/[0.06]";
  }

  if (isCorrectOption) {
    return "border-emerald-300/30 bg-emerald-300/[0.08]";
  }

  if (isSelected) {
    return "border-red-400/30 bg-red-400/[0.08]";
  }

  return "border-white/[0.06] bg-white/[0.02] opacity-60";
}