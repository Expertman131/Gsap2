import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

interface AnimationSettings {
  duration: number;
  ease: string;
  start: string;
  end: string;
}

const defaultSettings: AnimationSettings = {
  duration: 1,
  ease: "power2.out",
  start: "top 80%",
  end: "bottom 20%",
};

const easeOptions = [
  "power1.out",
  "power2.out",
  "power3.out",
  "power4.out",
  "back.out",
  "elastic.out",
  "bounce.out",
  "circ.out",
  "expo.out",
  "sine.out",
];

const startPositions = ["top 80%", "top 60%", "top center", "center center"];

const endPositions = [
  "bottom 20%",
  "bottom 40%",
  "bottom center",
  "center center",
];

export default function ScrollAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("fadeIn");
  const [generatedCode, setGeneratedCode] = useState("");

  // Update settings
  const updateSetting = (
    key: keyof AnimationSettings,
    value: string | number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Generate code based on current settings and animation type
  const generateCode = () => {
    let code = "";
    const { duration, ease, start, end } = settings;

    // Note: This code assumes ScrollTrigger plugin is available
    if (activeTab === "fadeIn") {
      code = `// Fade In on scroll
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Assuming you have elements with the class 'scroll-fade-in'
const elements = document.querySelectorAll('.scroll-fade-in');

elements.forEach(element => {
  gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: ${duration},
    ease: "${ease}",
    scrollTrigger: {
      trigger: element,
      start: "${start}",
      end: "${end}",
      toggleActions: "play none none reverse"
    }
  });
});
`;
    } else if (activeTab === "parallax") {
      code = `// Parallax effect on scroll
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Assuming you have elements with the class 'parallax-element'
const elements = document.querySelectorAll('.parallax-element');

elements.forEach(element => {
  gsap.to(element, {
    y: -100, // Adjust this value to control parallax intensity
    ease: "${ease}",
    scrollTrigger: {
      trigger: element,
      start: "${start}",
      end: "${end}",
      scrub: true // Makes the animation progress based on scroll position
    }
  });
});
`;
    } else if (activeTab === "stagger") {
      code = `// Staggered reveal on scroll
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Assuming you have a container with child elements
const container = document.querySelector('.stagger-container');
const elements = container.querySelectorAll('.stagger-item');

ScrollTrigger.create({
  trigger: container,
  start: "${start}",
  end: "${end}",
  onEnter: () => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: ${duration},
      ease: "${ease}"
    });
  },
  onLeaveBack: () => {
    gsap.to(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: ${duration / 2}
    });
  }
});
`;
    }

    setGeneratedCode(code);
  };

  // Run animation when settings change
  useEffect(() => {
    generateCode();
  }, [settings, activeTab]);

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GSAP Scroll Animation Builder
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animation Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Scroll Animation Types</CardTitle>
              <CardDescription>
                Select an animation type to generate code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="fadeIn">Fade In</TabsTrigger>
                  <TabsTrigger value="parallax">Parallax</TabsTrigger>
                  <TabsTrigger value="stagger">Staggered</TabsTrigger>
                </TabsList>

                <TabsContent value="fadeIn" className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      Fade In on Scroll
                    </h3>
                    <p>
                      Elements fade in and move up as they enter the viewport.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        Fade
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Note: Scroll animations require the ScrollTrigger plugin and
                    can only be previewed in a full page context.
                  </p>
                </TabsContent>

                <TabsContent value="parallax" className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      Parallax Effect
                    </h3>
                    <p>
                      Elements move at different speeds as the user scrolls,
                      creating depth.
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <div className="w-16 h-16 bg-primary/30 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        Back
                      </div>
                      <div className="w-16 h-16 bg-primary/60 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        Mid
                      </div>
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                        Front
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Note: Parallax effects require the ScrollTrigger plugin with
                    scrub enabled.
                  </p>
                </TabsContent>

                <TabsContent value="stagger" className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      Staggered Reveal
                    </h3>
                    <p>
                      Multiple elements appear one after another when scrolled
                      into view.
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Note: Staggered animations work best with groups of similar
                    elements.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mt-6">
                <p className="text-center text-muted-foreground">
                  Scroll animations can only be previewed in a full page context
                  with the ScrollTrigger plugin.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Animation Settings</CardTitle>
              <CardDescription>Customize your scroll animation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration: {settings.duration}s</Label>
                <Slider
                  id="duration"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[settings.duration]}
                  onValueChange={(value) => updateSetting("duration", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ease">Easing</Label>
                <Select
                  value={settings.ease}
                  onValueChange={(value) => updateSetting("ease", value)}
                >
                  <SelectTrigger id="ease">
                    <SelectValue placeholder="Select easing function" />
                  </SelectTrigger>
                  <SelectContent>
                    {easeOptions.map((ease) => (
                      <SelectItem key={ease} value={ease}>
                        {ease}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start">Start Position</Label>
                <Select
                  value={settings.start}
                  onValueChange={(value) => updateSetting("start", value)}
                >
                  <SelectTrigger id="start">
                    <SelectValue placeholder="Select start position" />
                  </SelectTrigger>
                  <SelectContent>
                    {startPositions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End Position</Label>
                <Select
                  value={settings.end}
                  onValueChange={(value) => updateSetting("end", value)}
                >
                  <SelectTrigger id="end">
                    <SelectValue placeholder="Select end position" />
                  </SelectTrigger>
                  <SelectContent>
                    {endPositions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Generation */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Generated Code</CardTitle>
            <CardDescription>Copy and paste into your project</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigator.clipboard.writeText(generatedCode)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{generatedCode}</code>
          </pre>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: ScrollTrigger is a premium GSAP plugin and requires
            registration
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
