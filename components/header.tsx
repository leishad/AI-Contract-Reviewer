import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-semibold text-foreground text-lg">ContractAI</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground hidden sm:inline">AI-Powered Contract Review</span>
        </nav>
      </div>
    </header>
  )
}
