import { Button } from "@/components/ui/button";

export function Controls({ setPageIndex }: { setPageIndex: any }) {
  return <div className="flex justify-between">
    <Button onClick={() => setPageIndex(p => Math.max(0, p - 1))}>Prev</Button>
    <Button onClick={() => setPageIndex(p => p + 1)}>Next</Button>
  </div>
}
