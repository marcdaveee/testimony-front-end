import { Button } from "@/components/ui/button";
import { LogIn, SignpostBig } from "lucide-react";

export function NavBar() {
  return (
    <div className="bg-secondary border-b border-border p-3">
      <div className="container mx-auto  flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Testimonify</h3>

        <div className="flex items-center gap-x-2">
          <Button size={"lg"} variant={"default"}>
            Share a Testimony <SignpostBig />
          </Button>
          <Button size={"lg"} variant={"outline"}>
            Log In <LogIn />
          </Button>
        </div>
      </div>
    </div>
  );
}
