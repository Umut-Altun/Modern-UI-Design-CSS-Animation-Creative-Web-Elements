import { checkDatabaseStatus } from "./db"

export async function checkDatabaseConnection() {
  return checkDatabaseStatus()
}

