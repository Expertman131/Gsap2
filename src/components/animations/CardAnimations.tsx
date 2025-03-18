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

export default function CardAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("fade");
  const [generatedCode, setGeneratedCode] = useState("");

  const cardContainerRef = useRef<HTMLDivElement>(null);

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

    if (activeTab === "fade") {
      code = `// Fade animation
import { gsap } from 'gsap';

// Assuming you have a ref to your card container
const cardContainer = document.querySelector('.card-container');
const cards = cardContainer.querySelectorAll('.card');

gsap.from(cards, {
  opacity: 0,
  y: 50,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  stagger: ${stagger},
});`;
    } else if (activeTab === "flip") {
      code = `// Flip animation
import { gsap } from 'gsap';

// Assuming you have a ref to your card container
const cardContainer = document.querySelector('.card-container');
const cards = cardContainer.querySelectorAll('.card');

gsap.from(cards, {
  opacity: 0,
  rotationY: 180,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  stagger: ${stagger},
});`;
    } else if (activeTab === "scale") {
      code = `// Scale animation
import { gsap } from 'gsap';

// Assuming you have a ref to your card container
const cardContainer = document.querySelector('.card-container');
const cards = cardContainer.querySelectorAll('.card');

gsap.from(cards, {
  opacity: 0,
  scale: 0.5,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  stagger: ${stagger},
});`;
    }

    setGeneratedCode(code);
  };

  // Run animation based on active tab
  const runAnimation = () => {
    if (!cardContainerRef.current) return;

    const { duration, delay, ease, stagger } = settings;
    const cards = cardContainerRef.current.querySelectorAll(".card");

    // Clear any existing animations
    gsap.killTweensOf(cards);

    // Reset cards
    gsap.set(cards, { clearProps: "all" });

    if (activeTab === "fade") {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration, delay, ease, stagger },
      );
    } else if (activeTab === "flip") {
      gsap.fromTo(
        cards,
        { opacity: 0, rotationY: 180, transformPerspective: 800 },
        { opacity: 1, rotationY: 0, duration, delay, ease, stagger },
      );
    } else if (activeTab === "scale") {
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration, delay, ease, stagger },
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
        GSAP Card Animation Builder
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
                  <TabsTrigger value="fade">Fade</TabsTrigger>
                  <TabsTrigger value="flip">Flip</TabsTrigger>
                  <TabsTrigger value="scale">Scale</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <div
                    ref={cardContainerRef}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="card bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-semibold mb-2">Card {i}</h3>
                        <p className="text-muted-foreground">
                          This is an animated card using GSAP
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mt-6">
                <Button onClick={runAnimation}>Play Animation</Button>
              </div>
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
            Note: Some animations may require additional GSAP configuration
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
