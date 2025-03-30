"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { BarChart, Calendar, Download, LineChart, PieChart, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View analytics and reports for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+48</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Service Value</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32.50</div>
                <p className="text-xs text-muted-foreground">+7% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>
                  Daily revenue for the past {timeRange === "week" ? "7" : timeRange === "month" ? "30" : "365"} days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Appointments by Service</CardTitle>
                <CardDescription>Distribution of appointments by service type</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ServiceDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of sales performance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Customer retention and acquisition metrics</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CustomerChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Popularity and revenue by service</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ServicePerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock chart components
function RevenueChart() {
  // Generate mock data for the past 7 days
  const data = Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    amount: Math.floor(Math.random() * 300) + 100,
  }))

  return (
    <div className="h-[300px] w-full">
      <div className="flex items-center justify-center h-full">
        <LineChart className="h-16 w-16 text-muted-foreground" />
        <div className="ml-4">
          <p className="text-sm font-medium">Revenue Chart</p>
          <p className="text-xs text-muted-foreground">This is a placeholder for a revenue line chart</p>
        </div>
      </div>
    </div>
  )
}

function ServiceDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <div className="flex items-center justify-center h-full">
        <PieChart className="h-16 w-16 text-muted-foreground" />
        <div className="ml-4">
          <p className="text-sm font-medium">Service Distribution</p>
          <p className="text-xs text-muted-foreground">This is a placeholder for a service distribution pie chart</p>
        </div>
      </div>
    </div>
  )
}

function SalesChart() {
  return (
    <div className="h-[400px] w-full">
      <div className="flex items-center justify-center h-full">
        <BarChart className="h-16 w-16 text-muted-foreground" />
        <div className="ml-4">
          <p className="text-sm font-medium">Sales Analysis</p>
          <p className="text-xs text-muted-foreground">This is a placeholder for a sales bar chart</p>
        </div>
      </div>
    </div>
  )
}

function CustomerChart() {
  return (
    <div className="h-[400px] w-full">
      <div className="flex items-center justify-center h-full">
        <LineChart className="h-16 w-16 text-muted-foreground" />
        <div className="ml-4">
          <p className="text-sm font-medium">Customer Insights</p>
          <p className="text-xs text-muted-foreground">This is a placeholder for a customer insights chart</p>
        </div>
      </div>
    </div>
  )
}

function ServicePerformanceChart() {
  return (
    <div className="h-[400px] w-full">
      <div className="flex items-center justify-center h-full">
        <BarChart className="h-16 w-16 text-muted-foreground" />
        <div className="ml-4">
          <p className="text-sm font-medium">Service Performance</p>
          <p className="text-xs text-muted-foreground">This is a placeholder for a service performance chart</p>
        </div>
      </div>
    </div>
  )
}

