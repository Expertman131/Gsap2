import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextAnimations from "./TextAnimations";
import CardAnimations from "./CardAnimations";
import ScrollAnimations from "./ScrollAnimations";
import SVGAnimations from "./SVGAnimations";
import TimelineAnimations from "./TimelineAnimations";
import InteractionAnimations from "./InteractionAnimations";
import Header from "./Header";
import { useLocation } from "react-router-dom";

export default function AnimationBuilder() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/cards")) return "cards";
    if (path.includes("/svg")) return "svg";
    if (path.includes("/timeline")) return "timeline";
    if (path.includes("/interaction")) return "interaction";
    if (path.includes("/scroll")) return "scroll";
    return "text";
  });

  // Update active tab when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/cards")) setActiveTab("cards");
    else if (path.includes("/svg")) setActiveTab("svg");
    else if (path.includes("/timeline")) setActiveTab("timeline");
    else if (path.includes("/interaction")) setActiveTab("interaction");
    else if (path.includes("/scroll")) setActiveTab("scroll");
    else setActiveTab("text");
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          GSAP Animation Builder
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Create, preview, and export GSAP animations for your website
        </p>

        {/* Render component based on current path */}
        {location.pathname === "/" || location.pathname === "/text" ? (
          <TextAnimations />
        ) : null}
        {location.pathname === "/cards" ? <CardAnimations /> : null}
        {location.pathname === "/svg" ? <SVGAnimations /> : null}
        {location.pathname === "/timeline" ? <TimelineAnimations /> : null}
        {location.pathname === "/interaction" ? (
          <InteractionAnimations />
        ) : null}
        {location.pathname === "/scroll" ? <ScrollAnimations /> : null}

        {/* Fallback for when not using router */}
        {location.pathname === "/" && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="svg">SVG</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="interaction">Interaction</TabsTrigger>
              <TabsTrigger value="scroll">Scroll</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <TextAnimations />
            </TabsContent>

            <TabsContent value="cards">
              <CardAnimations />
            </TabsContent>

            <TabsContent value="svg">
              <SVGAnimations />
            </TabsContent>

            <TabsContent value="timeline">
              <TimelineAnimations />
            </TabsContent>

            <TabsContent value="interaction">
              <InteractionAnimations />
            </TabsContent>

            <TabsContent value="scroll">
              <ScrollAnimations />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
