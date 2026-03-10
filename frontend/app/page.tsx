"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const generateBullets = async () => {
    setError(null)
    setResult("")
    if (!jobDescription.trim() || !experience.trim()) {
      setError(new Error("Please fill in all required fields"))
      return
    }
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/generate-bullets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
          experience: experience
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }
      setResult(data.bullets);
    } catch (err){
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Failed to generate bullets."));
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">AI Resume Assistant</h1>
        <p className="text-gray-600 mb-8">
          Paste a job description and your experience to generate tailored resume bullets.
        </p>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full min-h-45 rounded-lg border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Experience
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Paste your projects, work experience, or resume points here..."
              className="w-full min-h-45 rounded-lg border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            className="w-fit rounded-lg bg-black px-5 py-3 text-white hover:opacity-90"
            onClick={generateBullets}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Resume Bullets"}
          </button>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error?.message}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Output</label>
            <div className="min-h-45 rounded-lg border border-gray-300 p-4 whitespace-pre-wrap">
              {result || "Generated bullets will appear here."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}