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
  const { isFirstTopic, isLastTopic, isLeftSubtopic, isRightSubtopic } =
    props.data;
  const { isFinished } = props.data;
  const maxChars = 50;
  const baseClass = "text-body-1-medium px-6 py-4 rounded-lg";
  const bgClass = isFinished
    ? "bg-blue-500 hover:bg-blue-700 border-2 border-blue-500 text-white-500 transition-colors duration-150"
    : "bg-white-500 hover:bg-white-600 border-2 border-white-600 transition-colors duration-150";

  // 1. Subtopic kiri (hanya target)
  if (isLeftSubtopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        <Handle
          type='target'
          id='subtopic-left'
          position={Position.Right}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className='w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2'>
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  // 2. Subtopic kanan (hanya target)
  if (isRightSubtopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        <Handle
          type='target'
          id='subtopic-right'
          position={Position.Left}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className='w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2'>
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  // 3. Topik pertama (tanpa handle “top”, tapi punya left/right serta “bottom” kalau perlu)
  if (isFirstTopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        {/* handle bottom (jika ingin menghubungkan ke topik berikutnya secara vertikal) */}
        <Handle
          type='source'
          id='topic-bottom'
          position={Position.Bottom}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        {/* handle kiri */}
        <Handle
          type='source'
          id='topic-left'
          position={Position.Left}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        {/* handle kanan */}
        <Handle
          type='source'
          id='topic-right'
          position={Position.Right}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className='w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2'>
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  // 4. Topik normal (bukan pertama, bukan terakhir)
  if (!isLastTopic && !isFirstTopic) {
    return (
      <div className={`${baseClass} ${bgClass}`}>
        {/* handle top (untuk sambung dari topik sebelumnya) */}
        <Handle
          type='target'
          id='topic-top'
          position={Position.Top}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        {/* handle bottom (untuk sambung ke topik berikutnya) */}
        <Handle
          type='source'
          id='topic-bottom'
          position={Position.Bottom}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        {/* handle kiri */}
        <Handle
          type='source'
          id='topic-left'
          position={Position.Left}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        {/* handle kanan */}
        <Handle
          type='source'
          id='topic-right'
          position={Position.Right}
          isConnectable={false}
          style={{
            background: "var(--white-500)",
            border: "1px solid var(--blue-500)",
            width: "10px",
            height: "10px",
          }}
        />
        <div className='w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2'>
          {truncateText(props.data.label, maxChars)}
        </div>
      </div>
    );
  }

  // 5. Topik terakhir (kita samakan id handle kiri/kanan dengan topik biasa)
  return (
    <div className={`${baseClass} ${bgClass}`}>
      {/* handle top (jika Anda ingin edge vertikal dari topik sebelumnya) */}
      <Handle
        type='target'
        id='topic-top'
        position={Position.Top}
        isConnectable={false}
        style={{
          background: "var(--white-500)",
          border: "1px solid var(--blue-500)",
          width: "10px",
          height: "10px",
        }}
      />
      {/* handle kiri, pakai "topic-left" biar edge subtopik terhubung */}
      <Handle
        type='source'
        id='topic-left'
        position={Position.Left}
        isConnectable={false}
        style={{
          background: "var(--white-500)",
          border: "1px solid var(--blue-500)",
          width: "10px",
          height: "10px",
        }}
      />
      {/* handle kanan, pakai "topic-right" biar edge subtopik terhubung */}
      <Handle
        type='source'
        id='topic-right'
        position={Position.Right}
        isConnectable={false}
        style={{
          background: "var(--white-500)",
          border: "1px solid var(--blue-500)",
          width: "10px",
          height: "10px",
        }}
      />
      <div className='w-[200px] h-[48px] flex justify-center items-center overflow-hidden text-center line-clamp-2'>
        {truncateText(props.data.label, maxChars)}
      </div>
    </div>
  );
};

export default RoadmapNode;
