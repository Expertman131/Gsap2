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
  staggerTime: number;
  ease: string;
  repeat: number;
}

const defaultSettings: AnimationSettings = {
  duration: 0.5,
  staggerTime: 0.2,
  ease: "power2.out",
  repeat: 0,
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

export default function TimelineAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("sequence");
  const [generatedCode, setGeneratedCode] = useState("");

  const timelineContainerRef = useRef<HTMLDivElement>(null);

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
    const { duration, staggerTime, ease, repeat } = settings;

    if (activeTab === "sequence") {
      code = `// Sequential Timeline Animation
import { gsap } from 'gsap';

// Assuming you have elements with these classes
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');
const box3 = document.querySelector('.box3');

// Create a timeline
const tl = gsap.timeline({
  repeat: ${repeat},
  repeatDelay: 0.5,
  yoyo: true
});

// Add animations sequentially
tl.to(box1, {
  x: 100,
  duration: ${duration},
  ease: "${ease}"
})
.to(box2, {
  y: 50,
  duration: ${duration},
  ease: "${ease}"
})
.to(box3, {
  rotation: 180,
  duration: ${duration},
  ease: "${ease}"
});

// This is a basic timeline sequence that plays one after another`;
    } else if (activeTab === "position") {
      code = `// Position Parameter Timeline Animation
import { gsap } from 'gsap';

// Assuming you have elements with these classes
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');
const box3 = document.querySelector('.box3');

// Create a timeline
const tl = gsap.timeline({
  repeat: ${repeat},
  repeatDelay: 0.5,
  yoyo: true
});

// Add animations with position parameters
tl.to(box1, {
  x: 100,
  duration: ${duration},
  ease: "${ease}"
})
.to(box2, {
  y: 50,
  duration: ${duration},
  ease: "${ease}"
}, "-=${duration / 2}") // Starts halfway through the previous animation
.to(box3, {
  rotation: 180,
  duration: ${duration},
  ease: "${ease}"
}, "<"); // Starts at the same time as the previous animation

// Position parameters control when animations start relative to the timeline`;
    } else if (activeTab === "stagger") {
      code = `// Staggered Timeline Animation
import { gsap } from 'gsap';

// Assuming you have elements with this class
const boxes = document.querySelectorAll('.stagger-box');

// Create a timeline
const tl = gsap.timeline({
  repeat: ${repeat},
  repeatDelay: 0.5,
  yoyo: true
});

// Add a staggered animation
tl.to(boxes, {
  y: 50,
  opacity: 1,
  duration: ${duration},
  stagger: ${staggerTime},
  ease: "${ease}"
})
.to(boxes, {
  x: 100,
  backgroundColor: "#ff5733",
  duration: ${duration},
  stagger: ${staggerTime},
  ease: "${ease}"
})
.to(boxes, {
  y: 0,
  x: 0,
  backgroundColor: "#3357ff",
  duration: ${duration},
  stagger: ${staggerTime},
  ease: "${ease}"
});

// Staggered animations apply to multiple elements with a time offset`;
    }

    setGeneratedCode(code);
  };

  // Run animation based on active tab
  const runAnimation = () => {
    if (!timelineContainerRef.current) return;

    const { duration, staggerTime, ease, repeat } = settings;

    // Clear any existing animations
    gsap.killTweensOf(timelineContainerRef.current.querySelectorAll("*"));

    // Reset elements
    gsap.set(timelineContainerRef.current.querySelectorAll(".box"), {
      clearProps: "all",
    });

    if (activeTab === "sequence") {
      const box1 = timelineContainerRef.current.querySelector(".box1");
      const box2 = timelineContainerRef.current.querySelector(".box2");
      const box3 = timelineContainerRef.current.querySelector(".box3");

      // Create timeline
      const tl = gsap.timeline({
        repeat,
        repeatDelay: 0.5,
        yoyo: true,
      });

      // Add animations sequentially
      tl.to(box1, {
        x: 100,
        duration,
        ease,
      })
        .to(box2, {
          y: 50,
          duration,
          ease,
        })
        .to(box3, {
          rotation: 180,
          duration,
          ease,
        });
    } else if (activeTab === "position") {
      const box1 = timelineContainerRef.current.querySelector(".box1");
      const box2 = timelineContainerRef.current.querySelector(".box2");
      const box3 = timelineContainerRef.current.querySelector(".box3");

      // Create timeline
      const tl = gsap.timeline({
        repeat,
        repeatDelay: 0.5,
        yoyo: true,
      });

      // Add animations with position parameters
      tl.to(box1, {
        x: 100,
        duration,
        ease,
      })
        .to(
          box2,
          {
            y: 50,
            duration,
            ease,
          },
          `-=${duration / 2}`, // Starts halfway through the previous animation
        )
        .to(
          box3,
          {
            rotation: 180,
            duration,
            ease,
          },
          "<", // Starts at the same time as the previous animation
        );
    } else if (activeTab === "stagger") {
      const boxes =
        timelineContainerRef.current.querySelectorAll(".stagger-box");

      // Reset boxes
      gsap.set(boxes, { y: 0, x: 0, opacity: 0.5, backgroundColor: "#3357ff" });

      // Create timeline
      const tl = gsap.timeline({
        repeat,
        repeatDelay: 0.5,
        yoyo: true,
      });

      // Add staggered animations
      tl.to(boxes, {
        y: 50,
        opacity: 1,
        duration,
        stagger: staggerTime,
        ease,
      })
        .to(boxes, {
          x: 100,
          backgroundColor: "#ff5733",
          duration,
          stagger: staggerTime,
          ease,
        })
        .to(boxes, {
          y: 0,
          x: 0,
          backgroundColor: "#3357ff",
          duration,
          stagger: staggerTime,
          ease,
        });
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
        GSAP Timeline Animation Builder
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
                  <TabsTrigger value="sequence">Sequence</TabsTrigger>
                  <TabsTrigger value="position">Position</TabsTrigger>
                  <TabsTrigger value="stagger">Stagger</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div
                    ref={timelineContainerRef}
                    className="flex flex-col items-center justify-center h-[300px] bg-muted/30 rounded-lg p-4"
                  >
                    {(activeTab === "sequence" || activeTab === "position") && (
                      <div className="space-y-4 w-full max-w-md">
                        <div className="box box1 w-16 h-16 bg-primary rounded-lg"></div>
                        <div className="box box2 w-16 h-16 bg-secondary rounded-lg"></div>
                        <div className="box box3 w-16 h-16 bg-accent rounded-lg"></div>
                      </div>
                    )}

                    {activeTab === "stagger" && (
                      <div className="grid grid-cols-5 gap-2 w-full max-w-md">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="stagger-box w-12 h-12 bg-blue-500 rounded-lg opacity-50"
                          ></div>
                        ))}
                      </div>
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
              <CardDescription>Customize your timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration: {settings.duration}s</Label>
                <Slider
                  id="duration"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[settings.duration]}
                  onValueChange={(value) => updateSetting("duration", value[0])}
                />
              </div>

              {activeTab === "stagger" && (
                <div className="space-y-2">
                  <Label htmlFor="staggerTime">
                    Stagger Time: {settings.staggerTime}s
                  </Label>
                  <Slider
                    id="staggerTime"
                    min={0}
                    max={0.5}
                    step={0.05}
                    value={[settings.staggerTime]}
                    onValueChange={(value) =>
                      updateSetting("staggerTime", value[0])
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="repeat">
                  Repeat:{" "}
                  {settings.repeat === -1 ? "Infinite" : settings.repeat}
                </Label>
                <Slider
                  id="repeat"
                  min={0}
                  max={5}
                  step={1}
                  value={[settings.repeat]}
                  onValueChange={(value) => updateSetting("repeat", value[0])}
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
                element.download = `timeline-animation-${activeTab}.js`;
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
            Note: Timelines are a core feature of GSAP and don't require any
            premium plugins
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
