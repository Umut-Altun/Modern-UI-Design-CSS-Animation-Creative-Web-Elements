import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db-status"

export async function GET() {
  try {
    const status = await checkDatabaseConnection()

    if (status.connected) {
      return NextResponse.json({ status: "ok", message: status.message })
    } else {
      return NextResponse.json({ status: "error", message: status.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in DB status API:", error)
    return NextResponse.json({ status: "error", message: "Failed to check database status" }, { status: 500 })
  }
}

