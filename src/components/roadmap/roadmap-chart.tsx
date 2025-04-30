"use client";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import {
  ReactFlow,
  Position,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import RoadmapNode from "./roadmap-nodes";
import Topic from "@/types/topic";

interface ReactFlowProps {
  roadmap: GetRoadmapOutput;
}

function splitSubtopicsEvenly(subtopics: any[]) {
  const mid = Math.ceil(subtopics.length / 2);
  return {
    left: subtopics.slice(0, mid),
    right: subtopics.slice(mid),
  };
}

function generateFlowData(topics: Topic[]) {
  const nodes: any[] = [];
  const edges: any[] = [];
  let yOffset = 0;
  let previousTopicId: string | null = null;

  topics.forEach((topic: Topic, index: number) => {
    const topicId = `topic-${index}`;
    const { left, right } = splitSubtopicsEvenly(topic.subtopics || []);

    const maxSubtopics = Math.max(left.length, right.length);
    const subtopicsHeight = (maxSubtopics - 1) * 80;
    const topicY = yOffset + subtopicsHeight / 2;

    if (previousTopicId) {
      edges.push({
        id: `${previousTopicId}->${topicId}`,
        source: previousTopicId,
        target: topicId,
        sourceHandle: "topic-previous",
        targetHandle: "topic-current",
      });
    }
    previousTopicId = topicId;

    // Push topic node
    nodes.push({
      id: topicId,
      position: { x: 0, y: topicY },
      data: { label: topic.title },
      type: "roadmapNode",
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    });

    // Left subtopics
    left.forEach((sub: any, subIdx: number) => {
      const subId = `${topicId}-left-${subIdx}`;
      const subY = yOffset + subIdx * 80;
      nodes.push({
        id: subId,
        position: { x: -400, y: subY },
        data: { label: sub.title },
        type: "roadmapNode",
        targetPosition: Position.Right,
        sourcePosition: Position.Left,
      });

      edges.push({
        id: `e-${topicId}-${subId}`,
        source: topicId,
        target: subId,
        sourceHandle: "topic-left",
        targetHandle: "subtopic-left",
      });
    });

    // Right subtopics
    right.forEach((sub: any, subIdx: number) => {
      const subId = `${topicId}-right-${subIdx}`;
      const subY = yOffset + subIdx * 80;
      nodes.push({
        id: subId,
        position: { x: 400, y: subY },
        data: { label: sub.title },
        type: "roadmapNode",
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      });

      edges.push({
        id: `e-${topicId}-${subId}`,
        source: topicId,
        target: subId,
        sourceHandle: "topic-right",
        targetHandle: "subtopic-right",
      });
    });

    yOffset += subtopicsHeight + 150;
  });

  return { nodes, edges };
}

const nodeTypes = { roadmapNode: RoadmapNode };

const RoadmapChart = (props: ReactFlowProps) => {
  const { nodes: initialNodes, edges: initialEdges } = generateFlowData(
    props.roadmap.topics
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const proOptions = { hideAttribution: true };
  return (
    <div style={{ width: "100%", height: "100vh" }} className="mt-10rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        // }}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        panOnDrag={false}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        zoomOnScroll={false}
        proOptions={proOptions}
      />
    </div>
  );
};

export default RoadmapChart;
