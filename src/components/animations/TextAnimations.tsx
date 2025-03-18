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
  stagger: 0.05,
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

export default function TextAnimations() {
  const [settings, setSettings] = useState<AnimationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("split");
  const [generatedCode, setGeneratedCode] = useState("");

  const splitTextRef = useRef<HTMLDivElement>(null);
  const scrambleTextRef = useRef<HTMLDivElement>(null);
  const charByCharRef = useRef<HTMLDivElement>(null);

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

    if (activeTab === "split") {
      code = `// Split text animation
import { gsap } from 'gsap';

// Assuming you have a ref to your text element
const textElement = document.querySelector('.your-text-element');
const chars = textElement.textContent.split('');

// Clear the element and create spans for each character
textElement.innerHTML = '';
chars.forEach(char => {
  const span = document.createElement('span');
  span.textContent = char === ' ' ? '\u00A0' : char;
  textElement.appendChild(span);
});

// Animate each character
gsap.from(textElement.children, {
  opacity: 0,
  y: 20,
  duration: ${duration},
  delay: ${delay},
  ease: "${ease}",
  stagger: ${stagger},
});`;
    } else if (activeTab === "scramble") {
      code = `// Scramble text animation
import { gsap } from 'gsap';

// You'll need the ScrambleText plugin for GSAP
// This is a premium plugin: https://greensock.com/scrambletext/

// Assuming you have a ref to your text element
const textElement = document.querySelector('.your-text-element');
const originalText = textElement.textContent;

gsap.to(textElement, {
  duration: ${duration},
  delay: ${delay},
  scrambleText: {
    text: originalText,
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    speed: ${stagger * 10},
    ease: "${ease}",
  },
});`;
    } else if (activeTab === "charByChar") {
      code = `// Character by character animation
import { gsap } from 'gsap';

// Assuming you have a ref to your text element
const textElement = document.querySelector('.your-text-element');
const originalText = textElement.textContent;

// Clear the element
textElement.textContent = '';

// Create a timeline
const tl = gsap.timeline({
  delay: ${delay},
});

// Add each character one by one
for (let i = 0; i < originalText.length; i++) {
  tl.add(() => {
    textElement.textContent = originalText.substring(0, i + 1);
  }, i * ${stagger});
}

// Optional: add a blinking cursor effect
const cursor = document.createElement('span');
cursor.textContent = '|';
cursor.style.opacity = '1';
textElement.appendChild(cursor);

gsap.to(cursor, {
  opacity: 0,
  repeat: -1,
  yoyo: true,
  duration: 0.5,
});`;
    }

    setGeneratedCode(code);
  };

  // Run animation based on active tab
  const runAnimation = () => {
    const { duration, delay, ease, stagger } = settings;

    // Clear any existing animations
    gsap.killTweensOf([
      splitTextRef.current,
      scrambleTextRef.current,
      charByCharRef.current,
    ]);

    if (activeTab === "split" && splitTextRef.current) {
      // Reset
      splitTextRef.current.innerHTML = "Split Text Animation";

      // Create spans for each character
      const text = splitTextRef.current.textContent || "";
      const chars = text.split("");
      splitTextRef.current.innerHTML = "";

      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        splitTextRef.current?.appendChild(span);
      });

      // Animate
      gsap.from(splitTextRef.current.children, {
        opacity: 0,
        y: 20,
        duration,
        delay,
        ease,
        stagger,
      });
    }

    if (activeTab === "scramble" && scrambleTextRef.current) {
      // For scramble effect (simplified version without the premium plugin)
      const originalText = "Scramble Text Animation";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let currentText = "";

      for (let i = 0; i < originalText.length; i++) {
        currentText += chars[Math.floor(Math.random() * chars.length)];
      }

      scrambleTextRef.current.textContent = currentText;

      const interval = setInterval(() => {
        let newText = "";
        let complete = true;

        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() < 0.1 || currentText[i] === originalText[i]) {
            newText += originalText[i];
          } else {
            newText += chars[Math.floor(Math.random() * chars.length)];
            complete = false;
          }
        }

        scrambleTextRef.current!.textContent = newText;
        currentText = newText;

        if (complete) clearInterval(interval);
      }, stagger * 1000);
    }

    if (activeTab === "charByChar" && charByCharRef.current) {
      // Reset
      charByCharRef.current.textContent = "";

      const originalText = "Character By Character";
      const tl = gsap.timeline({ delay });

      // Add each character one by one
      for (let i = 0; i < originalText.length; i++) {
        tl.add(() => {
          charByCharRef.current!.textContent = originalText.substring(0, i + 1);
        }, i * stagger);
      }

      // Add blinking cursor
      tl.add(() => {
        const cursor = document.createElement("span");
        cursor.textContent = "|";
        cursor.style.opacity = "1";
        charByCharRef.current?.appendChild(cursor);

        gsap.to(cursor, {
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: 0.5,
        });
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
        GSAP Text Animation Builder
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animation Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Animation Preview</CardTitle>
              <CardDescription>See your animation in action</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[300px]">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="split" className="bg-[#e52626]">
                    Split Text
                  </TabsTrigger>
                  <TabsTrigger value="scramble">Scramble Text</TabsTrigger>
                  <TabsTrigger value="charByChar">Char by Char</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="split"
                  className="flex justify-center items-center min-h-[200px]"
                >
                  <div
                    ref={splitTextRef}
                    className="text-3xl font-bold text-center"
                  >
                    Split Text Animation
                  </div>
                </TabsContent>

                <TabsContent
                  value="scramble"
                  className="flex justify-center items-center min-h-[200px]"
                >
                  <div
                    ref={scrambleTextRef}
                    className="text-3xl font-bold text-center"
                  >
                    Scramble Text Animation
                  </div>
                </TabsContent>

                <TabsContent
                  value="charByChar"
                  className="flex justify-center items-center min-h-[200px]"
                >
                  <div
                    ref={charByCharRef}
                    className="text-3xl font-bold text-center"
                  >
                    Character By Character
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={runAnimation} className="mt-4">
                Play Animation
              </Button>
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
                element.download = `text-animation-${activeTab}.js`;
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
            Note: Some animations may require premium GSAP plugins
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
