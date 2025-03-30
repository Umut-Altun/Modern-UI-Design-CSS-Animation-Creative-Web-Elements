import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { initDatabase, seedInitialData } from "@/lib/db"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BerberBook - Randevu Sistemi",
  description: "Modern berber randevu ve yönetim sistemi",
    generator: 'v0.dev'
}

// Initialize the database
let dbInitialized = false

// This function will run once on the server
async function initializeDatabase() {
  if (!dbInitialized) {
    dbInitialized = true
    try {
      console.log("Starting database initialization...")
      const initialized = await initDatabase()
      if (initialized) {
        await seedInitialData()
        console.log("Database initialization complete")
      } else {
        console.log("Database initialization skipped or failed")
      }
    } catch (error) {
      console.error("Error during database initialization:", error)
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize database on server
  if (typeof window === "undefined") {
    await initializeDatabase()
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Fixed width sidebar that's always visible */}
            <div className="w-72 flex-shrink-0">
              <Sidebar />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'