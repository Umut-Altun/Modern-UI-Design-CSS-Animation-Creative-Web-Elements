import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar, Clock, Plus, User, DollarSign, Scissors } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAppointmentsByDate, getDashboardStats, getServices } from "@/lib/actions"
import NewAppointmentDialog from "@/components/new-appointment-dialog"

export default async function Dashboard() {
  // Add error handling for data fetching
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Get dashboard statistics
    const stats = await getDashboardStats()

    // Get today's appointments
    const todayAppointments = await getAppointmentsByDate(today)

    // Get popular services
    const services = await getServices()
    const popularServices = services.slice(0, 3) // Just get top 3 for now

    // Generate week days starting from today
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gösterge Paneli</h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), "MMMM yyyy", { locale: tr })} için randevularınızı yönetin
            </p>
          </div>
          <NewAppointmentDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bugünkü Randevular</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments.count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.todayAppointments.pending} beklemede,
                {stats.todayAppointments.confirmed} onaylandı
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Randevular</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">Dünden +2 artış</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Müşteriler</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">Bu hafta +{stats.newCustomers} yeni müşteri</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gelir (Bu Hafta)</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyRevenue.toFixed(2)} TL</div>
              <p className="text-xs text-muted-foreground mt-1">Geçen haftadan %20 artış</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Takvim Görünümü
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Liste Görünümü
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day) => (
                <Button
                  key={day.toString()}
                  variant={isSameDay(day, new Date()) ? "default" : "outline"}
                  className={`h-auto flex flex-col p-3 ${isSameDay(day, new Date()) ? "bg-primary text-white" : "bg-white"}`}
                >
                  <div className="text-xs font-medium">{format(day, "EEE", { locale: tr })}</div>
                  <div className="text-lg">{format(day, "d")}</div>
                </Button>
              ))}
            </div>

            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">{format(new Date(), "EEEE, d MMMM yyyy", { locale: tr })}</CardTitle>
                <p className="text-sm text-muted-foreground">{todayAppointments.length} randevu planlandı</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{appointment.customer_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.service_name} ({appointment.duration} dk)
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">{appointment.time.slice(0, 5)}</div>
                          <Badge
                            variant={appointment.status === "onaylandı" ? "default" : "outline"}
                            className={appointment.status === "onaylandı" ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-gray-50">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Bu gün için randevu bulunmuyor</p>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="list">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl">Tüm Yaklaşan Randevular</CardTitle>
                <p className="text-sm text-muted-foreground">Tüm planlanmış randevuları görüntüleyin ve yönetin</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{appointment.customer_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.service_name} ({appointment.duration} dk)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-right">
                          <div>{appointment.date && typeof appointment.date === 'string' ? format(parseISO(appointment.date), "d MMM yyyy", { locale: tr }) : "Tarih Yok"}</div>
                          <div>{appointment.time?.slice(0, 5) || "Saat Yok"}</div>
                        </div>
                        <Badge
                          variant={appointment.status === "onaylandı" ? "default" : "outline"}
                          className={appointment.status === "onaylandı" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-xl">Popüler Hizmetler</CardTitle>
            <p className="text-sm text-muted-foreground">En çok tercih edilen hizmetleriniz</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {popularServices.map((service) => (
                <div key={service.id} className="flex items-center gap-3 rounded-lg border p-4 bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.price} TL</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error rendering dashboard:", error)
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gösterge Paneli</h1>
            <p className="text-muted-foreground mt-1">
              Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
          <NewAppointmentDialog />
        </div>

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
      </div>
    )
  }
}

