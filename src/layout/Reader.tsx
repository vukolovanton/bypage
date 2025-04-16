import AdvancedFB2Reader from "@/components/AdvancedFB2Reader";
import FB2Reader from "@/components/FB2Reader";
import { Controls } from "./Controls";

export default function Reader() {

  return (
    <div className="relative min-h-screen flex justify-between flex-col">
      {/* <FB2Reader /> */}
      <AdvancedFB2Reader />
      <Controls />
    </div>
  );
}
