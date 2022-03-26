import { getInput } from '@actions/core'
import yargs from 'yargs'

type Args = yargs.Arguments & {
  sitemap?: string
  allowList?: string
}

// gather the arguments from the action inputs, or from the CLI arguments with yargs if invoked from CLI
// if both are provided, the action inputs take precedence
export async function gatherArgs(options): Promise<Args> {
  const args = yargs(process.argv).options(options).exitProcess(false).parse()

  for (const arg in options) {
    const actionArg = getInput(arg)
    if (actionArg) {
      args[arg] = actionArg
    }
  }
  return args
}
