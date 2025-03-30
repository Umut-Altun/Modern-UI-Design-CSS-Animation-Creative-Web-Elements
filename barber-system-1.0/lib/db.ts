// Define types for our database connection
type QueryResult = {
  rows: any[]
  rowCount: number
}

type Pool = {
  query: (text: string, params?: any[]) => Promise<QueryResult>
  on: (event: string, callback: (err: Error) => void) => void
}

// Create a pool variable that will be initialized
let pool: Pool | null = null

// Helper function to initialize the database connection
async function initPool() {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    console.warn("Running in browser environment - using mock database")
    // Create a mock pool for browser environments
    pool = createMockPool()
    return true
  }

  try {
    // Dynamic import for pg - this will only work on the server
    const pg = await import("pg").catch((err) => {
      console.error("Failed to import pg module:", err)
      return null
    })

    if (!pg) {
      console.error("pg module not available, using mock database")
      pool = createMockPool()
      return true
    }

    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable not set")
      return false
    }

    // Create a connection pool using the provided connection string
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
    })

    // Test the connection
    pool.on("error", (err: Error) => {
      console.error("Unexpected error on idle client", err)
    })

    // Verify connection
    try {
      const res = await pool.query("SELECT NOW()")
      console.log("Database connected successfully")
      return true
    } catch (err) {
      console.error("Database connection error:", err)
      return false
    }
  } catch (error) {
    console.error("Error initializing database pool:", error)
    // Fall back to mock database
    pool = createMockPool()
    return true
  }
}

// Add this function after the initPool function:
export async function ensureDatabaseConnection() {
  try {
    if (!pool) {
      const initialized = await initPool()
      return initialized
    }
    return true
  } catch (error) {
    console.error("Error ensuring database connection:", error)
    return false
  }
}

// Create a mock pool for browser environments
function createMockPool(): Pool {
  console.log("Creating mock database pool")
  return {
    query: async (text: string, params?: any[]): Promise<QueryResult> => {
      console.log("Mock query:", text, params)
      // Return empty result
      return { rows: [], rowCount: 0 }
    },
    on: (event: string, callback: (err: Error) => void): void => {
      // Do nothing
    },
  }
}

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  if (!pool) {
    const initialized = await initPool()
    if (!initialized) {
      console.error("Database pool not initialized")
      return { rows: [], rowCount: 0 }
    }
  }

  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  console.log("Starting database initialization...")

  // Initialize pool if not already done
  if (!pool) {
    const initialized = await initPool()
    if (!initialized) {
      console.error("Failed to initialize database pool")
      return false
    }
  }

  try {
    // First, check if we can connect to the database
    const testResult = await query("SELECT 1 as test")
    console.log("Database connection test successful")

    // Create customers table
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        visits INTEGER DEFAULT 0,
        last_visit DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Customers table created or already exists")

    // Create services table
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Services table created or already exists")

    // Create appointments table
    await query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time TIME NOT NULL,
        duration INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'beklemede',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Appointments table created or already exists")

    // Create sales table
    await query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Sales table created or already exists")

    // Create sale_items table
    await query(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Sale_items table created or already exists")

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database", error)
    return false
  }
}

// Seed initial data if tables are empty
export async function seedInitialData() {
  try {
    // Check if customers table is empty
    const customersResult = await query("SELECT COUNT(*) FROM customers")
    if (customersResult.rows.length === 0 || Number.parseInt(customersResult.rows[0]?.count || "0") === 0) {
      // Insert sample customers
      await query(`
        INSERT INTO customers (name, phone, email, visits, last_visit) VALUES
        ('Ahmet Yılmaz', '555-1234', 'ahmet@example.com', 12, '2025-03-15'),
        ('Ayşe Demir', '555-5678', 'ayse@example.com', 8, '2025-03-20'),
        ('Mehmet Kaya', '555-9012', 'mehmet@example.com', 5, '2025-03-10'),
        ('Zeynep Yıldız', '555-3456', 'zeynep@example.com', 15, '2025-03-25')
      `)
      console.log("Sample customers added")
    }

    // Check if services table is empty
    const servicesResult = await query("SELECT COUNT(*) FROM services")
    if (servicesResult.rows.length === 0 || Number.parseInt(servicesResult.rows[0]?.count || "0") === 0) {
      // Insert sample services
      await query(`
        INSERT INTO services (name, duration, price, description) VALUES
        ('Saç Kesimi', 30, 100, 'Standart saç kesimi ve şekillendirme'),
        ('Sakal Tıraşı', 20, 50, 'Sakal şekillendirme ve düzeltme'),
        ('Saç & Sakal', 45, 140, 'Saç kesimi ve sakal düzenleme'),
        ('Saç Boyama', 90, 250, 'Tam saç boyama hizmeti'),
        ('Klasik Tıraş', 30, 80, 'Geleneksel ustura tıraşı')
      `)
      console.log("Sample services added")
    }

    // Check if appointments table is empty
    const appointmentsResult = await query("SELECT COUNT(*) FROM appointments")
    if (appointmentsResult.rows.length === 0 || Number.parseInt(appointmentsResult.rows[0]?.count || "0") === 0) {
      // Get customer and service IDs
      const customers = await query("SELECT id FROM customers")
      const services = await query("SELECT id FROM services")

      if (customers.rows.length > 0 && services.rows.length > 0) {
        // Insert sample appointments
        await query(
          `
          INSERT INTO appointments (customer_id, service_id, date, time, duration, status) VALUES
          ($1, $2, '2025-03-28', '10:00', 30, 'onaylandı'),
          ($3, $4, '2025-03-28', '11:30', 45, 'onaylandı'),
          ($5, $6, '2025-03-29', '14:00', 20, 'onaylandı'),
          ($7, $8, '2025-03-30', '15:30', 90, 'beklemede')
        `,
          [
            customers.rows[0]?.id || 1,
            services.rows[0]?.id || 1,
            customers.rows[1]?.id || 2,
            services.rows[2]?.id || 3,
            customers.rows[2]?.id || 3,
            services.rows[1]?.id || 2,
            customers.rows[3]?.id || 4,
            services.rows[3]?.id || 4,
          ],
        )
        console.log("Sample appointments added")
      }
    }

    console.log("Initial data seeded successfully")
    return true
  } catch (error) {
    console.error("Error seeding initial data", error)
    return false
  }
}

// Export a function to check database status
export async function checkDatabaseStatus() {
  if (!pool) {
    const initialized = await initPool()
    if (!initialized) {
      return {
        connected: false,
        message: "Failed to initialize database pool",
      }
    }
  }

  try {
    const result = await query("SELECT 1 as connected")
    return {
      connected: true,
      message: "Database connection successful",
    }
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

