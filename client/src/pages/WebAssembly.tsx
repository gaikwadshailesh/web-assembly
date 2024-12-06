import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

declare function factorial(n: number): number;

export function WebAssembly() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [jsResult, setJsResult] = useState<number | null>(null);
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/factorial.js";
    script.onload = () => setWasmLoaded(true);
    document.body.appendChild(script);
  }, []);

  const calculateFactorial = () => {
    const n = parseInt(number);
    if (isNaN(n) || n < 0 || n > 20) {
      toast({
        title: "Invalid input",
        description: "Please enter a number between 0 and 20",
        variant: "destructive",
      });
      return;
    }

    const start = performance.now();
    setResult(factorial(n));
    const wasmTime = performance.now() - start;

    const jsStart = performance.now();
    let jsFactorial = 1;
    for (let i = 2; i <= n; i++) {
      jsFactorial *= i;
    }
    setJsResult(jsFactorial);
    const jsTime = performance.now() - jsStart;

    toast({
      title: "Performance Comparison",
      description: `WebAssembly: ${wasmTime.toFixed(
        2,
      )}ms\nJavaScript: ${jsTime.toFixed(2)}ms`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        WebAssembly Factorial Calculator
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Calculate Factorial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter a number (0-20)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="max-w-xs"
            />
            <Button
              onClick={calculateFactorial}
              disabled={!wasmLoaded}
            >
              Calculate
            </Button>
          </div>

          {result !== null && (
            <div className="space-y-2">
              <p>WebAssembly Result: {result}</p>
              <p>JavaScript Result: {jsResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
