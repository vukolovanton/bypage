import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Navigation() {
  let navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  return <div className="flex justify-end p-4">
    <Button onClick={goBack} variant="secondary">Back</Button>
  </div>
}
