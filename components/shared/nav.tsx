import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import Image from "next/image"

export function Nav() {
  return (
    <header className="sticky top-0 z-50  w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center  w-full justify-between">
      

        <Link href="/">
        <div className="flex flex-1 items-center  ml-2">
          <div className="flex  items-center gap-2 rounded-lg py-2 hover:bg-accent transition-colors">
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

   
        <div className="flex items-center gap-4">
   

          
          <Button disabled variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Events</span>
          </Button>

     
          <Button variant="ghost" disabled size="sm" className="hidden sm:inline-flex">
            Docs
          </Button>
        
          </div>
       
          <div className='mr-2'>
          <ModeToggle  />
          </div>
        
       
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </header>
  )
}