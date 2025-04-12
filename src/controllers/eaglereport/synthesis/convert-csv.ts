import { stringify } from 'csv-stringify/sync'
import { SynthesisReport, SynthesisReportSummary } from 'src/models/dynamo/request-synthesis'

import { SynthesisReportResponse } from './synthesis-report'

export type ConvertCsvParams = {
  summary: boolean
  synthesis_report: SynthesisReportResponse
  company_name: string
}

const convertCsv = ({
  company_name,
  summary,
  synthesis_report,
}: ConvertCsvParams): string => {
  if (summary) {
    const columns: Record<keyof SynthesisReportSummary, string> = {
      company_name: 'Nome da empresa',
      count: 'Quantidade de requisições de síntese',
    }

    const input: Array<SynthesisReportSummary> = [{
      company_name,
      count: synthesis_report.count,
    }]

    const csv = stringify(input, {
      header: true,
      columns,
      bom: true,
    })

    return csv
  }

  synthesis_report.result.sort(
    (r1, r2) => r1.created_at > r2.created_at
      ? 1
      : r1.created_at < r2.created_at
        ? -1
        : 0,
  )

  const columns: Record<keyof SynthesisReport, string> = {
    company_name: 'Nome da empresa',
    created_at: 'Data de criação da síntese',
    updated_at: 'Data da última atualização da síntese',
    request_id: 'ID da requisição',
    synthesis_id: 'ID da síntese',
  }

  const csv = stringify(synthesis_report.result, {
    header: true,
    columns,
    bom: true,
  })

  return csv
}

export default convertCsv
