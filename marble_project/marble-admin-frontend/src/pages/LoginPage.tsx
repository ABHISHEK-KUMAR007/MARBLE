import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'admin@aureostone.com',
      password: 'Admin@123',
    },
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setAuthError('')
    try {
      await login({ ...values, rememberMe })
      toast.success('Login successful')
      navigate(from, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to login. Please try again.'
      setAuthError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <div className="relative min-h-screen overflow-hidden bg-background text-primary-foreground">
    {/* Background */}
    <div className="absolute inset-0 marble-vignette opacity-40" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,211,96,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_20%)]" />

    {/* Main Container */}
    <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        {/* Brand Header */}
        <div className="mx-auto mb-10 w-full max-w-2xl rounded-[2.5rem] border border-border bg-card/95 p-10 text-center shadow-soft backdrop-blur-sm">

          <p className="text-sm font-semibold uppercase tracking-[0.45em] text-accent">
            Makrana Marble Art Admin
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-primary">
            Welcome Back
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Sign in to manage products, categories, projects,
            inquiries and website content.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-2xl border border-accent/20 bg-accent/10 px-8 py-4">
              <span className="text-lg font-semibold uppercase tracking-[0.35em] text-accent">
                Makrana Marble Art
              </span>
            </div>
          </div>

        </div>

        {/* Login Card */}
        <Card className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-border bg-card/95 p-8 shadow-luxe backdrop-blur-sm">

          <CardHeader className="space-y-4 pb-8 text-center">

            <CardTitle className="text-4xl font-bold">
              Secure Administrator Login
            </CardTitle>

            <CardDescription className="text-lg leading-7">
              Sign in with your administrator credentials to continue.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-7"
            >

              {/* Email */}
              <div className="grid gap-3">

                <label className="text-base font-semibold text-muted-foreground">
                  Email Address
                </label>

                <Input
                  type="email"
                  placeholder="admin@aureostone.com"
                  className="h-14 text-lg"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* Password */}
              <div className="grid gap-3">

                <label className="text-base font-semibold text-muted-foreground">
                  Password
                </label>

                <div className="relative">

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-14 pr-12 text-lg"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-primary"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* Authentication Error */}
              {authError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {authError}
                </div>
              )}

              {/* Remember Me */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">

                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(Boolean(checked))
                    }
                  />

                  Remember me

                </label>

                <a
                  href="#"
                  className="text-sm font-semibold text-accent transition hover:text-accent/80"
                >
                  Forgot password?
                </a>

              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="mt-2 h-14 w-full rounded-xl text-lg font-semibold tracking-wide"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Use your administrator email and password to access
                the management dashboard.
              </p>

            </form>

          </CardContent>

        </Card>

      </div>
    </div>
  </div>
)
}