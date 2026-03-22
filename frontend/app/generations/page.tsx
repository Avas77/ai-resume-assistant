"use client";

import {useState, useEffect} from "react";
import {getHistory} from "@/app/api/ollama-apis";

type Generation = {
  id: number;
  job_description: string;
  experience: string;
  bullets: string;
  created_at: string;
};

export default function Generations(){
   const [history, setHistory] = useState<Generation[]>([]);

   const fetchHistory = async () => {
       try {
          const response = await getHistory()
          const data = response.data;
          if (response.status != 200) {
            throw new Error(data.detail || "Failed to fetch history.");
          }

          setHistory(data);
       } catch (err) {
           console.error(err);
       }
   };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">History</h2>
            <button
              onClick={fetchHistory}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500">No saved generations yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Generation #{item.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-800">
                        Job Description
                      </h3>
                      <p className="line-clamp-4 whitespace-pre-wrap text-sm text-gray-600">
                        {item.job_description}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-800">
                        Experience
                      </h3>
                      <p className="line-clamp-4 whitespace-pre-wrap text-sm text-gray-600">
                        {item.experience}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-800">
                        Generated Bullets
                      </h3>
                      <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
                        {item.bullets}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    )
}