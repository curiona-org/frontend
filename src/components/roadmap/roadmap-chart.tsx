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
import { Dialog } from "radix-ui";

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

function generateFlowData(roadmap: GetRoadmapOutput) {
  const nodes: any[] = [];
  const edges: any[] = [];

  const topicSpacingY = 200;
  const subtopicOffsetX = 400; // Left-right offset for subtopics
  const subtopicSpacingY = 80; // Vertical spacing for subtopics

  const titleNodeId = "roadmap-title-node";
  nodes.push({
    id: titleNodeId,
    position: { x: 0, y: 0 },
    data: { label: roadmap.title, isTitleNode: true },
    type: "roadmapNode",
  });

  let previousTopicId = titleNodeId;

  roadmap.topics.forEach((topic: Topic, index: number) => {
    const topicId = `topic-${index}`;
    const { left, right } = splitSubtopicsEvenly(topic.subtopics || []);
    const topicY = (index + 1) * topicSpacingY;

    // Menambahkan node topik dengan validasi topik terakhir
    nodes.push({
      id: topicId,
      position: { x: 0, y: topicY },
      data: {
        label: topic.title,
        isLastTopic: index === roadmap.topics.length - 1,
      },
      type: "roadmapNode",
      // targetPosition: index === 0 ? undefined : Position.Top,
      // sourcePosition:
      //   index === roadmap.topics.length - 1 ? undefined : Position.Bottom,
    });

    if (previousTopicId) {
      edges.push({
        id: `${previousTopicId}->${topicId}`,
        source: previousTopicId,
        target: topicId,
        // sourceHandle:
        //   previousTopicId === titleNodeId ? "roadmap-title" : "topic-previous",
        // targetHandle:
        //   previousTopicId === titleNodeId ? undefined : "topic-current",
        style: { stroke: "#4b7ce8", strokeWidth: 2 },
      });
    }
    previousTopicId = topicId;

    const isLastTopic = index === roadmap.topics.length - 1;

    left.forEach((sub, subIdx) => {
      const subId = `${topicId}-left-${subIdx}`;
      const subY =
        topicY -
        ((left.length - 1) * subtopicSpacingY) / 2 +
        subIdx * subtopicSpacingY;

      nodes.push({
        id: subId,
        position: { x: -subtopicOffsetX, y: subY },
        data: {
          label: sub.title,
          isLeftSubtopic: true,
          isRightSubtopic: false,
          isConnectable: false,
        },
        type: "roadmapNode",
      });

      edges.push({
        id: `e-${topicId}-${subId}`,
        source: topicId,
        target: subId,
        sourceHandle: isLastTopic ? "lastTopic-left" : "topic-left", // untuk subtopik kiri
        targetHandle: "subtopic-left",
        style: { stroke: "#4b7ce8", strokeWidth: 2 },
      });
    });

    right.forEach((sub, subIdx) => {
      const subId = `${topicId}-right-${subIdx}`;
      const subY =
        topicY -
        ((right.length - 1) * subtopicSpacingY) / 2 +
        subIdx * subtopicSpacingY;

      nodes.push({
        id: subId,
        position: { x: subtopicOffsetX, y: subY },
        data: {
          label: sub.title,
          isLeftSubtopic: false,
          isRightSubtopic: true,
          isConnectable: false,
        },
        type: "roadmapNode",
        // targetPosition: Position.Left,
        // sourcePosition: Position.Right,
      });

      console.log("Subtopic kanan", {
        id: subId,
        position: { x: subtopicOffsetX, y: subY },
        data: {
          label: sub.title,
          isLeftSubtopic: false,
          isRightSubtopic: true,
          isConnectable: false,
        },
        type: "roadmapNode",
      });

      edges.push({
        id: `e-${topicId}-${subId}`,
        source: topicId,
        target: subId,
        sourceHandle: isLastTopic ? "lastTopic-right" : "topic-right", // untuk subtopik kanan
        targetHandle: "subtopic-right",
        style: { stroke: "#4b7ce8", strokeWidth: 2 },
      });
    });
  });

  return { nodes, edges };
}

const nodeTypes = { roadmapNode: RoadmapNode };

const RoadmapChart = (props: ReactFlowProps) => {
  const { nodes: initialNodes, edges: initialEdges } = generateFlowData(
    props.roadmap
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const proOptions = { hideAttribution: true };
  return (
    <div style={{ width: "100%", height: "100vh" }} className="">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
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
