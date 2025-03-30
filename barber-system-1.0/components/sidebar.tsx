"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, Scissors, BarChart, DollarSign, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const routes = [
    {
      name: "Gösterge Paneli",
      path: "/",
      icon: Calendar,
    },
    {
      name: "Randevular",
      path: "/appointments",
      icon: Calendar,
    },
    {
      name: "Müşteriler",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Hizmetler",
      path: "/services",
      icon: Scissors,
    },
    {
      name: "Raporlar",
      path: "/reports",
      icon: BarChart,
    },
    {
      name: "Satışlar",
      path: "/sales",
      icon: DollarSign,
    },
    {
      name: "Ayarlar",
      path: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg h-full">
      <div className="flex h-20 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Scissors className="h-6 w-6" />
          <span>BerberBook</span>
        </Link>
      </div>
      <div className="px-4 py-6 h-[calc(100%-5rem)] overflow-y-auto">
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === route.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-gray-700 hover:text-primary",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

