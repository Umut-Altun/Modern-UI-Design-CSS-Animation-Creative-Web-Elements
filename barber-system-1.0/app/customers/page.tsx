import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCustomers } from "@/lib/actions"
import NewCustomerDialog from "@/components/new-customer-dialog"
import CustomerTable from "@/components/customer-table"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton for the customers table
function CustomersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[300px]" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

// Customer table component that fetches data
async function CustomersTableContainer() {
  // Get all customers with cache busting
  const timestamp = Date.now()
  const customers = await getCustomers()

  // Add a key with timestamp to force re-render when data changes
  return <CustomerTable key={`customers-${timestamp}`} customers={customers} />
}

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Müşteriler</h1>
          <p className="text-muted-foreground mt-1">Müşteri veritabanınızı yönetin</p>
        </div>
        <NewCustomerDialog />
      </div>

      <Card className="bg-white shadow-sm border-0">
        <CardHeader>
          <CardTitle>Müşteri Veritabanı</CardTitle>
          <CardDescription>Tüm müşterilerinizi görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CustomersTableSkeleton />}>
            <CustomersTableContainer />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Müşterileri Dışa Aktar</Button>
          <NewCustomerDialog>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Müşteri
            </Button>
          </NewCustomerDialog>
        </CardFooter>
      </Card>
    </div>
  )
}

