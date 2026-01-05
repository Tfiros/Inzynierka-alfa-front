import { Link } from "react-router-dom"
import { Button } from "@/shared/components/Button"
import { Facebook, Instagram, Twitter } from "lucide-react"
import CrossTradeLogo from "@/shared/photos/CrossTradeLogo.png"

export const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="w-full border-t bg-background/80">
      <div className="flex h-24 w-full items-center justify-between px-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src={CrossTradeLogo}
            alt="CROSSTRADE"
            className="h-15 w-15 object-contain"
          />
          <span className="font-semibold tracking-wide">CROSSTRADE</span>
        </Link>

        <p className="text-sm text-muted-foreground">
          © {year} CROSSTRADE. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <a href="#">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <a href="https://www.instagram.com/crosstradeshop/">
              <Instagram className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <a href="https://x.com/CorssTradeShop">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
