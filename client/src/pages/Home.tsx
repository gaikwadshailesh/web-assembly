import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Our Full-Stack Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore our features showcasing modern web technologies
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Browse GitHub users with sorting and filtering capabilities.</p>
            <Link href="/data">
              <Button className="w-full gap-2">
                View Data <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Experience real-time video communication with WebRTC.</p>
            <Link href="/video">
              <Button className="w-full gap-2">
                Start Chat <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WebAssembly Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Calculate factorials using high-performance WebAssembly.</p>
            <Link href="/wasm">
              <Button className="w-full gap-2">
                Try Demo <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
