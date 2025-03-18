import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (path.includes("/cards")) return "cards";
    if (path.includes("/svg")) return "svg";
    if (path.includes("/timeline")) return "timeline";
    if (path.includes("/interaction")) return "interaction";
    if (path.includes("/scroll")) return "scroll";
    return "text";
  };

  return (
    <div className="w-full bg-background py-4 border-b sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">GSAP Animation Builder</h2>

          <Tabs value={getActiveTab()} className="w-auto">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="text" asChild>
                <Link to="/text">Text</Link>
              </TabsTrigger>
              <TabsTrigger value="cards" asChild>
                <Link to="/cards">Cards</Link>
              </TabsTrigger>
              <TabsTrigger value="svg" asChild>
                <Link to="/svg">SVG</Link>
              </TabsTrigger>
              <TabsTrigger value="timeline" asChild>
                <Link to="/timeline">Timeline</Link>
              </TabsTrigger>
              <TabsTrigger value="interaction" asChild>
                <Link to="/interaction">Interaction</Link>
              </TabsTrigger>
              <TabsTrigger value="scroll" asChild>
                <Link to="/scroll">Scroll</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
