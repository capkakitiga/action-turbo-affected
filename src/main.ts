import { execSync } from 'child_process'
import { join } from 'path'
import { getInput, debug, setFailed, setOutput } from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
  try {
    // Get Inputs
    const from = getInput('from', { required: true })
    const to = getInput('to', { required: true })
    const workingDirectory = getInput('working-directory', { required: true })

    debug(`Inputs: ${JSON.stringify({ from, to, workingDirectory })}`)

    const json = await execSync(
      `npx turbo run build --filter="[${from}...${to}]" --dry-run=json`,
      {
        cwd: join(process.cwd(), workingDirectory),
        encoding: 'utf-8',
      },
    )

    debug(`Output from Turborepo: ${json}`)

    const parsedOutput = JSON.parse(json)

    setOutput('affected', parsedOutput)
  } catch (error) {
    if (error instanceof Error || typeof error === 'string') {
      setFailed(error)
    } else {
      setFailed('Unknown error occured.')
    }
  }
}

void run()
