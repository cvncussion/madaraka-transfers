"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/admin/PageHeader"
import { Settings, Save } from "lucide-react"
import toast from "react-hot-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(data => { setSettings(data); const v: Record<string, string> = {}; data.forEach((s: any) => { v[s.key] = s.value }); setValues(v) }) }, [])

  const updateValue = (key: string, value: string) => { setValues(prev => ({ ...prev, [key]: value })) }

  const saveSettings = async () => {
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values }) })
    if (res.ok) toast.success("Settings saved"); else toast.error("Failed to save")
  }

  const renderInput = (s: any) => {
    const val = values[s.key] || ""
    if (s.type === "boolean") return <Switch checked={val === "true" || val === true} onCheckedChange={v => updateValue(s.key, String(v))} />
    return <Input type={s.type === "number" ? "number" : "text"} value={val} onChange={e => updateValue(s.key, e.target.value)} />
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Settings" description="Manage business settings" icon={Settings} />
        <Button onClick={saveSettings}><Save className="h-4 w-4 mr-2" /> Save All</Button>
      </div>
      <div className="max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Business Settings</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {settings.map(s => (
              <div key={s.id}>
                <Label className="mb-2 block">{s.label}</Label>
                {renderInput(s)}
                {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
              </div>
            ))}
            {settings.length === 0 && <p className="text-center text-muted-foreground py-4">Loading settings...</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
