import { useEffect, useState } from "react";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: number;
}

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {roadmaps.length > 0 ? (
        roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="relative border-2 border-blue-500 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 ease-out lg:hover:bg-blue-500 hover:text-white-500 cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-satoshi text-heading-4-bold">
                {roadmap.title}
              </h3>
              <button className="absolute top-4 right-4 text-sm border border-white-500 px-2 py-1 rounded-lg opacity-0 transform translate-y-[-20px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 md:text-white-500 md:block hidden">
                Add to Bookmark
              </button>
              <button className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="var(--blue-500)"
                    d="m12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162zm0-2.2l5 2.15V5H7v12.95zM12 5H7h10z"
                  />
                </svg>
              </button>
            </div>
            <p className="font-satoshi text-body-2">{roadmap.description}</p>
            <div className="flex gap-2 items-center mt-4 text-sm text-gray-500">
              <div className="bg-blue-100 px-2 py-1 rounded-lg">
                <span className="font-satoshi text-body-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M6 2h12v6l-4 4l4 4v6H6v-6l4-4l-4-4zm10 14.5l-4-4l-4 4V20h8zm-4-5l4-4V4H8v3.5zM10 6h4v.75l-2 2l-2-2z"
                    />
                  </svg>
                  {roadmap.duration} 13 min
                </span>
              </div>
              <div className="bg-blue-100 px-2 py-1 rounded-lg">
                <span className="font-satoshi text-body-2 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 576 512"
                  >
                    <path
                      fill="currentColor"
                      d="M384 64c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32s-14.3 32-32 32h-96v96c0 17.7-14.3 32-32 32h-96v96c0 17.7-14.3 32-32 32h-96v96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h96v-96c0-17.7 14.3-32 32-32h96v-96c0-17.7 14.3-32 32-32h96z"
                    />
                  </svg>
                  {roadmap.steps} 20 steps
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full text-gray-500">
          Loading or No Data Available
        </p>
      )}
    </div>
  );
};

export default RoadmapList;
