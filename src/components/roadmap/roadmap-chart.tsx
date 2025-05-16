"use client";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import {
  ReactFlow,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import RoadmapNode from "./roadmap-nodes";
import Topic from "@/types/topic";
import TopicDialog from "@/components/roadmap/topic-dialog";

interface ReactFlowProps {
  roadmap: GetRoadmapOutput;
  updateTopicStatus: (slug: string, isFinished: boolean) => void;
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

  const topicSpacingY = 300;
  const subtopicOffsetX = 400;
  const subtopicSpacingY = 100;

  let previousTopicId: string | null = null;

  roadmap.topics.forEach((topic: Topic, index: number) => {
    const topicId = `topic-${index}`;
    const { left, right } = splitSubtopicsEvenly(topic.subtopics || []);
    const topicY = index * topicSpacingY; // posisi Y topik mulai dari 0 (karena tidak ada title node)

    nodes.push({
      id: topicId,
      position: { x: 0, y: topicY },
      data: {
        label: topic.title,
        slug: topic.slug,
        isFinished: topic.is_finished,
        isFirstTopic: index === 0,
        isLastTopic: index === roadmap.topics.length - 1,
      },
      type: "roadmapNode",
    });

    if (previousTopicId) {
      edges.push({
        id: `${previousTopicId}->${topicId}`,
        source: previousTopicId,
        target: topicId,
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
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
          slug: sub.slug,
          isFinished: sub.is_finished,
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
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
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
          slug: sub.slug,
          isFinished: sub.is_finished,
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
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
      });
    });
  });

  return { nodes, edges };
}

const nodeTypes = { roadmapNode: RoadmapNode };

const RoadmapChart = ({ roadmap, updateTopicStatus }: ReactFlowProps) => {
  const { nodes: initialNodes, edges: initialEdges } =
    generateFlowData(roadmap);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Fungsi untuk update isFinished pada node tertentu
  const updateNodeFinishedStatus = (slug: string, isFinished: boolean) => {
    setNodes((nds) =>
      nds.map((node) => {
        // Cocokkan berdasarkan slug di data node
        if (node.data.slug === slug) {
          return {
            ...node,
            data: {
              ...node.data,
              isFinished,
            },
          };
        }
        return node;
      })
    );
  };

  // Wrapper yang dipanggil dari TopicDialog via props
  const handleUpdateTopicStatus = (slug: string, isFinished: boolean) => {
    updateTopicStatus(slug, isFinished); // update roadmap di parent
    updateNodeFinishedStatus(slug, isFinished); // update node di lokal agar rerender
  };

  const handleNodeClick = useCallback((_, node: any) => {
    if (node.data?.slug) {
      setSelectedSlug(node.data.slug);
      setDialogOpen(true);
    }
  }, []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const proOptions = { hideAttribution: true };
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        zoomOnPinch={false}
      />
      <TopicDialog
        slug={selectedSlug}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateTopicStatus={handleUpdateTopicStatus}
      />
    </div>
  );
};

export default RoadmapChart;
