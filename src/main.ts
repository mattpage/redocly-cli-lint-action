import {performance} from 'perf_hooks'
import {info, setFailed, getInput} from '@actions/core'
import {
  loadConfig,
  Config,
  lint,
  formatProblems,
  getTotals,
  Totals
} from '@redocly/openapi-core'

import {
  getExecutionTime,
  getFallbackApisOrExit,
  printLintTotals
} from '@redocly/cli/lib/utils'

type ErrorFormat = 'codeframe' | 'stylish' | 'json' | undefined

async function run(): Promise<void> {
  try {
    const configFile: string = getInput('config')
    const config: Config = await loadConfig({configPath: configFile})
    const entryPointInput: string = getInput('entrypoints')
    const entryPointPaths = entryPointInput ? entryPointInput.split(' ') : []
    const entryPoints = await getFallbackApisOrExit(entryPointPaths, config)
    const format = getInput('format') as ErrorFormat

    let maxProblems: number = parseInt(getInput('max_problems'))
    if (isNaN(maxProblems)) {
      maxProblems = 100
    }

    const totals: Totals = {errors: 0, warnings: 0, ignored: 0}

    for (const entryPoint of entryPoints) {
      try {
        const startedAt = performance.now()
        info(`validating ${entryPoint.path}...\n`)

        const results = await lint({
          ref: entryPoint.path,
          config
        })

        const fileTotals = getTotals(results)
        totals.errors += fileTotals.errors
        totals.warnings += fileTotals.warnings
        totals.ignored += fileTotals.ignored

        formatProblems(results, {
          format,
          maxProblems,
          totals: fileTotals,
          version: '0.0.1'
        })

        const elapsed = getExecutionTime(startedAt)
        info(`${entryPoint.path}: validated in ${elapsed}\n\n`)
      } catch (e) {
        setFailed((e as Error).message)
      }
    }

    printLintTotals(totals, entryPoints.length)

    if (totals.errors > 0) {
      setFailed('Lint failed')
    }
  } catch (error) {
    setFailed((error as Error).message)
  }
}

run()
