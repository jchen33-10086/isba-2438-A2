"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STORAGE_KEY,
  parseStoredQuestions,
  type InterviewQuestion,
} from "./questions";

const inputClasses =
  "h-11 w-full flex-1 rounded-lg border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-zinc-50";

const primaryButtonClasses =
  "rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80";

const secondaryButtonClasses =
  "rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900";

const dangerButtonClasses =
  "rounded-full border border-red-300 px-5 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `q-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = useCallback(() => {
    let raw: string | null = null;
    let available = true;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      available = false;
    }
    setStorageAvailable(available);
    const result = parseStoredQuestions(raw);
    setQuestions(result.questions);
    if (result.reset) {
      setNotice("Saved questions could not be read, so the list was reset.");
    } else if (result.dropped > 0) {
      setNotice(
        `${result.dropped} saved item${result.dropped === 1 ? "" : "s"} had an invalid shape and were removed.`
      );
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    queueMicrotask(() => load());
  }, [load]);

  const persist = useCallback((next: InterviewQuestion[]): boolean => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageAvailable(true);
      return true;
    } catch {
      setStorageAvailable(false);
      setNotice(
        "Changes could not be saved because browser storage is unavailable."
      );
      return false;
    }
  }, []);

  function addQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = newText.trim();
    if (text.length === 0) {
      setError("Question cannot be blank.");
      return;
    }
    setError("");
    const next = [...questions, { id: createId(), text, asked: false }];
    setQuestions(next);
    if (persist(next)) {
      setNotice("Question added to your shortlist.");
    }
    setNewText("");
  }

  function startEdit(question: InterviewQuestion) {
    setEditingId(question.id);
    setEditText(question.text);
    setError("");
    setNotice("");
  }

  function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) {
      return;
    }
    const text = editText.trim();
    if (text.length === 0) {
      setError("Question cannot be blank.");
      return;
    }
    const next = questions.map((question) =>
      question.id === editingId ? { ...question, text } : question
    );
    setQuestions(next);
    if (persist(next)) {
      setNotice("Question updated.");
    }
    setEditingId(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setError("");
  }

  function toggleAsked(question: InterviewQuestion) {
    const next = questions.map((item) =>
      item.id === question.id ? { ...item, asked: !item.asked } : item
    );
    setQuestions(next);
    if (persist(next)) {
      setNotice(question.asked ? "Marked as not asked." : "Marked as asked.");
    }
  }

  function removeQuestion(question: InterviewQuestion) {
    const next = questions.filter((item) => item.id !== question.id);
    setQuestions(next);
    if (persist(next)) {
      setNotice("Question removed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!storageAvailable && (
        <div
          role="alert"
          className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
        >
          Browser storage is unavailable, so changes will not be saved after
          you leave this page.
        </div>
      )}

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400"
      >
        {notice}
      </p>

      <form onSubmit={addQuestion} className="flex flex-col gap-2">
        <label htmlFor="new-question" className="text-sm font-medium">
          Add a personal interview question
        </label>
        <div className="flex gap-2">
          <input
            id="new-question"
            name="new-question"
            type="text"
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            placeholder="e.g. What is your biggest strength?"
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={!loaded}
            className={`${primaryButtonClasses} shrink-0 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Add
          </button>
        </div>
      </form>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {!loaded ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Loading your questions...
        </p>
      ) : questions.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No questions on your shortlist yet. Add your first one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {questions.map((question) => (
            <li
              key={question.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {editingId === question.id ? (
                <form onSubmit={saveEdit} className="flex flex-col gap-2">
                  <label
                    htmlFor={`edit-question-${question.id}`}
                    className="text-sm font-medium"
                  >
                    Edit question
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`edit-question-${question.id}`}
                      type="text"
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      className={inputClasses}
                    />
                    <button
                      type="submit"
                      className={`${primaryButtonClasses} shrink-0`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className={`${secondaryButtonClasses} shrink-0`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={
                        question.asked
                          ? "text-sm text-zinc-500 line-through dark:text-zinc-500"
                          : "text-sm"
                      }
                    >
                      {question.text}
                    </span>
                    {question.asked && (
                      <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-950/40 dark:text-green-400">
                        Asked
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAsked(question)}
                      aria-pressed={question.asked}
                      className={secondaryButtonClasses}
                    >
                      {question.asked ? "Mark as not asked" : "Mark as asked"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(question)}
                      className={secondaryButtonClasses}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question)}
                      aria-label={`Remove question: ${question.text}`}
                      className={dangerButtonClasses}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
