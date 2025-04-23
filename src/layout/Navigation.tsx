import { TypographyH3 } from "@/components/TypographyH3";
import { Button } from "@/components/ui/button";
import { getBookTitle } from "@/lib/utils";
import useActiveBookStore from "@/state/useActiveBookStore";
import { useNavigate } from "react-router";

export default function Navigation() {
  let navigate = useNavigate();
  const book = useActiveBookStore(state => state.book)!;
  const { title } = getBookTitle(book);
  console.log(book)

  function goBack() {
    navigate("/");
  }

  return <div className="flex justify-center p-4 gap-4">
    <div></div>
    <TypographyH3>{title}</TypographyH3>
    <Button onClick={goBack} variant="secondary">Back</Button>
  </div>
}
