"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)
  const router = useRouter()
  const { signIn, fetchStatus } = useSignIn()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn) return

    setLoading(true)
    setError("")

    try {
      const { error: signInError } = await signIn.password({
        emailAddress: email,
        password,
      })
      if (signInError) {
        setError(`${signInError.message} (${signInError.code})`)
        setLoading(false)
        return
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) return
            const url = decorateUrl("/dashboard")
            if (url.startsWith("http")) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else if (
        signIn.status === "needs_second_factor" &&
        signIn.supportedSecondFactors?.some((f) => f.strategy === "email_code")
      ) {
        await signIn.mfa.sendEmailCode()
        setVerifying(true)
      } else {
        setError(`تعذر إكمال تسجيل الدخول (${signIn.status})`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ في تسجيل الدخول"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn) return

    setLoading(true)
    setError("")

    try {
      await signIn.mfa.verifyEmailCode({ code })

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) return
            const url = decorateUrl("/dashboard")
            if (url.startsWith("http")) {
              window.location.href = url
            } else {
              router.push(url)
            }
          },
        })
      } else {
        setError(`تعذر إكمال التحقق (${signIn.status})`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ في التحقق"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader className="space-y-6 text-center pb-2">
            <div className="mx-auto relative w-24 h-24">
              <Image
                src="/logo.png"
                alt="شعار البلدية"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold">تحقق من البريد الإلكتروني</CardTitle>
              <CardDescription className="mt-2">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/5 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">رمز التحقق</label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  dir="ltr"
                  className="rounded-lg text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button type="submit" className="w-full rounded-full font-medium" disabled={loading || fetchStatus === "fetching"}>
                {loading ? "جاري التحقق..." : "تأكيد"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
      <div className="min-h-dvh flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-6 text-center pb-2">
          <div className="mx-auto relative w-24 h-24">
            <Image
              src="/logo.png"
              alt="شعار البلدية"
              fill
              className="object-contain"
              sizes="96px"
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
              <label htmlFor="login-email" className="text-sm font-medium">البريد الإلكتروني</label>
              <Input
                id="login-email"
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
              <label htmlFor="login-password" className="text-sm font-medium">كلمة المرور</label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Button type="submit" className="w-full rounded-full font-medium" disabled={loading || fetchStatus === "fetching"}>
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
