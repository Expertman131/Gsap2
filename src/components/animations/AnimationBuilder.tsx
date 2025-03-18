import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextAnimations from "./TextAnimations";
import CardAnimations from "./CardAnimations";
import ScrollAnimations from "./ScrollAnimations";

export default function AnimationBuilder() {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="container mx-auto py-8 bg-background">
      <h1 className="text-4xl font-bold text-center mb-2">
        GSAP Animation Builder
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Create, preview, and export GSAP animations for your website
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="text">Text Animations</TabsTrigger>
          <TabsTrigger value="cards">Card Animations</TabsTrigger>
          <TabsTrigger value="scroll">Scroll Animations</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TextAnimations />
        </TabsContent>

        <TabsContent value="cards">
          <CardAnimations />
        </TabsContent>

        <TabsContent value="scroll">
          <ScrollAnimations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
