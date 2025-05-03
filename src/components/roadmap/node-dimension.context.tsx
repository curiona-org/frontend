"use client";
import { createContext, useContext, useState } from "react";

type NodeSize = {
  width: number;
  height: number;
};

type NodeDimensionsMap = Record<string, NodeSize>;

type NodeDimensionsContextType = {
  dimensions: NodeDimensionsMap;
  setNodeSize: (id: string, size: NodeSize) => void;
};

const NodeDimensionsContext = createContext<
  NodeDimensionsContextType | undefined
>(undefined);

export const NodeDimensionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dimensions, setDimensions] = useState<NodeDimensionsMap>({});

  const setNodeSize = (id: string, size: NodeSize) => {
    setDimensions((prev) => {
      if (prev[id]?.width === size.width && prev[id]?.height === size.height) {
        return prev;
      }
      return { ...prev, [id]: size };
    });
  };

  return (
    <NodeDimensionsContext.Provider value={{ dimensions, setNodeSize }}>
      {children}
    </NodeDimensionsContext.Provider>
  );
};

export const useNodeDimensions = () => {
  const context = useContext(NodeDimensionsContext);
  if (!context)
    throw new Error(
      "useNodeDimensions must be used within NodeDimensionsProvider"
    );
  return context;
};
