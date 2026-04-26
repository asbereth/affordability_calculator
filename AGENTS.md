# Project Context

This repository is a dependency-free vanilla JavaScript Australian mortgage affordability calculator.

## App Shape

- `index.html` defines the single-page calculator form and live results panel.
- `src/mortgage.js` owns all mortgage math and validation.
- `src/app.js` reads form values, calls `calculateAffordabilitySummary`, formats AUD/percent values, and updates the DOM.
- `src/styles.css` handles the responsive two-column calculator/results layout.
- `test/mortgage.test.js` covers the core repayment formula, inverse borrowing capacity, zero-interest cases, deposit/LVR summary, and unsupported frequency errors.

## Commands

- Run tests: `npm test`
- Run local site: `npm start`, then open `http://localhost:4173`

## Git And GitHub Notes

- Local Git author for this repo was set to:
  - Name: `Andree Susanto`
  - Email: `asbereth.susanto@gmail.com`
- Remote `origin` points to `https://github.com/asbereth/affordability_calculator.git`.
- Branch `master` tracks `origin/master`.
- Commit `5089e9c Add repository ignore rules` added `.gitignore` for `.codex`, `node_modules/`, and `.DS_Store`.
- Tests passed before that commit was pushed.

## Authentication Context

On 2026-04-26, this machine did not have `gh` or Git Credential Manager installed. A portable GitHub CLI `v2.91.0` Linux amd64 tarball was downloaded to `/tmp`, verified against GitHub's checksum, and used for browser/device authentication.

The login completed as GitHub user `asbereth`. Global `gh auth setup-git` could not update `/home/asbereth/.gitconfig` due sandbox write restrictions, so the successful push used a one-off credential helper command:

```bash
git -c credential.https://github.com.helper="!/tmp/gh_2.91.0_linux_amd64/bin/gh auth git-credential" push -u origin master
```

If `/tmp/gh_2.91.0_linux_amd64/bin/gh` is no longer present in a future session, install GitHub CLI or download a fresh portable binary, then either run `gh auth login --web` again or use the existing keyring auth if available.
