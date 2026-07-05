"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bus } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { username, password, redirect: false })
    if (result?.error) { setError("Invalid credentials"); setLoading(false); }
    else { router.push("/admin/dashboard"); router.refresh(); }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Bus className="h-8 w-8 text-mpesa" />
        <span className="font-bold text-xl">Madaraka Transfers</span>
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} required /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4"><Link href="/" className="hover:text-mpesa">← Back to website</Link></p>
      </div>
    </div>
  );
}
