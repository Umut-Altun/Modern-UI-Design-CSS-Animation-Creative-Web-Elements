"use client"

import { useState, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/lib/actions"
import CustomerActions from "@/components/customer-actions"
import CustomerSearch from "@/components/customer-search"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomerTableProps {
  customers: Customer[]
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Effect to refresh data periodically
  useEffect(() => {
    // Set up a refresh interval
    const refreshInterval = setInterval(() => {
      router.refresh()
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(refreshInterval)
  }, [router])

  // Memoize the search handler to prevent it from changing on every render
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Filter customers based on the search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div>
      <div className="flex justify-end mb-4">
        <CustomerSearch onSearchChange={handleSearchChange} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Yükleniyor...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Toplam Ziyaret</TableHead>
              <TableHead>Son Ziyaret</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell>{customer.last_visit ? new Date(customer.last_visit).toLocaleDateString('tr-TR') : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <CustomerActions customer={customer} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchQuery ? "Arama kriterlerine uygun müşteri bulunamadı." : "Müşteri bulunamadı."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

