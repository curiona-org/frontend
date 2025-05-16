import { Handle, Position } from "@xyflow/react";

interface RoadmapProps {
  data: {
    label: string;
    isConnectable: boolean;
    isFinished: boolean;
    isFirstTopic?: boolean;
    isLastTopic?: boolean;
    isLeftSubtopic?: boolean;
    isRightSubtopic?: boolean;
  };
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

const RoadmapNode = (props: RoadmapProps) => {
  const {
    isConnectable,
    isFirstTopic,
    isLastTopic,
    isLeftSubtopic,
    isRightSubtopic,
  } = props.data;
  const { isFinished } = props.data;
  const maxChars = 50;
  const baseClass = "text-body-1-medium px-6 py-4 rounded-lg";
  const bgClass = isFinished
    ? "bg-blue-500 border-2 border-blue-500 text-white-500"
    : "bg-white-500 border-2 border-white-600";

  // Cegah handle default muncul dengan short-circuit render
  if (isLeftSubtopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        <Handle
          type="target"
          id="subtopic-left"
          position={Position.Right}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className="w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2">
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  if (isRightSubtopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        <Handle
          type="target"
          id="subtopic-right"
          position={Position.Left}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className="w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2">
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${bgClass}`}>
      {isFirstTopic && (
        <>
          <Handle
            type="source"
            id="topic-bottom"
            position={Position.Bottom}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="topic-left"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="topic-right"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
        </>
      )}

      {!isLastTopic && !isFirstTopic && (
        <>
          <Handle
            type="target"
            id="topic-top"
            position={Position.Top}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="topic-bottom"
            position={Position.Bottom}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="topic-left"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="topic-right"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
        </>
      )}

      {isLastTopic && (
        <>
          <Handle
            type="target"
            id="lastTopic-top"
            position={Position.Top}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="lastTopic-left"
            position={Position.Left}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
          <Handle
            type="source"
            id="lastTopic-right"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              background: "var(--white-500)",
              border: "1px solid var(--blue-500)",
              width: "10px",
              height: "10px",
            }}
          />
        </>
      )}
      <div className="w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2">
        {truncateText(props.data.label, maxChars)}
      </div>
    </div>
  );
};

export default RoadmapNode;
