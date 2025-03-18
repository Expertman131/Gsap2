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
import { Download, FileDown } from "lucide-react";

interface AnimationSettings {
  duration: number;
  delay: number;
  ease: string;
  stagger: number;
}

const defaultSettings: AnimationSettings = {
  duration: 1,
  delay: 0,
  ease: "power2.out",
  stagger: 0.1,
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

export default function SVGAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("morphing");
  const [generatedCode, setGeneratedCode] = useState("");

  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Update settings
  const updateSetting = (
    key: keyof AnimationSettings,
    value: number | string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Generate code based on current settings and animation type
  const generateCode = () => {
    let code = "";
    const { duration, delay, ease, stagger } = settings;

    if (activeTab === "morphing") {
      code = `// SVG Morphing animation
import { gsap } from 'gsap';

// Assuming you have SVG paths with these IDs
const shape1 = document.getElementById('shape1');
const shape2 = document.getElementById('shape2');

// Get the path data
const shape1Path = shape1.getAttribute('d');
const shape2Path = shape2.getAttribute('d');

// Create the morphing animation
gsap.to(shape1, {
  morphSVG: shape2Path,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  repeat: -1,
  yoyo: true,
  repeatDelay: 1
});

// Note: This requires the MorphSVG plugin which is a premium GSAP plugin
// For free alternatives, you can animate individual path points or use simpler shapes`;
    } else if (activeTab === "drawing") {
      code = `// SVG Drawing animation
import { gsap } from 'gsap';

// Assuming you have SVG paths with the class 'draw-path'
const paths = document.querySelectorAll('.draw-path');

// Set initial state - all paths invisible
gsap.set(paths, {
  strokeDasharray: function(i, target) {
    return target.getTotalLength();
  },
  strokeDashoffset: function(i, target) {
    return target.getTotalLength();
  }
});

// Create the drawing animation
gsap.to(paths, {
  strokeDashoffset: 0,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  stagger: ${stagger}
});

// This is a free technique that works with any SVG path!`;
    } else if (activeTab === "coordinated") {
      code = `// Coordinated SVG animation
import { gsap } from 'gsap';

// Assuming you have SVG elements with these classes
const elements = {
  circle: document.querySelector('.svg-circle'),
  rect: document.querySelector('.svg-rect'),
  path: document.querySelector('.svg-path')
};

// Create a timeline for coordinated animation
const tl = gsap.timeline({
  delay: ${delay},
  repeat: -1,
  repeatDelay: 1,
  yoyo: true
});

// Add animations to the timeline
tl.to(elements.circle, {
  cx: 150,
  cy: 100,
  r: 30,
  fill: "#ff5733",
  duration: ${duration},
  ease: "${ease}"
})
.to(elements.rect, {
  x: 200,
  y: 50,
  width: 80,
  height: 40,
  fill: "#33ff57",
  duration: ${duration},
  ease: "${ease}"
}, "-=${duration * 0.5}")
.to(elements.path, {
  attr: { d: "M50,150 Q100,50 150,150" },
  stroke: "#3357ff",
  duration: ${duration},
  ease: "${ease}"
}, "-=${duration * 0.5}");

// This uses standard GSAP animation techniques with SVG attributes`;
    }

    setGeneratedCode(code);
  };

  // Run animation based on active tab
  const runAnimation = () => {
    if (!svgContainerRef.current) return;

    const { duration, delay, ease, stagger } = settings;

    // Clear any existing animations
    gsap.killTweensOf(svgContainerRef.current.querySelectorAll("*"));

    if (activeTab === "morphing") {
      // Simple shape morphing (without MorphSVG plugin)
      const circle = svgContainerRef.current.querySelector(".morph-circle");
      const square = svgContainerRef.current.querySelector(".morph-square");
      const star = svgContainerRef.current.querySelector(".morph-star");

      if (circle && square && star) {
        gsap.set([square, star], { opacity: 0 });
        gsap.set(circle, { opacity: 1 });

        const tl = gsap.timeline({ delay });

        // Circle to square
        tl.to(circle, {
          opacity: 0,
          duration: duration / 2,
          ease,
        })
          .to(
            square,
            {
              opacity: 1,
              duration: duration / 2,
              ease,
            },
            "-=${duration / 2}",
          )
          // Square to star
          .to(square, {
            opacity: 0,
            duration: duration / 2,
            ease,
            delay: 0.5,
          })
          .to(
            star,
            {
              opacity: 1,
              duration: duration / 2,
              ease,
            },
            "-=${duration / 2}",
          )
          // Star to circle
          .to(star, {
            opacity: 0,
            duration: duration / 2,
            ease,
            delay: 0.5,
          })
          .to(
            circle,
            {
              opacity: 1,
              duration: duration / 2,
              ease,
            },
            "-=${duration / 2}",
          );
      }
    } else if (activeTab === "drawing") {
      // SVG drawing animation
      const paths = svgContainerRef.current.querySelectorAll(".draw-path");

      // Reset paths
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // Animate drawing
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration,
        delay,
        ease,
        stagger,
      });
    } else if (activeTab === "coordinated") {
      // Coordinated SVG animation
      const circle = svgContainerRef.current.querySelector(".coord-circle");
      const rect = svgContainerRef.current.querySelector(".coord-rect");
      const path = svgContainerRef.current.querySelector(".coord-path");

      // Reset elements
      gsap.set(circle, { cx: 50, cy: 50, r: 20, fill: "#5733FF" });
      gsap.set(rect, { x: 100, y: 30, width: 40, height: 40, fill: "#33FF57" });
      gsap.set(path, { stroke: "#FF5733", strokeWidth: 3, fill: "none" });

      // Create timeline
      const tl = gsap.timeline({ delay });

      // Add animations
      tl.to(circle, {
        cx: 150,
        cy: 100,
        r: 30,
        fill: "#ff5733",
        duration,
        ease,
      })
        .to(
          rect,
          {
            x: 200,
            y: 50,
            width: 80,
            height: 40,
            fill: "#33ff57",
            duration,
            ease,
          },
          `-=${duration * 0.5}`,
        )
        .to(
          path,
          {
            attr: { d: "M50,150 Q100,50 150,150" },
            stroke: "#3357ff",
            duration,
            ease,
          },
          `-=${duration * 0.5}`,
        );
    }
  };

  // Run animation when settings change
  useEffect(() => {
    runAnimation();
    generateCode();
  }, [settings, activeTab]);

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GSAP SVG Animation Builder
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animation Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Animation Preview</CardTitle>
              <CardDescription>See your animation in action</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="morphing">Shape Morphing</TabsTrigger>
                  <TabsTrigger value="drawing">SVG Drawing</TabsTrigger>
                  <TabsTrigger value="coordinated">Coordinated</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div
                    ref={svgContainerRef}
                    className="flex justify-center items-center h-[300px] bg-muted/30 rounded-lg"
                  >
                    {activeTab === "morphing" && (
                      <svg width="300" height="300" viewBox="0 0 100 100">
                        {/* Circle */}
                        <circle
                          className="morph-circle"
                          cx="50"
                          cy="50"
                          r="30"
                          fill="#5733FF"
                        />
                        {/* Square */}
                        <rect
                          className="morph-square"
                          x="20"
                          y="20"
                          width="60"
                          height="60"
                          fill="#33FF57"
                        />
                        {/* Star */}
                        <path
                          className="morph-star"
                          d="M50,10 L61,40 L94,40 L67,60 L78,90 L50,70 L22,90 L33,60 L6,40 L39,40 Z"
                          fill="#FF5733"
                        />
                      </svg>
                    )}

                    {activeTab === "drawing" && (
                      <svg width="300" height="300" viewBox="0 0 100 100">
                        <path
                          className="draw-path"
                          d="M10,50 C20,30 40,30 50,50 C60,70 80,70 90,50"
                          stroke="#5733FF"
                          strokeWidth="3"
                          fill="none"
                        />
                        <path
                          className="draw-path"
                          d="M10,60 C30,80 70,80 90,60"
                          stroke="#33FF57"
                          strokeWidth="3"
                          fill="none"
                        />
                        <path
                          className="draw-path"
                          d="M10,40 C30,20 70,20 90,40"
                          stroke="#FF5733"
                          strokeWidth="3"
                          fill="none"
                        />
                      </svg>
                    )}

                    {activeTab === "coordinated" && (
                      <svg width="300" height="200" viewBox="0 0 300 200">
                        <circle
                          className="coord-circle"
                          cx="50"
                          cy="50"
                          r="20"
                          fill="#5733FF"
                        />
                        <rect
                          className="coord-rect"
                          x="100"
                          y="30"
                          width="40"
                          height="40"
                          fill="#33FF57"
                        />
                        <path
                          className="coord-path"
                          d="M50,100 Q100,150 150,100"
                          stroke="#FF5733"
                          strokeWidth="3"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button onClick={runAnimation}>Play Animation</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Animation Settings</CardTitle>
              <CardDescription>Customize your animation</CardDescription>
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
                <Label htmlFor="delay">Delay: {settings.delay}s</Label>
                <Slider
                  id="delay"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[settings.delay]}
                  onValueChange={(value) => updateSetting("delay", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stagger">Stagger: {settings.stagger}s</Label>
                <Slider
                  id="stagger"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={[settings.stagger]}
                  onValueChange={(value) => updateSetting("stagger", value[0])}
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              title="Copy to clipboard"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([generatedCode], {
                  type: "text/javascript",
                });
                element.href = URL.createObjectURL(file);
                element.download = `svg-animation-${activeTab}.js`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              title="Download as file"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{generatedCode}</code>
          </pre>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: Some SVG animations work with free GSAP, while others may
            require premium plugins
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
