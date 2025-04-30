import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

interface RoadmapProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const RoadmapNode = (props: RoadmapProps) => {
  return (
    <div className="w-full h-10 p-4 bg-white-500 border border-grey-500 rounded-lg">
      <Handle
        type="target"
        id="topic-current"
        position={Position.Top}
        isConnectable={props.isConnectable}
      />
      <h1>{props.data.label}</h1>
      <Handle
        type="source"
        id="topic-left"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="target"
        id="subtopic-left"
        position={Position.Right}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="source"
        id="topic-right"
        position={Position.Right}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="target"
        id="subtopic-right"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <Handle
        type="source"
        id="topic-previous"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </div>
  );
};

export default RoadmapNode;
