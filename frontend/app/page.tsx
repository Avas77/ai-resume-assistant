"use client";

import { useState } from "react";
import {generateBullets} from "@/app/api/ollama-apis";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setResult("");

    if (!jobDescription.trim() || !experience.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateBullets(jobDescription, experience)
      if(response.status != 200) {
        throw new Error("Something went wrong....")
      }

      setResult(response.data.bullets);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate bullets.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            AI Resume Assistant
          </h1>
          <p className="mb-8 text-gray-600">
            Paste a job description and your experience to generate tailored resume bullets.
          </p>

          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-45 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Your Experience
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Paste your projects, work experience, or resume points here..."
                className="min-h-45 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Resume Bullets"}
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-800">
                Latest Output
              </label>
              <div className="min-h-55 whitespace-pre-wrap rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-800">
                {result || "Generated bullets will appear here."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}