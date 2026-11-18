export type InterviewQuestion = {
  id: string;
  text: string;
  asked: boolean;
};

export const STORAGE_KEY = "interview-shortlist.v1";

export type ParseResult = {
  questions: InterviewQuestion[];
  reset: boolean;
  dropped: number;
};

export function parseStoredQuestions(raw: string | null): ParseResult {
  if (raw === null) {
    return { questions: [], reset: false, dropped: 0 };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { questions: [], reset: true, dropped: 0 };
  }

  if (!Array.isArray(parsed)) {
    return { questions: [], reset: true, dropped: 0 };
  }

  const questions: InterviewQuestion[] = [];
  const seenIds = new Set<string>();
  let dropped = 0;

  for (const item of parsed) {
    if (typeof item !== "object" || item === null) {
      dropped += 1;
      continue;
    }
    const candidate = item as { id?: unknown; text?: unknown; asked?: unknown };
    const id = typeof candidate.id === "string" ? candidate.id : "";
    const text = typeof candidate.text === "string" ? candidate.text : "";
    if (id.length === 0 || text.trim().length === 0 || seenIds.has(id)) {
      dropped += 1;
      continue;
    }
    seenIds.add(id);
    questions.push({
      id,
      text,
      asked: candidate.asked === true,
    });
  }

  return { questions, reset: false, dropped };
}
