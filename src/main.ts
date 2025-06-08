import { login } from './api/login.ts';
import { uploadResume } from './api/uploadResume.ts';
import * as core from '@actions/core';

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  try {
    const username = core.getInput('username');
    const password = core.getInput('password');
    const resumePath = core.getInput('resume_path');
    const profileId = core.getInput('profile_id');
    // Mask sensitive inputs in logs
    core.setSecret(username);
    core.setSecret(password);
    core.setSecret(profileId);

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Starting Naukri resume upload process...`);
    core.debug(`Resume path: ${username}`);
    core.debug(`Resume path: ${password}`);
    core.debug(`Resume path: ${resumePath}`);
    core.debug(`Overwrite existing: ${profileId}`);
    console.log('Logging in🚀...................');
    const cookies = await login(username, password);

    if (!cookies) {
      console.error('Login failed');
      return;
    }

    console.log('Login successful');

    if (!resumePath || !profileId) {
      console.error('RESUME_PATH and PROFILE_ID must be set in .env file');
      return;
    }

    // Upload and update resume
    const result = await uploadResume(cookies, resumePath, profileId);

    if (result) {
      core.setOutput('upload_status', 'success');
      core.setOutput('upload_time', new Date().toISOString());
      core.info('Resume upload completed successfully!');
    } else {
      console.error('Resume upload or update failed');
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
