import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const selectedStates = core
      .getInput('states', { required: true })
      .split(',')
      .map(s => s.trim())
    core.debug(`Selected states: ${selectedStates}`)

    const context = github.context
    const state = context.payload.review.state
    core.debug(`PR state: ${state}`);
    if (!selectedStates.includes(state)) {
      core.notice(`Skipping: non-selected PR state: ${state}`)
    } else {
      core.info(`Selected PR state: ${state}`)

      const token = process.env.GITHUB_TOKEN as string
      const rest = github.getOctokit(token).rest

      const username = context.payload.review.user.login
      core.debug(`Username: ${username}`)

      const { data: user } = await rest.users.getByUsername({
        username
      })
      core.debug(`User: ${user}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
