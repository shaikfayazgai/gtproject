'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, TextInput, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@glimmora/ui'
import type { AlumniProfile } from '@glimmora/types'

const graduationYearOptions = [
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
]

export function AlumniReactivationForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [currentEmployment, setCurrentEmployment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [reactivationResult, setReactivationResult] = useState<AlumniProfile | null>(null)

  async function handleReactivate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/alumni/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, graduationYear: Number(graduationYear), currentEmployment }),
      })
      const data = await res.json()
      setReactivationResult(data.data)
    } finally {
      setIsLoading(false)
    }
  }

  if (reactivationResult) {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-success/10">
          <svg className="h-10 w-10 text-status-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 className="font-display text-2xl font-semibold text-text-heading">Welcome Back!</h2>
        <p className="text-sm font-body text-text-body">
          Your account has been reactivated. Your {reactivationResult.previousPoDLCount} PoDL credentials
          from your student career have been preserved and are ready for you.
        </p>
        <div className="bg-bg-card rounded-card shadow-card p-4 w-full">
          <p className="text-xs font-body text-text-caption uppercase tracking-wider">Preserved Credentials</p>
          <p className="text-3xl font-display font-semibold text-brand-primary mt-1">{reactivationResult.previousPoDLCount}</p>
          <p className="text-xs font-body text-text-caption mt-1">PoDL credentials carried forward</p>
        </div>
        <Button variant="primary" className="w-full" onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleReactivate} className="flex flex-col gap-5 max-w-md mx-auto">
      <div className="text-center mb-2">
        <h1 className="font-display text-2xl font-semibold text-text-heading">Reactivate Your Account</h1>
        <p className="text-sm font-body text-text-caption mt-1">
          Welcome back! Enter your details to reactivate. Your PoDL credential history will be preserved.
        </p>
      </div>

      <TextInput
        label="University Email"
        type="email"
        placeholder="your.name@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-heading font-body">Graduation Year</label>
        <Select value={graduationYear} onValueChange={setGraduationYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {graduationYearOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TextInput
        label="Current Employment (optional)"
        placeholder="Tell us about your current role..."
        value={currentEmployment}
        onChange={(e) => setCurrentEmployment(e.target.value)}
      />

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Reactivating...' : 'Reactivate Account'}
      </Button>
    </form>
  )
}
