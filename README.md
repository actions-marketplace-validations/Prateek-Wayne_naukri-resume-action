# Naukri Resume Action 📄

[![GitHub Super-Linter](https://github.com/Prateek-Wayne/naukri-resume-action/actions/workflows/linter.yml/badge.svg)](https://github.com/Prateek-Wayne/naukri-resume-action/actions/workflows/linter.yml)
[![CI](https://github.com/Prateek-Wayne/naukri-resume-action/actions/workflows/ci.yml/badge.svg)](https://github.com/Prateek-Wayne/naukri-resume-action/actions/workflows/ci.yml)

A GitHub Action to automatically upload your resume to Naukri.com. Keep your
profile fresh and maintain activity on your account without manual intervention!
🚀

## Features ✨

- 🔄 Scheduled resume uploads to keep your profile active
- 🔐 Secure credential handling
- 📂 Support for multiple resume files
- 🖱️ Manual trigger option for immediate updates

## Usage 🛠️

Add the following workflow to your repository in
`.github/workflows/update-naukri-resume.yml`:

```yaml
name: Update Naukri Resume

on:
  schedule:
    - cron: '0 0 * * 1,4' # Run every Monday and Thursday
  # Manual trigger option
  workflow_dispatch:

jobs:
  upload-resume:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Upload resume to Naukri
        uses: Prateek-Wayne/naukri-resume-action@v1
        with:
          username: ${{ secrets.NAUKRI_USERNAME }}
          password: ${{ secrets.NAUKRI_PASSWORD }}
          profile_id: ${{ secrets.NAUKRI_PROFILE_ID }}
          resume_path: |-
            resumes/resume1.pdf
            resumes/resume2.pdf
            resumes/resume3.pdf
```

## Inputs 📝

| Input         | Description                             | Required |
| ------------- | --------------------------------------- | -------- |
| `username`    | Your Naukri.com login email             | Yes      |
| `password`    | Your Naukri.com password                | Yes      |
| `profile_id`  | Your Naukri profile ID                  | Yes      |
| `resume_path` | Path(s) to resume file(s), one per line | Yes      |

## Security 🔒

For security, **never** hardcode your credentials in the workflow file. Always
use GitHub Secrets:

1. Go to your repository settings
2. Navigate to Secrets and Variables > Actions
3. Add the following secrets:
   - `NAUKRI_USERNAME` - Your Naukri.com email
   - `NAUKRI_PASSWORD` - Your Naukri.com password
   - `NAUKRI_PROFILE_ID` - Your Naukri profile ID

## Local Testing 🧪

For local testing with [act](https://github.com/nektos/act):

```bash
act -j upload-resume -s NAUKRI_USERNAME=your-email -s NAUKRI_PASSWORD=your-password -s NAUKRI_PROFILE_ID=your-profile-id
```

## License 📄

MIT
