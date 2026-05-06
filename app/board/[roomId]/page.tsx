import dynamic from "next/dynamic";
import Room from "@/app/Room";

const App = dynamic(() => import("@/app/App"), { ssr: false });

export default function BoardPage({ params }: { params: { roomId: string } }) {
  return (
    <Room roomId={params.roomId}>
      <App />
    </Room>
  );
}
