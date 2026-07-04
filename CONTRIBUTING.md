# Contributing to Minimaldoro

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Fork & clone** the repo
   ```bash
   git clone https://github.com/your-username/minimaldoro.git
   cd minimaldoro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in dev mode**
   ```bash
   npm run dev
   ```
   This starts Vite + Electron with hot reload.

## Project Structure

```
minimaldoro/
├── electron/          # Electron main process
│   ├── main.js        # App entry, window management, tray
│   ├── preload.js     # Context bridge for IPC
│   └── db.js          # SQLite database layer
├── src/               # Svelte frontend
│   ├── App.svelte     # Root component
│   ├── lib/           # Reusable components & stores
│   └── main.js        # Frontend entry
├── assets/            # Icons, images, build resources
├── docs/              # Landing page (GitHub Pages)
└── package.json
```

## Tech Stack

- **Frontend:** Svelte 5 + Vite 6
- **Desktop:** Electron 33
- **Database:** better-sqlite3
- **Styling:** Tailwind CSS

## Code Style

- Use **2-space indentation**
- Follow existing patterns in the codebase
- Keep changes focused — don't refactor unrelated code
- Svelte 5 runes mode: use `$state`, `$derived`, `$effect`, `$props()`
- No `export let` in components — use `$props()` destructuring instead
- Name files in `PascalCase.svelte` for components, `camelCase.js` for utilities

## Commit Messages

Use clear, descriptive messages following [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add widget shadow polish`
- `fix: prevent widget stretching on small screens`
- `docs: update README with build instructions`
- `chore: clean up dependencies`

## Making Changes

1. Create a branch from `main`
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and test them with `npm run dev`

3. Commit with a clear message (see above)

4. Push and open a Pull Request

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Describe what you changed and why
- Include screenshots if you changed the UI
- Make sure `npm run dev` works without errors
- Update README if you change user-facing behavior
- Update version in `package.json` and `AboutModal.svelte` if it's a release

## Reporting Bugs

Open a [GitHub Issue](https://github.com/psb-001/minimaldoro/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Your OS and Windows version
- Screenshot if UI-related

## Feature Requests

Open an issue with the `enhancement` label and describe:
1. The problem you're solving
2. Your proposed solution
3. Any alternatives you've considered

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
