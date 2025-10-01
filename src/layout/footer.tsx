import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
   const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-background/80">
         <div className="flex h-24 w-full items-center justify-between px-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.svg" alt="CROSSTRADE" className="h-10 w-10 object-contain" />
            <span className="font-semibold tracking-wide">CROSSTRADE</span>
          </Link>

          <p className="text-sm text-muted-foreground">© {year} CROSSTRADE. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="rounded-full"><a href="#"><Facebook className="h-4 w-4" /></a></Button>
            <Button asChild variant="outline" size="icon" className="rounded-full"><a href="#"><Linkedin className="h-4 w-4" /></a></Button>
            <Button asChild variant="outline" size="icon" className="rounded-full"><a href="#"><Twitter className="h-4 w-4" /></a></Button>
          </div>
        </div>
    </footer>
  );
}
