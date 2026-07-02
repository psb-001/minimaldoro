# Contributing to Minimaldoro

Thanks for your interest in contributing! This is a small, focused project, so here's what you need to know.

## Development Setup

```bash
git clone https://github.com/psb-001/minimaldoro.git
cd minimaldoro
npm install
npm run dev
```

## Code Style

- Use **2-space indentation**
- Follow existing patterns in the codebase
- Keep changes focused — don't refactor unrelated code
- Svelte 5 runes mode: use `$state`, `$derived`, `$effect`, `$props()`
- No `export let` in components — use `$props()` destructuring instead

## Commit Messages

Use clear, descriptive messages:
- `feat: add widget shadow polish`
- `fix: prevent widget stretching on small screens`
- `docs: update README with build instructions`

## Reporting Bugs

Open an issue with:
1. Windows version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshot if UI-related

## Feature Requests

Open an issue with the `enhancement` label and describe:
1. The problem you're solving
2. Your proposed solution
3. Any alternatives you've considered

## Pull Requests

1. Keep PRs small and focused
2. Update README if you change behavior
3. Make sure the app runs without errors
4. Update version in `package.json` and `AboutModal.svelte` if it's a release
