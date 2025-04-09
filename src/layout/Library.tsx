import { InputFile } from "@/components/InputFile";
import { TypographyH1 } from "@/components/TypographyH1";
import { Toaster } from "@/components/ui/sonner";

export default function Library() {
  return <>
    <div className="flex justify-between min-h-screen p-8">
      <TypographyH1>
        Library
      </TypographyH1>
      <div>
        <InputFile />
      </div>
    </div >
    <Toaster richColors />
  </>
}
