/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import * as main from '../src/main';

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the reviewed-by trailer', async () => {
    const selectedStates = 'accepted';
    const PRState = 'accepted';
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'states':
          return selectedStates;
        default:
          return '';
      }
    });
    //github.context.payload.review.state = PRState;

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, `Selected states: ${selectedStates}`);
    //expect(debugMock).toHaveBeenNthCalledWith(1, `PR state: ${PRState}`);
    //expect(debugMock).toHaveBeenNthCalledWith(1, `Username: ${username}`);

    expect(errorMock).not.toHaveBeenCalled()
  })
})
