'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import { ContractAnalysis } from '@/components/contract-analysis'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { FileText, Shield, Zap, AlertTriangle, ArrowRight } from 'lucide-react'

interface ContractAnalysisData {
  documentType: string
  parties: string[]
  effectiveDate: string | null
  expirationDate: string | null
  summary: string
  keyTerms: { term: string; value: string }[]
  clauses: {
    title: string
    originalText: string
    explanation: string
    riskLevel: 'low' | 'medium' | 'high'
    implications: string
  }[]
  riskFlags: {
    severity: 'warning' | 'caution' | 'critical'
    title: string
    description: string
    recommendation: string
  }[]
  overallRiskScore: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ContractAnalysisData | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setAnalysis(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze contract')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      toast.success('Contract analyzed successfully')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to analyze contract')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {!analysis ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Understand your contracts
                <span className="text-accent"> before you sign</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Upload any legal document and get instant plain-English summaries, 
                risk assessments, and clause-by-clause explanations.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Plain English</h3>
                <p className="text-sm text-muted-foreground">Complex legal jargon translated into clear language</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Risk Detection</h3>
                <p className="text-sm text-muted-foreground">Identify problematic clauses and potential issues</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">Get comprehensive insights in seconds</p>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <FileUpload 
                onFileSelect={handleFileSelect} 
                disabled={isAnalyzing}
              />
              
              {selectedFile && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Spinner className="mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Contract
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Powered by AI</span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={handleReset}
              >
                Analyze Another Contract
              </Button>
            </div>
            <ContractAnalysis analysis={analysis} />
          </div>
        )}
      </main>
    </div>
  )
}
