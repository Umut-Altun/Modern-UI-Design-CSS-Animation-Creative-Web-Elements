"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { createAppointment, getCustomers, getServices } from "@/lib/actions"
import { useEffect } from "react"

export default function NewAppointmentDialog({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([])
  const [services, setServices] = useState<{ id: number; name: string; duration: number; price: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [newAppointment, setNewAppointment] = useState({
    customer_id: 0,
    service_id: 0,
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: 30,
    status: "onaylandı",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await getCustomers()
        const servicesData = await getServices()
        setCustomers(customersData)
        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleAddAppointment = async () => {
    try {
      setIsLoading(true)
      await createAppointment(newAppointment)
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Randevu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Randevu Ekle</DialogTitle>
          <DialogDescription>Müşteri için yeni bir randevu oluşturun.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer">Müşteri</Label>
            <Select
              value={newAppointment.customer_id ? String(newAppointment.customer_id) : ""}
              onValueChange={(value) => setNewAppointment({ ...newAppointment, customer_id: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Müşteri seçin" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={String(customer.id)}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Hizmet</Label>
            <Select
              value={newAppointment.service_id ? String(newAppointment.service_id) : ""}
              onValueChange={(value) => {
                const serviceId = Number.parseInt(value)
                const service = services.find((s) => s.id === serviceId)
                setNewAppointment({
                  ...newAppointment,
                  service_id: serviceId,
                  duration: service ? service.duration : 30,
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hizmet seçin" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name} - {service.price} TL
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Saat</Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Durum</Label>
            <Select
              value={newAppointment.status}
              onValueChange={(value) => setNewAppointment({ ...newAppointment, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onaylandı">Onaylandı</SelectItem>
                <SelectItem value="beklemede">Beklemede</SelectItem>
                <SelectItem value="iptal">İptal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notlar</Label>
            <Input
              id="notes"
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              placeholder="Randevu ile ilgili notlar..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            İptal
          </Button>
          <Button
            onClick={handleAddAppointment}
            disabled={isLoading || !newAppointment.customer_id || !newAppointment.service_id}
          >
            {isLoading ? "Kaydediliyor..." : "Randevu Oluştur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

