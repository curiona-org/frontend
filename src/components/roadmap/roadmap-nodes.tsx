import { Handle, Position } from "@xyflow/react";

interface RoadmapProps {
  data: {
    label: string;
    isConnectable: boolean;
    isTitleNode?: boolean;
    isLastTopic?: boolean;
    isLeftSubtopic?: boolean;
    isRightSubtopic?: boolean;
  };
}

const RoadmapNode = (props: RoadmapProps) => {
  const {
    isConnectable,
    isTitleNode,
    isLastTopic,
    isLeftSubtopic,
    isRightSubtopic,
  } = props.data;

  // Cegah handle default muncul dengan short-circuit render
  if (isLeftSubtopic) {
    return (
      <div className="px-6 py-4 bg-white-500 border-2 border-blue-500 text-blue-500">
        <Handle
          type="target"
          id="subtopic-left"
          position={Position.Right}
          isConnectable={false}
        />
        <h1>{props.data.label}</h1>
      </div>
    );
  }

  if (isRightSubtopic) {
    return (
      <div className="px-6 py-4 bg-white-500 border-2 border-blue-500 text-blue-500">
        <Handle
          type="target"
          id="subtopic-right"
          position={Position.Left}
          isConnectable={false}
        />
        <h1>{props.data.label}</h1>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-white-500 border-2 border-blue-500 text-blue-500">
      {isTitleNode && (
        <Handle
          type="source"
          id="roadmap-title"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      )}

      {!isLastTopic && !isTitleNode && (
        <>
          <Handle
            type="target"
            id="topic-top"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id="topic-bottom"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id="topic-left"
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id="topic-right"
            position={Position.Right}
            isConnectable={isConnectable}
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
          />
          <Handle
            type="source"
            id="lastTopic-left"
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id="lastTopic-right"
            position={Position.Right}
            isConnectable={isConnectable}
          />
        </>
      )}

      <h1>{props.data.label}</h1>
    </div>
  );
};

export default RoadmapNode;
