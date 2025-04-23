import { ImportFile } from "@/components/ImportFile";
import { TypographyH1 } from "@/components/TypographyH1";
import { Toaster } from "@/components/ui/sonner";
import Bookshelf from "./Bookshelf";
import Settings from "@/components/Settings";

export default function Library() {

  return <>
    <div className="flex justify-between min-h-10 p-8">
      <TypographyH1>
        Library
      </TypographyH1>
      <div className="flex gap-4">
        <Settings />
        <ImportFile />
      </div>
    </div >
    <Bookshelf />
    <Toaster richColors />
  </>
}
