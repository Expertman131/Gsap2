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
import { Switch } from "@/components/ui/switch";

interface AnimationSettings {
  duration: number;
  ease: string;
  start: string;
  end: string;
  scrub: boolean;
  scrubAmount: number;
  markers: boolean;
  toggleActions: string;
}

const defaultSettings: AnimationSettings = {
  duration: 1,
  ease: "power2.out",
  start: "top 80%",
  end: "bottom 20%",
  scrub: false,
  scrubAmount: 1,
  markers: false,
  toggleActions: "play none none reverse",
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

const toggleActionsOptions = [
  "play none none reverse",
  "play none none none",
  "play pause resume reset",
  "play pause reverse pause",
  "restart none none none",
  "restart pause resume reset",
];

export default function ScrollAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("fadeIn");
  const [generatedCode, setGeneratedCode] = useState("");
  const scrollDemoRef = useRef<HTMLDivElement>(null);

  // Update settings
  const updateSetting = (
    key: keyof AnimationSettings,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Generate code based on current settings and animation type
  const generateCode = () => {
    let code = "";
    const {
      duration,
      ease,
      start,
      end,
      scrub,
      scrubAmount,
      markers,
      toggleActions,
    } = settings;

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
      toggleActions: "${toggleActions}",
      ${scrub ? `scrub: ${scrubAmount === 1 ? "true" : scrubAmount},` : ""}
      ${markers ? "markers: true," : ""}
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
      scrub: ${scrub ? (scrubAmount === 1 ? "true" : scrubAmount) : "true"}, // Makes the animation progress based on scroll position
      ${markers ? "markers: true," : ""}
      ${!scrub ? `toggleActions: "${toggleActions}",` : ""}
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
  ${scrub ? `scrub: ${scrubAmount === 1 ? "true" : scrubAmount},` : ""}
  ${markers ? "markers: true," : ""}
  toggleActions: "${toggleActions}",
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

    // Set up scroll demo
    if (scrollDemoRef.current) {
      // Register ScrollTrigger plugin if needed
      if (typeof gsap.registerPlugin === "function") {
        try {
          // Try to dynamically import ScrollTrigger
          import("gsap/ScrollTrigger")
            .then((module) => {
              const ScrollTrigger = module.ScrollTrigger;
              gsap.registerPlugin(ScrollTrigger);

              // Add a small delay to prevent immediate triggering
              setTimeout(() => {
                setupScrollAnimations();
              }, 500);
            })
            .catch(() => {
              console.warn(
                "ScrollTrigger plugin not available. Using basic animations instead.",
              );
              setupBasicAnimations();
            });
        } catch (e) {
          console.warn("Error loading ScrollTrigger:", e);
          setupBasicAnimations();
        }
      } else {
        setupBasicAnimations();
      }
    }

    function setupScrollAnimations() {
      const {
        duration,
        ease,
        start,
        end,
        scrub,
        scrubAmount,
        markers,
        toggleActions,
      } = settings;
      const ScrollTrigger = (gsap as any).ScrollTrigger;

      // Clear any existing animations
      try {
        if (ScrollTrigger && ScrollTrigger.getAll) {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
        }
      } catch (e) {
        console.warn("Error clearing ScrollTrigger animations:", e);
      }
      gsap.killTweensOf(".scroll-demo-item");

      const container = scrollDemoRef.current;
      if (!container) return;

      const demoItems = container.querySelectorAll(".scroll-demo-item");

      if (activeTab === "fadeIn") {
        demoItems.forEach((item) => {
          gsap.set(item, { opacity: 0, y: 50 });

          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration,
            ease,
            scrollTrigger: {
              trigger: item,
              start,
              end,
              toggleActions,
              scrub: scrub ? (scrubAmount === 1 ? true : scrubAmount) : false,
              markers,
            },
          });
        });
      } else if (activeTab === "parallax") {
        const layers = container.querySelectorAll(".parallax-layer");

        layers.forEach((layer, index) => {
          const speed = (index + 1) * -20; // Different speeds for different layers

          gsap.to(layer, {
            y: speed,
            ease,
            scrollTrigger: {
              trigger: container,
              start,
              end,
              scrub: scrub ? (scrubAmount === 1 ? true : scrubAmount) : true,
              markers,
              toggleActions: !scrub ? toggleActions : undefined,
            },
          });
        });
      } else if (activeTab === "stagger") {
        const staggerItems = container.querySelectorAll(".stagger-item");

        ScrollTrigger.create({
          trigger: container,
          start,
          end,
          scrub: scrub ? (scrubAmount === 1 ? true : scrubAmount) : false,
          markers,
          toggleActions,
          onEnter: () => {
            gsap.from(staggerItems, {
              opacity: 0,
              y: 50,
              stagger: 0.1,
              duration,
              ease,
            });
          },
          onLeaveBack: () => {
            gsap.to(staggerItems, {
              opacity: 0,
              y: 50,
              stagger: 0.05,
              duration: duration / 2,
            });
          },
        });
      }
    }

    function setupBasicAnimations() {
      // Fallback animations without ScrollTrigger
      const container = scrollDemoRef.current;
      if (!container) return;

      const demoItems = container.querySelectorAll(".scroll-demo-item");

      if (activeTab === "fadeIn") {
        gsap.fromTo(
          demoItems,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: settings.duration,
            ease: settings.ease,
            stagger: 0.2,
          },
        );
      } else if (activeTab === "parallax") {
        const layers = container.querySelectorAll(".parallax-layer");

        layers.forEach((layer, index) => {
          const speed = (index + 1) * -20;
          gsap.to(layer, {
            y: speed,
            duration: settings.duration,
            ease: settings.ease,
          });
        });
      } else if (activeTab === "stagger") {
        const staggerItems = container.querySelectorAll(".stagger-item");

        gsap.fromTo(
          staggerItems,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: settings.duration,
            ease: settings.ease,
            stagger: 0.1,
          },
        );
      }
    }

    // Cleanup function
    return () => {
      if (typeof gsap.registerPlugin === "function") {
        try {
          const ScrollTrigger = (gsap as any).ScrollTrigger;
          if (ScrollTrigger && ScrollTrigger.getAll) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
          }
        } catch (e) {
          console.warn("Error cleaning up ScrollTrigger:", e);
        }
      }
      gsap.killTweensOf(".scroll-demo-item");
    };
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

                <TabsContent value={activeTab}>
                  <div
                    ref={scrollDemoRef}
                    className="overflow-y-auto h-[400px] bg-muted/30 rounded-lg p-4 scroll-demo-container"
                  >
                    {activeTab === "fadeIn" && (
                      <div className="space-y-8 py-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="scroll-demo-item bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg"
                          >
                            <h3 className="text-xl font-semibold mb-2">
                              Scroll Item {i}
                            </h3>
                            <p className="text-muted-foreground">
                              This element will fade in as you scroll down the
                              page. Try scrolling to see the animation in
                              action.
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "parallax" && (
                      <div className="relative h-[800px] overflow-hidden">
                        <div className="sticky top-0 h-[400px] overflow-hidden">
                          <div className="parallax-layer absolute inset-0 flex items-center justify-center bg-primary/10 text-2xl font-bold">
                            Background Layer
                          </div>
                          <div className="parallax-layer absolute inset-0 flex items-center justify-center bg-transparent text-2xl font-bold">
                            <div className="w-32 h-32 bg-primary/30 rounded-lg flex items-center justify-center">
                              Middle Layer
                            </div>
                          </div>
                          <div className="parallax-layer absolute inset-0 flex items-center justify-center bg-transparent text-2xl font-bold">
                            <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                              Front Layer
                            </div>
                          </div>
                        </div>
                        <div className="h-[400px] flex items-center justify-center">
                          <p className="text-center text-muted-foreground">
                            Scroll back up to see the parallax effect again
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "stagger" && (
                      <div className="space-y-8 py-8 stagger-container">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                          Staggered Elements
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                              key={i}
                              className="stagger-item w-full aspect-square bg-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl"
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                        <p className="text-center text-muted-foreground">
                          Scroll down to see more staggered elements
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-[200px]">
                          {[9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
                            <div
                              key={i}
                              className="stagger-item w-full aspect-square bg-secondary/80 rounded-lg flex items-center justify-center text-secondary-foreground font-bold text-xl"
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-6">
                    <p className="text-center text-muted-foreground">
                      Scroll inside the box above to see the animations
                    </p>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scrub">Scrub Animation</Label>
                  <Switch
                    id="scrub"
                    checked={settings.scrub}
                    onCheckedChange={(checked) =>
                      updateSetting("scrub", checked)
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ties animation progress to scroll position
                </p>
              </div>

              {settings.scrub && (
                <div className="space-y-2">
                  <Label htmlFor="scrubAmount">
                    Scrub Smoothness:{" "}
                    {settings.scrubAmount === 1 ? "None" : settings.scrubAmount}
                  </Label>
                  <Slider
                    id="scrubAmount"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={[settings.scrubAmount]}
                    onValueChange={(value) =>
                      updateSetting("scrubAmount", value[0])
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values create smoother scrubbing (1 = no smoothing)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="markers">Show Markers</Label>
                  <Switch
                    id="markers"
                    checked={settings.markers}
                    onCheckedChange={(checked) =>
                      updateSetting("markers", checked)
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Displays visual markers for trigger points (development only)
                </p>
              </div>

              {!settings.scrub && (
                <div className="space-y-2">
                  <Label htmlFor="toggleActions">Toggle Actions</Label>
                  <Select
                    value={settings.toggleActions}
                    onValueChange={(value) =>
                      updateSetting("toggleActions", value)
                    }
                  >
                    <SelectTrigger id="toggleActions">
                      <SelectValue placeholder="Select toggle actions" />
                    </SelectTrigger>
                    <SelectContent>
                      {toggleActionsOptions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Controls how animation responds to scrolling (onEnter,
                    onLeave, onEnterBack, onLeaveBack)
                  </p>
                </div>
              )}
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
                element.download = `scroll-animation-${activeTab}.js`;
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
            Note: ScrollTrigger is a premium GSAP plugin and requires
            registration
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
