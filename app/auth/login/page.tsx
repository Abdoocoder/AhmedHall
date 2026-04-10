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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-6 text-center pb-2">
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
            <CardTitle className="text-2xl font-semibold">AhmedHall</CardTitle>
            <CardDescription className="mt-2">نظام حجوزات قاعة البلدية</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/5 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Button type="submit" className="w-full rounded-full font-medium" disabled={loading}>
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>للحصول على حساب، يرجى التواصل مع مدير النظام</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
