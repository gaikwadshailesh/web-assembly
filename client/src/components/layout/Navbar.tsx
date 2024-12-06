import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Table, Video, Calculator } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", text: "Home", icon: Home },
    { href: "/data", text: "Data", icon: Table },
    { href: "/video", text: "Video Chat", icon: Video },
    { href: "/wasm", text: "WebAssembly", icon: Calculator },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          {links.map(({ href, text, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant={location === href ? "default" : "ghost"}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {text}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
