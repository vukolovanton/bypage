import { Button } from "@/components/ui/button";

interface ControlsProps {
  prevPage: () => void,
  nextPage: () => void,
  pageNumber: number
}
export function Controls({ nextPage, prevPage, pageNumber }: ControlsProps) {
  return <div className="flex justify-between align-middle content-center p-4">
    <Button onClick={prevPage}>Prev</Button>
    <span className="text-gray-300">{pageNumber === 0 ? 'Cover' : pageNumber}</span>
    <Button onClick={nextPage}>Next</Button>
  </div>
}
