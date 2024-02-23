

import MenuBar from "@/components/MenuBar";
import ReactFlowCanvas from "@/components/ReactFlowCanvas";


export default function Home() {
  return (
    <div className="w-screen h-screen">
      <ReactFlowCanvas />
      <MenuBar />
    </div>
  );
}
