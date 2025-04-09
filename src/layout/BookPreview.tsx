import { TypographyH3 } from "@/components/TypographyH3";

export default function BookPreview() {
  return (
    <div className="border-2 rounded-md p-4 h-60 w-44 shadow-sm cursor-pointer hover:shadow-xl">
      <TypographyH3>Old man and the sea</TypographyH3>
      <i>Author</i>
    </div>
  )
}
