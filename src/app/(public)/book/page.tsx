"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Bus, MapPin, Clock, Users, CreditCard, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/utils"
import { Navbar } from "@/components/public/Navbar"
import { RouteCard } from "@/components/public/RouteCard"
import toast from "react-hot-toast"

function BookingFlow() {
  const searchParams = useSearchParams()
  const direction = searchParams.get("direction") || "to-sgr"
  const [step, setStep] = useState(1)
  const [routes, setRoutes] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [seats, setSeats] = useState(1)
  const [doorToDoor, setDoorToDoor] = useState(false)
  const [passengerName, setPassengerName] = useState("")
  const [phone, setPhone] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropLocation, setDropLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState<string | null>(null)
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetch(`/api/routes?direction=${direction === "to-sgr" ? "TO_SGR" : "FROM_SGR"}`)
      .then(r => r.json())
      .then(data => setRoutes(data))
  }, [direction])

  useEffect(() => {
    if (selectedRoute) {
      fetch(`/api/schedules?routeId=${selectedRoute.id}&date=${travelDate}`)
        .then(r => r.json())
        .then(data => setSchedules(data))
    }
  }, [selectedRoute, travelDate])

  const calculateTotal = () => {
    if (!selectedRoute) return 0
    let total = selectedRoute.baseFare * seats
    if (doorToDoor && selectedRoute.doorToDoorEnabled) total += selectedRoute.doorToDoorFare * seats
    return total
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerName, phone, routeId: selectedRoute.id, scheduleId: selectedSchedule.id,
          direction: direction === "to-sgr" ? "TO_SGR" : "FROM_SGR", pickupLocation, dropLocation,
          seats, doorToDoor, travelDate: new Date(travelDate).toISOString(),
        }),
      })
      const data = await res.json()
      if (data.ref) { setBookingRef(data.ref); setStep(5); toast.success("Booking created! Check your phone for M-Pesa prompt.") }
      else toast.error(data.error || "Failed to create booking")
    } catch (e) { toast.error("An error occurred") }
    finally { setLoading(false) }
  }

  const steps = ["Route", "Schedule", "Seats", "Details", "Confirm"]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center ${i < 4 ? "flex-1" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? "bg-mpesa text-white" : step === i + 1 ? "bg-mpesa/10 text-mpesa border-2 border-mpesa" : "bg-gray-100 text-gray-400"}`}>
                  {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden sm:block ml-2 text-xs font-medium text-gray-600">{s}</span>
                {i < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? "bg-mpesa" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Select Your Route</h2>
              <p className="text-muted-foreground">Choose your pickup and destination</p>
            </div>
            <div className="grid gap-3">
              {routes.map(route => <RouteCard key={route.id} route={route} onSelect={r => { setSelectedRoute(r); setStep(2) }} selected={selectedRoute?.id === route.id} />)}
              {routes.length === 0 && <div className="text-center py-12 text-muted-foreground">Loading routes...</div>}
            </div>
          </div>
        )}

        {step === 2 && selectedRoute && (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setStep(1)} className="mb-2"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            <div><h2 className="text-2xl font-bold">Select Shuttle Time</h2><p className="text-muted-foreground">{selectedRoute.origin} → {selectedRoute.destination}</p></div>
            <div className="bg-white rounded-xl p-4 border">
              <Label>Travel Date</Label>
              <Input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="mt-1" />
            </div>
            <div className="grid gap-3">
              {schedules.map(schedule => (
                <button key={schedule.id} onClick={() => { setSelectedSchedule(schedule); setStep(3) }} className="w-full text-left p-4 bg-white rounded-xl border hover:border-mpesa transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center"><Clock className="h-5 w-5 text-ocean" /></div>
                      <div><p className="font-medium">{schedule.departureTime} - {schedule.arrivalTime}</p><p className="text-sm text-muted-foreground">{schedule.vehicleCapacity} seats · {schedule.availableSeats} available</p></div>
                    </div>
                    <Badge variant={schedule.availableSeats > 5 ? "success" : schedule.availableSeats > 0 ? "warning" : "destructive"}>{schedule.availableSeats} left</Badge>
                  </div>
                </button>
              ))}
              {schedules.length === 0 && <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border">No schedules available for this route on the selected date.</div>}
            </div>
          </div>
        )}

        {step === 3 && selectedSchedule && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            <div><h2 className="text-2xl font-bold">Select Seats</h2><p className="text-muted-foreground">{selectedRoute.origin} → {selectedRoute.destination} · {selectedSchedule.departureTime}</p></div>
            <div className="bg-white rounded-xl p-6 border">
              <Label className="mb-3 block text-base font-medium">Number of Seats</Label>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5,6].map(n => (
                  <button key={n} onClick={() => setSeats(n)} disabled={n > selectedSchedule.availableSeats} className={`w-12 h-12 rounded-lg font-medium transition-colors ${seats === n ? "bg-mpesa text-white" : n > selectedSchedule.availableSeats ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}>{n}</button>
                ))}
              </div>
            </div>
            {selectedRoute?.doorToDoorEnabled && (
              <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div><Label className="text-base font-medium">Door-to-Door Service</Label><p className="text-sm text-muted-foreground">+{formatCurrency(selectedRoute.doorToDoorFare)} per seat</p></div>
                  <Switch checked={doorToDoor} onCheckedChange={setDoorToDoor} />
                </div>
                {doorToDoor && (
                  <div className="space-y-3 mt-4">
                    <div><Label>Pickup Location</Label><Input placeholder="Enter street address or landmark" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} /></div>
                    <div><Label>Drop Location</Label><Input placeholder="Enter street address or landmark" value={dropLocation} onChange={e => setDropLocation(e.target.value)} /></div>
                  </div>
                )}
              </div>
            )}
            <Button onClick={() => setStep(4)} className="w-full" size="lg">Continue</Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            <div><h2 className="text-2xl font-bold">Passenger Details</h2><p className="text-muted-foreground">Enter your details to complete the booking</p></div>
            <div className="bg-white rounded-xl p-6 border space-y-4">
              <div><Label>Full Name</Label><Input placeholder="John Doe" value={passengerName} onChange={e => setPassengerName(e.target.value)} required /></div>
              <div><Label>M-Pesa Phone Number</Label><Input placeholder="07XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} required /></div>
            </div>
            <div className="bg-mpesa/5 rounded-xl p-6 border border-mpesa/20">
              <h3 className="font-semibold mb-3">Fare Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Base fare × {seats}</span><span>{formatCurrency(selectedRoute.baseFare * seats)}</span></div>
                {doorToDoor && <div className="flex justify-between"><span>Door-to-door × {seats}</span><span>{formatCurrency(selectedRoute.doorToDoorFare * seats)}</span></div>}
                <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-mpesa">{formatCurrency(calculateTotal())}</span></div>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={loading || !passengerName || !phone} className="w-full" size="lg">
              {loading ? "Processing..." : <><CreditCard className="h-5 w-5 mr-2" /> Pay with M-Pesa</>}
            </Button>
          </div>
        )}

        {step === 5 && bookingRef && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-mpesa/10 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="h-10 w-10 text-mpesa" /></div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-2">Your booking has been created successfully.</p>
            <p className="text-muted-foreground mb-6">Reference: <span className="font-mono font-bold text-foreground">{bookingRef}</span></p>
            <div className="space-y-3">
              <Link href={`/booking/${bookingRef}`}><Button className="w-full" size="lg">View Ticket</Button></Link>
              <Button variant="outline" className="w-full" onClick={() => { const text = `My Madaraka Transfers booking: ${bookingRef}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`); }}>Share on WhatsApp</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingFlow />
    </Suspense>
  );
}
