// app/_components/nav/index.tsx

import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { Logo } from "./logo"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import Image from "next/image"

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center w-full justify-between">
        {/* Brand Section */}


        <Link href="/">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent transition-colors">
            <Image
                src="/rapidevents.png"
                alt="RapidEvents Logo"
                width={60}
                height={30}
                />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight brand-gradient">
                RapidEvents
              </span>
              <span className="text-xs text-muted-foreground">
                Event Signup
              </span>
            </div>
          </div>
        </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          {/* Optional: Add navigation items or actions */}

          
          <Button disabled variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Events</span>
          </Button>

          {/* Optional: Add documentation or help link */}
          <Button variant="ghost" disabled size="sm" className="hidden sm:inline-flex">
            Docs
          </Button>
        
          </div>
          {/* Theme Toggle */}
          <ModeToggle />
       
      </div>

      {/* Optional: Add a colored line under the header */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </header>
  )
}