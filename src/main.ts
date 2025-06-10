import * as core from '@actions/core';
import * as fs from 'fs';
import { login } from './api/login';
import { uploadResume } from './api/uploadResume';

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get user inputs
    const username = core.getInput('username');
    const password = core.getInput('password');
    const profileId = core.getInput('profile_id');
    const resumePathInput = core.getInput('resume_path');

    // Mask sensitive inputs
    core.setSecret(username);
    core.setSecret(password);
    core.setSecret(profileId);

    // Parse resume paths (could be a single path or multiple paths in YAML array format)
    let resumePaths: string[] = [];

    // If the input contains newlines, it's likely a YAML array
    if (resumePathInput.includes('\n')) {
      resumePaths = resumePathInput
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#')); // Remove empty lines and comments
    } else {
      // Single path
      resumePaths = [resumePathInput];
    }

    if (resumePaths.length === 0) {
      throw new Error('🚫 No valid resume paths provided');
    }

    // Verify all paths exist
    const validResumePaths = resumePaths.filter((path) => {
      const exists = fs.existsSync(path);
      if (!exists) {
        core.warning(`⚠️ Resume file not found: ${path}`);
      }
      return exists;
    });

    if (validResumePaths.length === 0) {
      throw new Error('🚫 No valid resume files found at the specified paths');
    }

    // Select resume based on date for deterministic selection
    // This provides a consistent way to rotate resumes based on the calendar
    const today = new Date();
    const dayOfMonth = today.getDate(); // 1-31
    const dayOfWeek = today.getDay(); // 0-6 (Sunday is 0)
    const month = today.getMonth(); // 0-11

    // Combine day of month, day of week, and month for better distribution
    const selectionFactor =
      (dayOfMonth + dayOfWeek * 5 + month * 31) % validResumePaths.length;

    const selectedResume = validResumePaths[selectionFactor];

    core.info(`📄 Selected resume for upload: ${selectedResume}`);
    core.info(
      `📅 Selection based on date: Day ${dayOfMonth}, Weekday ${dayOfWeek}, Month ${month + 1}`
    );
    core.setOutput('selected_resume 📄', selectedResume);

    // Login to Naukri
    core.info('🔐 Logging in to Naukri.com...');
    const cookies = await login(username, password);

    if (!cookies) {
      throw new Error('❌ Login failed');
    }

    // Upload the resume
    core.info('⬆️ Uploading resume...');
    const success = await uploadResume(cookies, selectedResume, profileId);

    // Set outputs
    core.setOutput('upload_status 🚀', success ? 'success ✅' : 'failure ❌');
    core.setOutput('upload_time 🕒', new Date().toISOString());

    if (success) {
      core.info('✅ Resume uploaded successfully!');
    } else {
      core.setFailed('❌ Resume upload failed');
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(`❗ ${error.message}`);
  }
}
