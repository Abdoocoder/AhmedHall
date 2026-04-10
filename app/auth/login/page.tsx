"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <Card className="w-full max-w-md border-primary/20 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto relative w-24 h-24">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight"> AhmedHall</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">نظام حجوزات قاعة البلدية - GPU Computing</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md font-mono">
                ERROR: {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@ahmedhall.jo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="font-mono border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono border-primary/30 focus:border-primary"
              />
            </div>

            <Button type="submit" className="w-full font-semibold tracking-wide bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "INITIALIZING..." : "AUTHENTICATE"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p className="font-mono">NVIDIA® AhmedHall Reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
