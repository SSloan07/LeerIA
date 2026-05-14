import { Fragment } from "react";
import { InlineMath, BlockMath } from "react-katex";

type MathTextProps = {
  text: string;
  className?: string;
};

function looksLikeUndelimitedMath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return false;

  const hasLatexCommand =
    /\\(nabla|varphi|phi|theta|alpha|beta|gamma|int|iint|iiint|oint|cdot|times|div|frac|sqrt|sum|lim|partial|mathbf|operatorname)/.test(
      trimmed
    );

  const hasMathSymbols = /[∫∇≤≥≠≈±∞×·]/.test(trimmed);

  const hasEquation = /=/.test(trimmed);

  const isMostlyFormula =
    /^[\sA-Za-z0-9\\{}()[\]^_+\-*/=.,:;∫∇≤≥≠≈±∞×·]+$/.test(trimmed);

  return (hasLatexCommand || hasMathSymbols) && (hasEquation || isMostlyFormula);
}

function normalizeMathExpression(value: string) {
  return value
    .replaceAll("rot", "\\operatorname{rot}")
    .replaceAll("div", "\\operatorname{div}")
    .replaceAll("grad", "\\operatorname{grad}");
}

export function MathText({ text, className }: MathTextProps) {
  const mathRegex = /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

  const parts = text.split(mathRegex).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isBlockMath = part.startsWith("\\[") && part.endsWith("\\]");
        const isInlineMath = part.startsWith("\\(") && part.endsWith("\\)");

        if (isBlockMath) {
          const math = part.slice(2, -2).trim();

          return <BlockMath key={`${part}-${index}`} math={math} />;
        }

        if (isInlineMath) {
          const math = part.slice(2, -2).trim();

          return <InlineMath key={`${part}-${index}`} math={math} />;
        }

        if (looksLikeUndelimitedMath(part)) {
          return (
            <InlineMath
              key={`${part}-${index}`}
              math={normalizeMathExpression(part)}
            />
          );
        }

        return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
      })}
    </span>
  );
}