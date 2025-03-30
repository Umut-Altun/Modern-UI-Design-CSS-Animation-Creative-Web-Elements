"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, Clock, Edit, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Appointment, deleteAppointment } from "@/lib/actions"
import { useRouter } from "next/navigation"
import NewAppointmentDialog from "./new-appointment-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle deleting an appointment
  const handleDeleteAppointment = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      await deleteAppointment(deleteId)
      router.refresh()
    } catch (error) {
      console.error("Error deleting appointment:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="space-y-1">
                <div className="font-medium">{appointment.customer_name}</div>
                <div className="text-sm text-muted-foreground">
                  {appointment.service_name} ({appointment.duration} dk)
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {appointment.date ? format(new Date(appointment.date), "d MMM yyyy", { locale: tr }) : ""}
                  <Clock className="ml-3 mr-1 h-3 w-3" />
                  {appointment.time.slice(0, 5)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={appointment.status === "onaylandı" ? "default" : "outline"}
                  className={appointment.status === "onaylandı" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {appointment.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(appointment.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Randevu bulunamadı</p>
              <NewAppointmentDialog>
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="mr-2 h-4 w-4" />
                  Randevu Ekle
                </Button>
              </NewAppointmentDialog>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Randevuyu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

