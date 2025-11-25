import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [order, setOrder] = useState([]);
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    recalcScore();
  }, [answers]);

  function loadQuestions() {
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) return alert("JSON must be an array of questions");
      const clean = data.map((q, idx) => ({
        id: q.id ?? idx + 1,
        type: q.type ?? "mcq",
        question: q.question ?? `Question ${idx + 1}`,
        options: q.options ?? ["True", "False"],
        answer: typeof q.answer === "number" ? q.answer : 0,
        explanation: q.explanation ?? "",
      }));
      setQuestions(clean);
      setOrder(clean.map((_, i) => i));
      setIndex(0);
      setAnswers({});
      setScore(0);
    } catch (e) {
      alert("Invalid JSON");
    }
  }

  function choose(q, i) {
    if (answers[q.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [q.id]: i }));
  }

  function recalcScore() {
    let s = 0;
    questions.forEach((q) => {
      const a = answers[q.id];
      if (a === q.answer) s++;
    });
    setScore(s);
  }

  if (!questions.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="p-4">
          <h1 className="text-xl font-bold mb-2">React Quiz App</h1>
          <textarea
            className="w-full p-2 border rounded bg-transparent"
            rows={10}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste questions JSON here"
          />
          <Button className="mt-3 w-full" onClick={loadQuestions}>Load Questions</Button>
        </Card>
      </div>
    );
  }

  const q = questions[order[index]];
  const chosen = answers[q.id];

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-400 mb-2">Question {index + 1} / {questions.length}</div>
          <h2 className="text-lg font-semibold mb-4">{q.question}</h2>

          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => choose(q, i)}
                className={`p-3 rounded-xl border text-left transition-all
                  ${chosen === undefined ? "" : i === q.answer
                    ? "border-green-500/40 bg-green-500/10"
                    : chosen === i
                    ? "border-red-500/40 bg-red-500/10"
                    : "opacity-50"}`}
                disabled={chosen !== undefined}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </motion.button>
            ))}
          </div>

          {chosen !== undefined && (
            <div className="mt-3 text-sm text-gray-300">
              {chosen === q.answer ? (
                <span className="text-green-400 font-semibold">Correct!</span>
              ) : (
                <span className="text-red-400 font-semibold">Wrong.</span>
              )}
              {q.explanation && <div className="text-gray-400 mt-1">{q.explanation}</div>}
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => setIndex(Math.min(index + 1, questions.length - 1))}
              disabled={index === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-sm text-gray-400">Score</div>
          <div className="text-3xl font-bold">{score} / {questions.length}</div>
          <div className="mt-2 text-gray-400">{Math.round((score / questions.length) * 100)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
