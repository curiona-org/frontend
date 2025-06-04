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
import { useCallback, useEffect, useState, useMemo } from "react";
import RoadmapNode from "./roadmap-nodes";
import Topic from "@/types/topic";
import TopicDialog from "@/components/dialog/topic-dialog";

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

    // Sort subtopics berdasarkan order
    const sortedSubtopics = (topic.subtopics || [])
      .slice()
      .sort((a, b) => a.order - b.order);

    // Atur subtopik ke kiri dan kanan berdasarkan index
    const { left, right } = (function assignSubtopicsSides(subs) {
      const leftArr = [],
        rightArr = [];
      subs.forEach((sub, i) => {
        if (i % 2 === 0) leftArr.push(sub);
        else rightArr.push(sub);
      });
      return { left: leftArr, right: rightArr };
    })(sortedSubtopics);

    const topicY = index * topicSpacingY;

    // Buat node topik
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

    // koneksi ke topik sebelumnya
    if (previousTopicId) {
      edges.push({
        id: `${previousTopicId}->${topicId}`,
        source: previousTopicId,
        target: topicId,
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
      });
    }
    previousTopicId = topicId;

    // PROSES SUBTOPIK KIRI
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
        sourceHandle: "topic-left",
        targetHandle: "subtopic-left",
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
      });
    });

    // PROSES SUBTOPIK KANAN
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
        sourceHandle: "topic-right",
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
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;

  // Calculate dynamic height based on number of topics
  const flowHeight = useMemo(() => {
    const topicCount = roadmap.topics.length;
    // Base height + spacing per topic (adjust these values as needed)
    return Math.max(500, topicCount * 300 + 200);
  }, [roadmap.topics.length]);

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

  const handleUpdateTopicStatus = (slug: string, isFinished: boolean) => {
    // 1. Ambil nilai sekarang dari finished_topics dan total_topics
    const currentFinished = roadmap.progression.finished_topics;
    const totalTopics = roadmap.total_topics;

    const newFinished = isFinished ? currentFinished + 1 : currentFinished - 1;

    // 3. Panggil update ke parent dan update node di lokal
    updateTopicStatus(slug, isFinished);
    updateNodeFinishedStatus(slug, isFinished);

    // 4. Kalau menandai 'done' dan ternyata newFinished === totalTopics, otomatis tutup dialog
    if (isFinished && newFinished === totalTopics) {
      setDialogOpen(false);
    }
  };

  // Wrapper yang dipanggil dari TopicDialog via props
  // const handleUpdateTopicStatus = (slug: string, isFinished: boolean) => {
  //   updateTopicStatus(slug, isFinished); // update roadmap di parent
  //   updateNodeFinishedStatus(slug, isFinished); // update node di lokal agar rerender
  // };

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
    <div
      className="nowheel"
      style={{ width: "100%", height: `${flowHeight}px` }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        zoomOnScroll={isMobile}
        panOnDrag={isMobile}
        zoomOnPinch={isMobile}
        minZoom={0.5}
        maxZoom={2}
        nodesDraggable={false}
        zoomOnDoubleClick={false}
      />
      <TopicDialog
        slug={selectedSlug}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateTopicStatus={handleUpdateTopicStatus}
        onFinish={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default RoadmapChart;
