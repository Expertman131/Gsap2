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
  scale: number;
  rotation: number;
  ease: string;
}

const defaultSettings: AnimationSettings = {
  duration: 0.3,
  scale: 1.1,
  rotation: 0,
  ease: "power2.out",
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

export default function InteractionAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("hover");
  const [generatedCode, setGeneratedCode] = useState("");

  const interactionContainerRef = useRef<HTMLDivElement>(null);

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
    const { duration, scale, rotation, ease } = settings;

    if (activeTab === "hover") {
      code = `// Hover Animation
import { gsap } from 'gsap';

// Assuming you have elements with the class 'hover-element'
const elements = document.querySelectorAll('.hover-element');

elements.forEach(element => {
  // Set up hover animations
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: ${scale},
      rotation: ${rotation},
      duration: ${duration},
      ease: "${ease}"
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      rotation: 0,
      duration: ${duration},
      ease: "${ease}"
    });
  });
});
`;
    } else if (activeTab === "click") {
      code = `// Click Animation
import { gsap } from 'gsap';

// Assuming you have elements with the class 'click-element'
const elements = document.querySelectorAll('.click-element');

elements.forEach(element => {
  // Set up click animation
  element.addEventListener('click', () => {
    // Quick scale down and up animation
    gsap.timeline()
      .to(element, {
        scale: 0.9,
        duration: ${duration / 2},
        ease: "${ease}"
      })
      .to(element, {
        scale: 1,
        duration: ${duration / 2},
        ease: "bounce.out"
      });
      
    // Optional: Add a rotation or other effect
    if (${rotation !== 0}) {
      gsap.to(element, {
        rotation: ${rotation},
        duration: ${duration},
        ease: "${ease}",
        yoyo: true,
        repeat: 1
      });
    }
  });
});
`;
    } else if (activeTab === "focus") {
      code = `// Focus Animation for Form Elements
import { gsap } from 'gsap';

// Assuming you have form elements with the class 'focus-element'
const elements = document.querySelectorAll('.focus-element');

elements.forEach(element => {
  // Create a highlight element or use a parent container
  const highlight = document.createElement('div');
  highlight.className = 'focus-highlight';
  element.parentNode.insertBefore(highlight, element);
  highlight.appendChild(element);
  
  // Position the highlight behind the input
  gsap.set(highlight, {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    borderRadius: '4px',
    zIndex: -1,
    scale: 0.95,
    opacity: 0
  });
  
  // Set up focus animations
  element.addEventListener('focus', () => {
    gsap.to(highlight, {
      scale: 1,
      opacity: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light blue highlight
      duration: ${duration},
      ease: "${ease}"
    });
    
    gsap.to(element, {
      scale: ${scale},
      duration: ${duration},
      ease: "${ease}"
    });
  });
  
  element.addEventListener('blur', () => {
    gsap.to(highlight, {
      scale: 0.95,
      opacity: 0,
      duration: ${duration},
      ease: "${ease}"
    });
    
    gsap.to(element, {
      scale: 1,
      duration: ${duration},
      ease: "${ease}"
    });
  });
});
`;
    }

    setGeneratedCode(code);
  };

  // Download code as a file
  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: "text/javascript" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTab}-animation.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Set up interaction demos
  useEffect(() => {
    if (!interactionContainerRef.current) return;

    const { duration, scale, rotation, ease } = settings;

    // Clear any existing event listeners by cloning and replacing elements
    const container = interactionContainerRef.current;
    const elements = container.querySelectorAll(".demo-element");

    elements.forEach((el) => {
      const newEl = el.cloneNode(true);
      el.parentNode?.replaceChild(newEl, el);
    });

    // Set up new event listeners
    const newElements = container.querySelectorAll(".demo-element");

    if (activeTab === "hover") {
      newElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            scale,
            rotation,
            duration,
            ease,
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            scale: 1,
            rotation: 0,
            duration,
            ease,
          });
        });
      });
    } else if (activeTab === "click") {
      newElements.forEach((el) => {
        el.addEventListener("click", () => {
          // Quick scale down and up animation
          gsap
            .timeline()
            .to(el, {
              scale: 0.9,
              duration: duration / 2,
              ease,
            })
            .to(el, {
              scale: 1,
              duration: duration / 2,
              ease: "bounce.out",
            });

          // Optional rotation
          if (rotation !== 0) {
            gsap.to(el, {
              rotation,
              duration,
              ease,
              yoyo: true,
              repeat: 1,
            });
          }
        });
      });
    } else if (activeTab === "focus") {
      // For focus demo, we'll use a simplified version
      newElements.forEach((el) => {
        const input = el.querySelector("input");
        if (!input) return;

        // Create a highlight element if it doesn't exist
        let highlight = el.querySelector(".focus-highlight");
        if (!highlight) {
          highlight = document.createElement("div");
          highlight.className = "focus-highlight";
          highlight.style.position = "absolute";
          highlight.style.width = "100%";
          highlight.style.height = "100%";
          highlight.style.top = "0";
          highlight.style.left = "0";
          highlight.style.backgroundColor = "transparent";
          highlight.style.borderRadius = "4px";
          highlight.style.zIndex = "-1";
          highlight.style.opacity = "0";
          el.style.position = "relative";
          el.insertBefore(highlight, input);
        }

        input.addEventListener("focus", () => {
          gsap.to(highlight, {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            opacity: 1,
            duration,
            ease,
          });

          gsap.to(el, {
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
            scale,
            duration,
            ease,
          });
        });

        input.addEventListener("blur", () => {
          gsap.to(highlight, {
            backgroundColor: "transparent",
            opacity: 0,
            duration,
            ease,
          });

          gsap.to(el, {
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
            scale: 1,
            duration,
            ease,
          });
        });
      });
    }

    // Generate code
    generateCode();
  }, [settings, activeTab]);

  return (
    <div className="w-full bg-background p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GSAP Interaction Animation Builder
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animation Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interaction Preview</CardTitle>
              <CardDescription>
                {activeTab === "hover"
                  ? "Hover over the elements"
                  : activeTab === "click"
                    ? "Click on the elements"
                    : "Click in the input field"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="hover">Hover</TabsTrigger>
                  <TabsTrigger value="click">Click</TabsTrigger>
                  <TabsTrigger value="focus">Focus</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div
                    ref={interactionContainerRef}
                    className="flex flex-wrap justify-center items-center gap-6 h-[300px] bg-muted/30 rounded-lg p-4"
                  >
                    {activeTab === "focus" ? (
                      <div className="demo-element bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-64">
                        <label className="block text-sm font-medium mb-2">
                          Focus on this input
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Click here..."
                        />
                      </div>
                    ) : (
                      <>
                        <div className="demo-element w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold cursor-pointer">
                          {activeTab === "hover" ? "Hover" : "Click"}
                        </div>
                        <div className="demo-element w-24 h-24 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-bold cursor-pointer">
                          {activeTab === "hover" ? "Me" : "Me"}
                        </div>
                        <div className="demo-element w-24 h-24 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold cursor-pointer">
                          {activeTab === "hover" ? "Now" : "Now"}
                        </div>
                      </>
                    )}
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
              <CardDescription>Customize your interaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration: {settings.duration}s</Label>
                <Slider
                  id="duration"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={[settings.duration]}
                  onValueChange={(value) => updateSetting("duration", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scale">Scale: {settings.scale}x</Label>
                <Slider
                  id="scale"
                  min={0.8}
                  max={1.5}
                  step={0.05}
                  value={[settings.scale]}
                  onValueChange={(value) => updateSetting("scale", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rotation">Rotation: {settings.rotation}°</Label>
                <Slider
                  id="rotation"
                  min={0}
                  max={360}
                  step={5}
                  value={[settings.rotation]}
                  onValueChange={(value) => updateSetting("rotation", value[0])}
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
              onClick={downloadCode}
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
            Note: These interaction animations work with the free version of
            GSAP
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
