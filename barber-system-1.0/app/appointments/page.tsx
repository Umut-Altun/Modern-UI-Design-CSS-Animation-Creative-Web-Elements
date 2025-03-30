'use client';

import { Plus, Search } from "lucide-react"
import { tr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { getAppointments } from "@/lib/actions"
import NewAppointmentDialog from "@/components/new-appointment-dialog"
import AppointmentList from "@/components/appointment-list"
import { useState, useEffect } from "react"
import { formatDate } from "./date-utils"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments()
        setAppointments(data)
      } catch (err) {
        setError(err)
        console.error("Error fetching appointments:", err)
      }
    }

    fetchAppointments()
  }, [])

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Veritabanı Bağlantı Hatası</h2>
        <p>Veritabanına bağlanırken bir sorun oluştu. Lütfen şunları kontrol edin:</p>
        <ul className="list-disc text-left max-w-md mx-auto mt-4 space-y-2">
          <li>DATABASE_URL çevre değişkeninin doğru ayarlandığından emin olun</li>
          <li>Veritabanı sunucusunun çalıştığından emin olun</li>
          <li>Ağ bağlantınızı kontrol edin</li>
          <li>Uygulama günlüklerinde daha fazla bilgi olabilir</li>
        </ul>
      </div>
    )
  }

  return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Randevular</h1>
            <p className="text-muted-foreground mt-1">Müşterileriniz için randevuları yönetin ve planlayın</p>
          </div>
          <NewAppointmentDialog />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle>Takvim</CardTitle>
                <CardDescription>Randevuları görüntülemek için bir tarih seçin</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent mode="single" className="rounded-md border" locale={tr} />
              </CardContent>
            </Card>
          </div>
          <div className="md:w-2/3">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="flex flex-row items-center">
                <div>
                  <CardTitle>Randevular</CardTitle>
                  <CardDescription>{formatDate(new Date())}</CardDescription>
                </div>
                <div className="ml-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Randevularda ara..." className="pl-8 w-[200px] md:w-[300px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4 bg-gray-100">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Tümü
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirmed"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Onaylanan
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Bekleyen
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <AppointmentList appointments={appointments} />
                  </TabsContent>
                  <TabsContent value="confirmed">
                    <AppointmentList appointments={appointments.filter((a) => a.status === "onaylandı")} />
                  </TabsContent>
                  <TabsContent value="pending">
                    <AppointmentList appointments={appointments.filter((a) => a.status === "beklemede")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Dışa Aktar</Button>
                <NewAppointmentDialog>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Randevu
                  </Button>
                </NewAppointmentDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
}

