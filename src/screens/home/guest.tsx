"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomeGuest() {
  const [data, setData] = useState(null); // Simpan data dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);

  // useEffect(() => {
  //   const fetchRoadmaps = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://api.curiona.34.2.143.125.sslip.io/roadmaps"
  //       );
  //       console.log("Response status:", response.status);

  //       if (!response.ok) throw new Error("Failed to fetch");

  //       const result = await response.json();
  //       console.log("API Response:", result);
  //       console.log("API Data:", result.data);
  //       console.log("Items:", result.data.items);

  //       if (result.success && result.data) {
  //         setRoadmaps(result.data.items);
  //       } else {
  //         console.error("Invalid API response structure");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching API:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRoadmaps();
  // }, []);

  useEffect(() => {
    fetch("http://api.curiona.34.2.143.125.sslip.io/roadmaps")
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result);
        if (result.data && result.data.items) {
          setRoadmaps(result.data.items);
        } else {
          console.error("Data items not found in response");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex flex-col justify-center min-h-screen px-40 py-2">
      <div className="flex flex-col gap-6">
        <h1 className="text-6xl bold">
          Create Your{" "}
          <span className="text-blue-500 dashedBorder px-4 py-2">
            Learning Blueprint
          </span>
        </h1>
        <p className="text-xl">
          Create a personalized roadmap that helps you learn new things without
          the hassle.
        </p>

        <input
          placeholder="Type here to generate your roadmap"
          className="w-full rounded-lg bg-white-500 dashedBorder px-5 py-8 text-xl"
        ></input>

        <div className="flex justify-between">
          <h4 className="text-xl">Type here to generate your roadmap</h4>
          <span className="flex items-center">
            See More{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m10 17l5-5m0 0l-5-5"
              />
            </svg>
          </span>
        </div>

        <div>
          <h2>Roadmap List</h2>
          {roadmaps.length > 0 ? (
            <ul>
              {roadmaps.map((roadmap) => (
                <li key={roadmap.id} className="flex flex-col gap-4">
                  <h3>{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading or No Data Available</p>
          )}
        </div>
      </div>
    </div>
  );
}
