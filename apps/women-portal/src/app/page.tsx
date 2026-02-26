import { Button, Heading, Body, TextInput } from '@glimmora/ui'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
      <div className="max-w-lg w-full space-y-6">
        <Heading level="h1">Women&apos;s Portal</Heading>
        <Body>
          Welcome to GlimmoraTeam. Your skills, your schedule, your future.
          Contribute to real projects with full privacy protection.
        </Body>

        <div className="flex gap-3">
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
          <Button variant="ghost">Sign In</Button>
        </div>

        <div className="p-6 bg-bg-card rounded-card shadow-card space-y-4">
          <Heading level="h3">Quick Access</Heading>
          <TextInput label="Search..." placeholder="Type to search..." />
          <div className="flex gap-2">
            <Button variant="primary" size="sm">Search</Button>
            <Button variant="destructive" size="sm">Clear</Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-badge bg-brand-primary" title="primary" />
          <div className="w-10 h-10 rounded-badge bg-brand-sand" title="sand" />
          <div className="w-10 h-10 rounded-badge bg-brand-forest" title="forest" />
          <div className="w-10 h-10 rounded-badge bg-brand-teal" title="teal" />
          <div className="w-10 h-10 rounded-badge bg-brand-gold" title="gold" />
        </div>
      </div>
    </main>
  )
}
