import { generateText, Output } from 'ai'
import { z } from 'zod'

const clauseSchema = z.object({
  title: z.string().describe('Short title for the clause'),
  originalText: z.string().describe('The original clause text from the document'),
  explanation: z.string().describe('Plain-English explanation of what this clause means'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Risk level of this clause'),
  implications: z.string().describe('What this means for the signing party'),
})

const contractAnalysisSchema = z.object({
  documentType: z.string().describe('Type of document (e.g., NDA, Employment Contract, Service Agreement)'),
  parties: z.array(z.string()).describe('Parties involved in the contract'),
  effectiveDate: z.string().nullable().describe('When the contract takes effect'),
  expirationDate: z.string().nullable().describe('When the contract expires, if applicable'),
  summary: z.string().describe('A clear, plain-English summary of the entire document in 2-3 paragraphs'),
  keyTerms: z.array(z.object({
    term: z.string(),
    value: z.string(),
  })).describe('Key terms and their values (e.g., payment amount, notice period)'),
  clauses: z.array(clauseSchema).describe('Important clauses with explanations'),
  riskFlags: z.array(z.object({
    severity: z.enum(['warning', 'caution', 'critical']),
    title: z.string(),
    description: z.string(),
    recommendation: z.string(),
  })).describe('Potential risks and concerns in the contract'),
  overallRiskScore: z.enum(['low', 'medium', 'high']).describe('Overall risk assessment'),
  recommendations: z.array(z.string()).describe('Actionable recommendations before signing'),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    
    // Determine media type
    let mediaType = 'application/pdf'
    if (file.type) {
      mediaType = file.type
    } else if (file.name.endsWith('.txt')) {
      mediaType = 'text/plain'
    } else if (file.name.endsWith('.docx')) {
      mediaType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      output: Output.object({
        schema: contractAnalysisSchema,
      }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert contract analyst and legal advisor. Analyze this legal document thoroughly and provide:

1. A clear, plain-English summary that a non-lawyer can understand
2. Identification of all parties involved
3. Key terms and important dates
4. Detailed explanation of each significant clause
5. Risk assessment for each clause and overall
6. Specific flags for concerning terms (unfair terms, unusual clauses, potential issues)
7. Actionable recommendations

Be thorough but write in accessible language. Highlight anything that could be problematic for the signing party. If this is not a legal document, still analyze it as best you can and note that it may not be a standard contract.`,
            },
            {
              type: 'file',
              data: base64,
              mediaType: mediaType as 'application/pdf' | 'text/plain',
              filename: file.name,
            },
          ],
        },
      ],
    })

    return Response.json({ analysis: output })
  } catch (error) {
    console.error('Contract analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze contract. Please try again.' },
      { status: 500 }
    )
  }
}
