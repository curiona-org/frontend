import { NodeProps } from "@xyflow/react";

const RoadmapDetailNode = ({ data }: NodeProps) => {
  const { roadmap } = data;

  return (
    <div className="rounded-xl border-2 border-blue-500 bg-white p-6 text-sm w-[600px]">
      <h1 className="text-2xl font-bold">{roadmap.title}</h1>
      <p className="my-2">{roadmap.description}</p>
      <div className="mt-4 space-y-1">
        <p>
          📅 Date Created:{" "}
          {new Date(roadmap.created_at).toLocaleDateString("en-GB")}
        </p>
        <p>
          ⌛ Time Available:{" "}
          {roadmap.personalization_options.daily_time_availability.value}{" "}
          {roadmap.personalization_options.daily_time_availability.unit} / Per
          Day
        </p>
        <p>🤯 Skill Level: {roadmap.personalization_options.skill_level}</p>
        <p>
          📆 Duration: {roadmap.personalization_options.total_duration.value}{" "}
          {roadmap.personalization_options.total_duration.unit}
        </p>
      </div>
    </div>
  );
};

export default RoadmapDetailNode;
