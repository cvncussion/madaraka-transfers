import Link from "next/link";
import { Bus, MapPin, CreditCard, Shield, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/public/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-to-br from-ocean to-ocean-dark text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your SGR Connection Shuttle<br />in Mombasa
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Reliable shared transport connecting 19 coastal towns to Miritini SGR Station. Book, pay via M-Pesa, and ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book?direction=to-sgr">
              <Button size="lg" className="bg-mpesa hover:bg-mpesa-dark h-14 px-8 text-white">Going to SGR</Button>
            </Link>
            <Link href="/book?direction=from-sgr">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ocean h-14 px-8">Arriving from Nairobi</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Select Route", desc: "Choose your town and shuttle time" },
              { icon: CreditCard, title: "Pay with M-Pesa", desc: "Secure STK Push payment" },
              { icon: Bus, title: "Ride", desc: "Show your ticket to the driver" },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-mpesa/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-mpesa" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "M-Pesa Secured", desc: "Safe mobile money payments" },
              { icon: Phone, title: "SMS Confirmation", desc: "Instant booking confirmation" },
              { icon: MessageCircle, title: "WhatsApp Support", desc: "Quick customer service" },
              { icon: MapPin, title: "Door-to-Door", desc: "Optional pickup & drop-off" },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <feat.icon className="h-5 w-5 text-mpesa mt-0.5" />
                <div>
                  <h4 className="font-medium">{feat.title}</h4>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-sand-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Routes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { from: "Mombasa CBD", to: "Miritini SGR", price: 200 },
              { from: "Nyali", to: "Miritini SGR", price: 250 },
              { from: "Diani", to: "Miritini SGR", price: 600 },
              { from: "Mtwapa", to: "Miritini SGR", price: 400 },
              { from: "Kilifi", to: "Miritini SGR", price: 500 },
              { from: "Malindi", to: "Miritini SGR", price: 800 },
            ].map((route, i) => (
              <Link href={`/book?direction=to-sgr`} key={i}>
                <div className="bg-white rounded-xl p-4 border hover:border-mpesa transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{route.from} → {route.to}</p>
                      <p className="text-sm text-muted-foreground">From</p>
                    </div>
                    <p className="text-xl font-bold text-mpesa">KES {route.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bus className="h-6 w-6 text-mpesa" />
                <span className="font-bold">Madaraka Transfers</span>
              </div>
              <p className="text-gray-400 text-sm">Your trusted SGR shuttle service in Mombasa</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">{process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+254712345678"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/schedule" className="block hover:text-mpesa">Schedule</Link>
                <Link href="/track" className="block hover:text-mpesa">Track Booking</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
