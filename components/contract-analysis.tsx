'use client'

import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  FileText,
  Calendar,
  Users,
  ChevronDown,
  Lightbulb
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface Clause {
  title: string
  originalText: string
  explanation: string
  riskLevel: 'low' | 'medium' | 'high'
  implications: string
}

interface RiskFlag {
  severity: 'warning' | 'caution' | 'critical'
  title: string
  description: string
  recommendation: string
}

interface KeyTerm {
  term: string
  value: string
}

interface ContractAnalysisData {
  documentType: string
  parties: string[]
  effectiveDate: string | null
  expirationDate: string | null
  summary: string
  keyTerms: KeyTerm[]
  clauses: Clause[]
  riskFlags: RiskFlag[]
  overallRiskScore: 'low' | 'medium' | 'high'
  recommendations: string[]
}

interface ContractAnalysisProps {
  analysis: ContractAnalysisData
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { 
      label: 'Low Risk', 
      className: 'bg-[oklch(0.70_0.15_145)] text-[oklch(0.12_0.01_260)]'
    },
    medium: { 
      label: 'Medium Risk', 
      className: 'bg-[oklch(0.75_0.18_85)] text-[oklch(0.20_0_0)]'
    },
    high: { 
      label: 'High Risk', 
      className: 'bg-[oklch(0.60_0.20_25)] text-[oklch(0.95_0_0)]'
    },
  }
  
  return (
    <Badge className={cn('font-medium', config[level].className)}>
      {config[level].label}
    </Badge>
  )
}

function SeverityIcon({ severity }: { severity: 'warning' | 'caution' | 'critical' }) {
  const config = {
    warning: { Icon: AlertCircle, className: 'text-[oklch(0.65_0.12_230)]' },
    caution: { Icon: AlertTriangle, className: 'text-[oklch(0.75_0.18_85)]' },
    critical: { Icon: AlertTriangle, className: 'text-[oklch(0.60_0.20_25)]' },
  }
  const { Icon, className } = config[severity]
  return <Icon className={cn('w-5 h-5', className)} />
}

function RiskScoreCard({ score }: { score: 'low' | 'medium' | 'high' }) {
  const config = {
    low: {
      Icon: CheckCircle,
      label: 'Low Risk',
      description: 'This contract appears to have standard, fair terms.',
      bgClass: 'bg-[oklch(0.70_0.15_145/0.1)]',
      borderClass: 'border-[oklch(0.70_0.15_145/0.3)]',
      iconClass: 'text-[oklch(0.70_0.15_145)]',
    },
    medium: {
      Icon: AlertTriangle,
      label: 'Medium Risk',
      description: 'Some clauses require careful consideration before signing.',
      bgClass: 'bg-[oklch(0.75_0.18_85/0.1)]',
      borderClass: 'border-[oklch(0.75_0.18_85/0.3)]',
      iconClass: 'text-[oklch(0.75_0.18_85)]',
    },
    high: {
      Icon: AlertTriangle,
      label: 'High Risk',
      description: 'Significant concerns identified. Legal review recommended.',
      bgClass: 'bg-[oklch(0.60_0.20_25/0.1)]',
      borderClass: 'border-[oklch(0.60_0.20_25/0.3)]',
      iconClass: 'text-[oklch(0.60_0.20_25)]',
    },
  }
  
  const { Icon, label, description, bgClass, borderClass, iconClass } = config[score]
  
  return (
    <div className={cn('rounded-lg border p-4', bgClass, borderClass)}>
      <div className="flex items-center gap-3">
        <Icon className={cn('w-8 h-8', iconClass)} />
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function ContractAnalysis({ analysis }: ContractAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">{analysis.documentType}</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {analysis.parties.join(' & ')}
            </span>
          </div>
        </div>
        <RiskBadge level={analysis.overallRiskScore} />
      </div>

      {/* Overall Risk Score */}
      <RiskScoreCard score={analysis.overallRiskScore} />

      {/* Dates */}
      {(analysis.effectiveDate || analysis.expirationDate) && (
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-6">
              {analysis.effectiveDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Effective: </span>
                    <span className="text-foreground font-medium">{analysis.effectiveDate}</span>
                  </span>
                </div>
              )}
              {analysis.expirationDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Expires: </span>
                    <span className="text-foreground font-medium">{analysis.expirationDate}</span>
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Plain-English Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      {analysis.riskFlags.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[oklch(0.75_0.18_85)]" />
              Risk Flags ({analysis.riskFlags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.riskFlags.map((flag, index) => (
              <div 
                key={index} 
                className={cn(
                  "rounded-lg border p-4",
                  flag.severity === 'critical' && "bg-[oklch(0.60_0.20_25/0.05)] border-[oklch(0.60_0.20_25/0.2)]",
                  flag.severity === 'caution' && "bg-[oklch(0.75_0.18_85/0.05)] border-[oklch(0.75_0.18_85/0.2)]",
                  flag.severity === 'warning' && "bg-[oklch(0.65_0.12_230/0.05)] border-[oklch(0.65_0.12_230/0.2)]"
                )}
              >
                <div className="flex items-start gap-3">
                  <SeverityIcon severity={flag.severity} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{flag.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                    <div className="flex items-start gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-accent">{flag.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Terms */}
      {analysis.keyTerms.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Key Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.keyTerms.map((term, index) => (
                <div key={index} className="bg-secondary rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">{term.term}</p>
                  <p className="font-medium text-foreground">{term.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clause Analysis */}
      {analysis.clauses.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Clause Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {analysis.clauses.map((clause, index) => (
                <AccordionItem key={index} value={`clause-${index}`} className="border-border">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium text-foreground">{clause.title}</span>
                      <RiskBadge level={clause.riskLevel} />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Original Text</p>
                        <p className="text-sm text-foreground bg-secondary p-3 rounded-md font-mono leading-relaxed">
                          {clause.originalText}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">What This Means</p>
                        <p className="text-sm text-foreground leading-relaxed">{clause.explanation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Implications for You</p>
                        <p className="text-sm text-foreground leading-relaxed">{clause.implications}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center p-4 border border-border rounded-lg bg-secondary/50">
        <p>
          This analysis is provided for informational purposes only and does not constitute legal advice. 
          Always consult with a qualified attorney before signing legal documents.
        </p>
      </div>
    </div>
  )
}
