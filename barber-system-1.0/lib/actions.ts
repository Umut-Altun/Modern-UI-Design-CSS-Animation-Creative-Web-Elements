"use server"

import { query, checkDatabaseStatus } from "./db"
import { revalidatePath } from "next/cache"

// Customer types
export type Customer = {
  id: number
  name: string
  phone: string
  email: string
  visits: number
  last_visit: string | null
}

export type NewCustomer = Omit<Customer, "id" | "visits" | "last_visit">

// Service types
export type Service = {
  id: number
  name: string
  duration: number
  price: number
  description: string
}

export type NewService = Omit<Service, "id">

// Appointment types
export type Appointment = {
  id: number
  customer_id: number
  service_id: number
  date: string
  time: string
  duration: number
  status: string
  notes?: string
  customer_name?: string
  service_name?: string
}

export type NewAppointment = Omit<Appointment, "id" | "customer_name" | "service_name">

// Sale types
export type Sale = {
  id: number
  appointment_id: number | null
  customer_id: number
  total: number
  payment_method: string
  date: string
  items: SaleItem[]
  customer_name?: string
}

export type SaleItem = {
  id: number
  sale_id: number
  service_id: number
  price: number
  service_name?: string
}

export type NewSale = {
  customer_id: number
  total: number
  payment_method: string
  date: string
  items: { service_id: number; price: number }[]
}

// Check database connection before performing actions
async function ensureDatabaseConnection() {
  try {
    const status = await checkDatabaseStatus()
    if (!status.connected) {
      console.warn(`Database connection failed: ${status.message}. Using mock data.`)
      return false
    }
    return true
  } catch (error) {
    console.error("Error checking database connection:", error)
    return false
  }
}

// Mock data for when database is not available
const mockCustomers = [
  { id: 1, name: "Ahmet Yılmaz", phone: "555-1234", email: "ahmet@example.com", visits: 12, last_visit: "2025-03-15" },
  { id: 2, name: "Ayşe Demir", phone: "555-5678", email: "ayse@example.com", visits: 8, last_visit: "2025-03-20" },
  { id: 3, name: "Mehmet Kaya", phone: "555-9012", email: "mehmet@example.com", visits: 5, last_visit: "2025-03-10" },
  {
    id: 4,
    name: "Zeynep Yıldız",
    phone: "555-3456",
    email: "zeynep@example.com",
    visits: 15,
    last_visit: "2025-03-25",
  },
]

const mockServices = [
  { id: 1, name: "Saç Kesimi", duration: 30, price: 100, description: "Standart saç kesimi ve şekillendirme" },
  { id: 2, name: "Sakal Tıraşı", duration: 20, price: 50, description: "Sakal şekillendirme ve düzeltme" },
  { id: 3, name: "Saç & Sakal", duration: 45, price: 140, description: "Saç kesimi ve sakal düzenleme" },
  { id: 4, name: "Saç Boyama", duration: 90, price: 250, description: "Tam saç boyama hizmeti" },
  { id: 5, name: "Klasik Tıraş", duration: 30, price: 80, description: "Geleneksel ustura tıraşı" },
]

const mockAppointments = [
  {
    id: 1,
    customer_id: 1,
    service_id: 1,
    date: "2025-03-28",
    time: "10:00",
    duration: 30,
    status: "onaylandı",
    customer_name: "Ahmet Yılmaz",
    service_name: "Saç Kesimi",
  },
  {
    id: 2,
    customer_id: 2,
    service_id: 3,
    date: "2025-03-28",
    time: "11:30",
    duration: 45,
    status: "onaylandı",
    customer_name: "Ayşe Demir",
    service_name: "Saç & Sakal",
  },
  {
    id: 3,
    customer_id: 3,
    service_id: 2,
    date: "2025-03-29",
    time: "14:00",
    duration: 20,
    status: "onaylandı",
    customer_name: "Mehmet Kaya",
    service_name: "Sakal Tıraşı",
  },
  {
    id: 4,
    customer_id: 4,
    service_id: 4,
    date: "2025-03-30",
    time: "15:30",
    duration: 90,
    status: "beklemede",
    customer_name: "Zeynep Yıldız",
    service_name: "Saç Boyama",
  },
]

// Customer actions
export async function getCustomers() {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      console.log("Using mock customer data")
      return mockCustomers
    }

    const result = await query("SELECT * FROM customers ORDER BY name")
    return result.rows as Customer[]
  } catch (error) {
    console.error("Error fetching customers:", error)
    // Return mock data if database is not available
    return mockCustomers
  }
}

export async function getCustomerById(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      return mockCustomers.find((c) => c.id === id)
    }

    const result = await query("SELECT * FROM customers WHERE id = $1", [id])
    return result.rows[0] as Customer
  } catch (error) {
    console.error("Error fetching customer by ID:", error)
    return mockCustomers.find((c) => c.id === id)
  }
}

export async function createCustomer(customer: NewCustomer) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    // Validate customer data
    if (!customer.name || customer.name.trim() === "") {
      throw new Error("Customer name is required")
    }

    const { name, phone, email } = customer

    // Insert the new customer
    const result = await query(
      "INSERT INTO customers (name, phone, email, visits) VALUES ($1, $2, $3, 0) RETURNING *",
      [name, phone || "", email || ""],
    )

    console.log("Customer created successfully:", result.rows[0])

    // Revalidate the customers page to show the new customer
    revalidatePath("/customers")
    return result.rows[0] as Customer
  } catch (error) {
    console.error("Error creating customer:", error)
    throw error
  }
}

export async function updateCustomer(id: number, customer: Partial<Customer>) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    // Validate customer data
    if (customer.name !== undefined && customer.name.trim() === "") {
      throw new Error("Customer name cannot be empty")
    }

    const { name, phone, email } = customer

    // Update the customer
    const result = await query("UPDATE customers SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING *", [
      name,
      phone || "",
      email || "",
      id,
    ])

    if (result.rows.length === 0) {
      throw new Error(`Customer with ID ${id} not found`)
    }

    console.log("Customer updated successfully:", result.rows[0])

    // Revalidate the customers page to show the updated customer
    revalidatePath("/customers")
    return result.rows[0] as Customer
  } catch (error) {
    console.error("Error updating customer:", error)
    throw error
  }
}

export async function deleteCustomer(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    // First check if the customer exists
    const checkResult = await query("SELECT id FROM customers WHERE id = $1", [id])
    if (checkResult.rows.length === 0) {
      throw new Error(`Customer with ID ${id} not found`)
    }

    // Delete the customer
    await query("DELETE FROM customers WHERE id = $1", [id])
    console.log(`Customer with ID ${id} deleted successfully`)

    // Revalidate the customers page to reflect the deletion
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw error
  }
}

// Service actions
export async function getServices() {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      console.log("Using mock service data")
      return mockServices
    }

    const result = await query("SELECT * FROM services ORDER BY name")
    return result.rows as Service[]
  } catch (error) {
    console.error("Error fetching services:", error)
    return mockServices
  }
}

export async function getServiceById(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      return mockServices.find((s) => s.id === id)
    }

    const result = await query("SELECT * FROM services WHERE id = $1", [id])
    return result.rows[0] as Service
  } catch (error) {
    console.error("Error fetching service by ID:", error)
    return mockServices.find((s) => s.id === id)
  }
}

export async function createService(service: NewService) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    const { name, duration, price, description } = service
    const result = await query(
      "INSERT INTO services (name, duration, price, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, duration, price, description],
    )
    revalidatePath("/services")
    return result.rows[0] as Service
  } catch (error) {
    console.error("Error creating service:", error)
    throw error
  }
}

export async function updateService(id: number, service: Partial<Service>) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    const { name, duration, price, description } = service
    const result = await query(
      "UPDATE services SET name = $1, duration = $2, price = $3, description = $4 WHERE id = $5 RETURNING *",
      [name, duration, price, description, id],
    )
    revalidatePath("/services")
    return result.rows[0] as Service
  } catch (error) {
    console.error("Error updating service:", error)
    throw error
  }
}

export async function deleteService(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    await query("DELETE FROM services WHERE id = $1", [id])
    revalidatePath("/services")
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    throw error
  }
}

// Appointment actions
export async function getAppointments() {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      console.log("Using mock appointment data")
      return mockAppointments
    }

    const result = await query(`
    SELECT a.*, c.name as customer_name, s.name as service_name 
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN services s ON a.service_id = s.id
    ORDER BY a.date DESC, a.time DESC
  `)
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return mockAppointments
  }
}

export async function getAppointmentsByDate(date: string) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      return mockAppointments.filter((a) => a.date === date)
    }

    const result = await query(
      `
    SELECT a.*, c.name as customer_name, s.name as service_name 
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN services s ON a.service_id = s.id
    WHERE a.date = $1
    ORDER BY a.time
  `,
      [date],
    )
    return result.rows as Appointment[]
  } catch (error) {
    console.error("Error fetching appointments by date:", error)
    return mockAppointments.filter((a) => a.date === date)
  }
}

export async function getAppointmentById(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      return mockAppointments.find((a) => a.id === id)
    }

    const result = await query(
      `
    SELECT a.*, c.name as customer_name, s.name as service_name 
    FROM appointments a
    JOIN customers c ON a.customer_id = c.id
    JOIN services s ON a.service_id = s.id
    WHERE a.id = $1
  `,
      [id],
    )
    return result.rows[0] as Appointment
  } catch (error) {
    console.error("Error fetching appointment by ID:", error)
    return mockAppointments.find((a) => a.id === id)
  }
}

// Add the missing createAppointment function
export async function createAppointment(appointment: NewAppointment) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    const { customer_id, service_id, date, time, duration, status, notes } = appointment
    const result = await query(
      "INSERT INTO appointments (customer_id, service_id, date, time, duration, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [customer_id, service_id, date, time, duration, status, notes || ""],
    )

    // Update customer's last visit date
    await query("UPDATE customers SET last_visit = $1, visits = visits + 1 WHERE id = $2", [date, customer_id])

    revalidatePath("/appointments")
    revalidatePath("/")
    return result.rows[0] as Appointment
  } catch (error) {
    console.error("Error creating appointment:", error)
    throw error
  }
}

export async function updateAppointment(id: number, appointment: Partial<NewAppointment>) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    const { customer_id, service_id, date, time, duration, status, notes } = appointment
    const result = await query(
      "UPDATE appointments SET customer_id = $1, service_id = $2, date = $3, time = $4, duration = $5, status = $6, notes = $7 WHERE id = $8 RETURNING *",
      [customer_id, service_id, date, time, duration, status, notes, id],
    )
    revalidatePath("/appointments")
    revalidatePath("/")
    return result.rows[0] as Appointment
  } catch (error) {
    console.error("Error updating appointment:", error)
    throw error
  }
}

export async function deleteAppointment(id: number) {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      throw new Error("Database not available")
    }

    await query("DELETE FROM appointments WHERE id = $1", [id])
    revalidatePath("/appointments")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw error
  }
}

// Dashboard statistics
export async function getDashboardStats() {
  try {
    const dbAvailable = await ensureDatabaseConnection()
    if (!dbAvailable) {
      console.log("Using mock dashboard stats")
      return {
        todayAppointments: { count: 2, pending: 1, confirmed: 1 },
        totalAppointments: 4,
        totalCustomers: 4,
        newCustomers: 1,
        weeklyRevenue: 220,
      }
    }

    const today = new Date().toISOString().split("T")[0]

    // Get today's appointments
    const todayAppointments = await query(
      `
    SELECT COUNT(*) as count, 
           SUM(CASE WHEN status = 'beklemede' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN status = 'onaylandı' THEN 1 ELSE 0 END) as confirmed
    FROM appointments 
    WHERE date = $1
  `,
      [today],
    )

    // Get total appointments
    const totalAppointments = await query("SELECT COUNT(*) as count FROM appointments")

    // Get total customers
    const totalCustomers = await query("SELECT COUNT(*) as count FROM customers")

    // Get new customers this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newCustomers = await query("SELECT COUNT(*) as count FROM customers WHERE created_at >= $1", [
      oneWeekAgo.toISOString(),
    ])

    // Get weekly revenue
    const weeklyRevenue = await query(
      `
    SELECT COALESCE(SUM(total), 0) as total 
    FROM sales 
    WHERE date >= $1
  `,
      [oneWeekAgo.toISOString().split("T")[0]],
    )

    return {
      todayAppointments: {
        count: Number.parseInt(todayAppointments.rows[0]?.count || "0"),
        pending: Number.parseInt(todayAppointments.rows[0]?.pending || "0"),
        confirmed: Number.parseInt(todayAppointments.rows[0]?.confirmed || "0"),
      },
      totalAppointments: Number.parseInt(totalAppointments.rows[0]?.count || "0"),
      totalCustomers: Number.parseInt(totalCustomers.rows[0]?.count || "0"),
      newCustomers: Number.parseInt(newCustomers.rows[0]?.count || "0"),
      weeklyRevenue: Number.parseFloat(weeklyRevenue.rows[0]?.total || "0"),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock stats if database is not available
    return {
      todayAppointments: { count: 2, pending: 1, confirmed: 1 },
      totalAppointments: 4,
      totalCustomers: 4,
      newCustomers: 1,
      weeklyRevenue: 220,
    }
  }
}

