// Forgiving comparison for Arabic answers: ignores spaces, punctuation,
// tashkeel, alef/ya/ta-marbuta variants and Arabic-Indic digits.
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function normalizeArabic(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

export function matchesAny(input: string, answers: readonly string[]): boolean {
  const n = normalizeArabic(input);
  if (!n) return false;
  return answers.some((a) => normalizeArabic(a) === n);
}

export function ar(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}
