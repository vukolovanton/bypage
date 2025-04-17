import AdvancedFB2Reader from "@/components/AdvancedFB2Reader";
import Navigation from "./Navigation";

export default function Reader() {
  return (
    <div className="relative min-h-screen flex justify-between flex-col">
      <Navigation />
      <AdvancedFB2Reader />
    </div>
  );
}
