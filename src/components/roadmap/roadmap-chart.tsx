"use client";
import TopicDialog from "@/components/dialog/topic-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/providers/auth-provider";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import Topic from "@/types/topic";
import {
  addEdge,
  Connection,
  ConnectionLineType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { redirect } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import RoadmapNode from "./roadmap-nodes";

interface ReactFlowProps {
  roadmap: GetRoadmapOutput;
  updateTopicStatus: (slug: string, isFinished: boolean) => void;
}

function splitSubtopicsEvenly(subtopics: Topic[]) {
  const mid = Math.ceil(subtopics.length / 2);
  return {
    left: subtopics.slice(0, mid),
    right: subtopics.slice(mid),
  };
}

function generateFlowData(roadmap: GetRoadmapOutput) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const topicSpacingY = 300;
  const subtopicOffsetX = 400;
  const subtopicSpacingY = 100;

  let previousTopicId: string | null = null;

  // 1. Urutkan topik berdasarkan order
  const sortedTopics = roadmap.topics.slice().sort((a, b) => a.order - b.order);

  sortedTopics.forEach((topic: Topic, index: number) => {
    const topicId = `topic-${index}`;
    const topicY = index * topicSpacingY;

    // 2. Buat node TOPIK (dengan numbering sudah ada dari topic.order)
    nodes.push({
      id: topicId,
      position: { x: 0, y: topicY },
      data: {
        label: `${topic.order}. ${topic.title}`,
        slug: topic.slug,
        isFinished: topic.is_finished,
        isFirstTopic: index === 0,
        isLastTopic: index === sortedTopics.length - 1,
      },
      type: "roadmapNode",
    });

    // 3. Jika ada topic sebelumnya, sambung dengan edge
    if (previousTopicId) {
      edges.push({
        id: `${previousTopicId}->${topicId}`,
        source: previousTopicId,
        target: topicId,
        style: { stroke: "var(--white-600)", strokeWidth: 2 },
      });
    }
    previousTopicId = topicId;

    // 4. Urutkan subtopics berdasarkan order
    const sortedSubtopics = (topic.subtopics || [])
      .slice()
      .sort((a, b) => a.order - b.order);

    // 5. Split subtopics menjadi dua array kiri/kanan secara merata
    const { left, right } = splitSubtopicsEvenly(sortedSubtopics);

    // PROSES SUBTOPIK KIRI
    left.forEach((sub, subIdx) => {
      const subId = `${topicId}-left-${subIdx}`;
      // Hitung posisi Y untuk setiap subtopik agar terpusat di sekitar topicY
      const subY =
        topicY -
        ((left.length - 1) * subtopicSpacingY) / 2 +
        subIdx * subtopicSpacingY;

      nodes.push({
        id: subId,
        position: { x: -subtopicOffsetX, y: subY },
        data: {
          label: `${topic.order}.${sub.order}. ${sub.title}`,
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
      // Hitung posisi Y untuk setiap subtopik di kolom kanan
      const subY =
        topicY -
        ((right.length - 1) * subtopicSpacingY) / 2 +
        subIdx * subtopicSpacingY;

      nodes.push({
        id: subId,
        position: { x: subtopicOffsetX, y: subY },
        data: {
          label: `${topic.order}.${sub.order}. ${sub.title}`,
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
  const isMobile = useIsMobile();
  const { isLoggedIn } = useAuth();

  // Calculate dynamic height based on number of topics
  const flowHeight = useMemo(() => {
    const topicCount = roadmap.topics.length;
    const calculatedHeight = Math.max(500, topicCount * 300 + 200);

    const screenWidth = window.innerWidth;

    if (isMobile || screenWidth < 768) {
      const availableHeight = window.innerHeight - 100;
      return Math.min(calculatedHeight, availableHeight);
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      const availableHeight = window.innerHeight - 150;
      return Math.min(calculatedHeight, availableHeight);
    }

    return calculatedHeight;
  }, [roadmap.topics.length, isMobile]);

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

  const handleNodeClick = useCallback(
    (_: unknown, node: Node) => {
      if (!isLoggedIn) {
        redirect("/sign-in");
      }

      if (isLoggedIn && node.data?.slug) {
        setSelectedSlug(node.data.slug as string);
        setDialogOpen(true);
      }
    },
    [isLoggedIn]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const proOptions = { hideAttribution: true };

  return (
    <>
      <div
        className='nowheel'
        style={{
          width: "100%",
          height: `${flowHeight}px`,
        }}
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
          minZoom={0.1}
          maxZoom={1}
          nodesDraggable={false}
          zoomOnDoubleClick={false}
        />
      </div>
      <TopicDialog
        slug={selectedSlug}
        roadmapSlug={roadmap.slug}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateTopicStatus={handleUpdateTopicStatus}
      />
    </>
  );
};

export default RoadmapChart;
