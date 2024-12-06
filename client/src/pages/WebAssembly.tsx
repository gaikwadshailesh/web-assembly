import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Declare factorial as a property of the window object
declare global {
  interface Window {
    factorial: (n: number) => number;
  }
}

export function WebAssembly() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [jsResult, setJsResult] = useState<number | null>(null);
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<Array<{
    input: number;
    wasmTime: number;
    jsTime: number;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const script = document.createElement("script");
        script.src = "/factorial.js";
        script.async = true;
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.body.appendChild(script);
        await loadPromise;
        
        // Initialize the WebAssembly module
        const Module = await (window as any).createModule();
        window.factorial = Module.cwrap('factorial', 'number', ['number']);

        setWasmLoaded(true);
        toast({
          title: "WebAssembly Loaded",
          description: "Factorial calculator is ready to use",
        });
      } catch (error) {
        console.error("Failed to load WebAssembly:", error);
        toast({
          title: "Error",
          description: "Failed to load WebAssembly module",
          variant: "destructive",
        });
      }
    };

    loadWasm();
    
    return () => {
      const script = document.querySelector('script[src="/factorial.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [toast]);

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
    setResult(window.factorial(n));
    const wasmTime = performance.now() - start;

    const jsStart = performance.now();
    let jsFactorial = 1;
    for (let i = 2; i <= n; i++) {
      jsFactorial *= i;
    }
    setJsResult(jsFactorial);
    const jsTime = performance.now() - jsStart;

    // Update performance history
    setPerformanceHistory(prev => [...prev, {
      input: n,
      wasmTime,
      jsTime
    }]);

    toast({
      title: "Performance Comparison",
      description: `WebAssembly: ${wasmTime.toFixed(2)}ms\nJavaScript: ${jsTime.toFixed(2)}ms`,
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

      {performanceHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="input" label={{ value: 'Input Number', position: 'bottom' }} />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'left' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="wasmTime" name="WebAssembly" stroke="#8884d8" />
                  <Line type="monotone" dataKey="jsTime" name="JavaScript" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
