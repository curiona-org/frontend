import Loader from "@/components/loader/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-0 bg-white-500 bg-opacity-90 flex items-center justify-center">
      <Loader />
    </div>
  );
}
