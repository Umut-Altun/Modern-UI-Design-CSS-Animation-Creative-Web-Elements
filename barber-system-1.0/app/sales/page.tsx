"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Calculator, CreditCard, DollarSign, Plus, Receipt, Search, ShoppingCart, Scissors } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockServices = [
  { id: 1, name: "Haircut", duration: 30, price: 25 },
  { id: 2, name: "Beard Trim", duration: 20, price: 15 },
  { id: 3, name: "Haircut & Beard Trim", duration: 45, price: 35 },
  { id: 4, name: "Hair Coloring", duration: 90, price: 60 },
  { id: 5, name: "Shave", duration: 30, price: 20 },
]

const mockCustomers = [
  { id: 1, name: "John Doe", phone: "555-1234" },
  { id: 2, name: "Jane Smith", phone: "555-5678" },
  { id: 3, name: "Mike Johnson", phone: "555-9012" },
  { id: 4, name: "Sarah Williams", phone: "555-3456" },
]

const mockSales = [
  {
    id: 1,
    customer: "John Doe",
    date: "2025-03-28",
    items: [
      { service: "Haircut", price: 25 },
      { service: "Beard Trim", price: 15 },
    ],
    total: 40,
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    customer: "Jane Smith",
    date: "2025-03-27",
    items: [{ service: "Hair Coloring", price: 60 }],
    total: 60,
    paymentMethod: "Cash",
  },
  {
    id: 3,
    customer: "Mike Johnson",
    date: "2025-03-26",
    items: [{ service: "Haircut & Beard Trim", price: 35 }],
    total: 35,
    paymentMethod: "Credit Card",
  },
  {
    id: 4,
    customer: "Sarah Williams",
    date: "2025-03-25",
    items: [
      { service: "Haircut", price: 25 },
      { service: "Hair Coloring", price: 60 },
    ],
    total: 85,
    paymentMethod: "Cash",
  },
]

export default function SalesPage() {
  const [sales, setSales] = useState(mockSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<{ service: string; price: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Credit Card")

  // Filter sales based on search query
  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some((item) => item.service.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price, 0)

  // Add service to cart
  const addToCart = (service: { name: string; price: number }) => {
    setCart([...cart, { service: service.name, price: service.price }])
  }

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  // Process payment
  const processPayment = () => {
    if (cart.length === 0 || !selectedCustomer) return

    const newSale = {
      id: Math.max(...sales.map((s) => s.id), 0) + 1,
      customer: selectedCustomer,
      date: format(new Date(), "yyyy-MM-dd"),
      items: [...cart],
      total: cartTotal,
      paymentMethod,
    }

    setSales([newSale, ...sales])
    setCart([])
    setSelectedCustomer("")
    setPaymentMethod("Credit Card")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Process payments and view sales history</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Sale</CardTitle>
            <CardDescription>Add services to cart and process payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Services</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mockServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => addToCart(service)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {service.name} - ${service.price}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Cart</h3>
              {cart.length > 0 ? (
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                      <span>{item.service}</span>
                      <div className="flex items-center gap-2">
                        <span>${item.price.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(index)}>
                          &times;
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No items in cart</p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex justify-between w-full text-lg font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              disabled={cart.length === 0 || !selectedCustomer}
              onClick={processPayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>View recent sales and transactions</CardDescription>
            </div>
            <div className="ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sales..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Sales</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <div key={sale.id} className="flex flex-col rounded-lg border p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{sale.customer}</div>
                        <div className="text-sm text-muted-foreground">{sale.date}</div>
                      </div>
                      <div className="space-y-1 mb-2">
                        {sale.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.service}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center text-sm">
                          <CreditCard className="mr-1 h-3 w-3" />
                          {sale.paymentMethod}
                        </div>
                        <div className="font-bold">Total: ${sale.total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No sales found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="today" className="space-y-4">
                {filteredSales.filter((sale) => sale.date === format(new Date(), "yyyy-MM-dd")).length > 0 ? (
                  filteredSales
                    .filter((sale) => sale.date === format(new Date(), "yyyy-MM-dd"))
                    .map((sale) => (
                      <div key={sale.id} className="flex flex-col rounded-lg border p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{sale.customer}</div>
                          <div className="text-sm text-muted-foreground">{sale.date}</div>
                        </div>
                        <div className="space-y-1 mb-2">
                          {sale.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.service}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center text-sm">
                            <CreditCard className="mr-1 h-3 w-3" />
                            {sale.paymentMethod}
                          </div>
                          <div className="font-bold">Total: ${sale.total.toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No sales today</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                {/* Week filter would go here - simplified for this example */}
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">Weekly sales view</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Receipt className="mr-2 h-4 w-4" />
              Export Sales Report
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${sales.reduce((total, sale) => total + sale.total, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(sales.reduce((total, sale) => total + sale.total, 0) / sales.length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Service</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Haircut</div>
            <p className="text-xs text-muted-foreground">35% of total revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper component for the Label
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

