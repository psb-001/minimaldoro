# Minimaldoro

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Electron](https://img.shields.io/badge/Electron-33.x-green)
![Svelte](https://img.shields.io/badge/Svelte-5.x-orange)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

Minimaldoro is an elegant desktop countdown timer and event tracker for Windows. Track upcoming events, celebrate milestones, and stay on top of what matters — all from your system tray and desktop widgets.

## Screenshots

![Main App](https://github.com/psb-001/minimaldoro/blob/main/docs/screenshot-app.png?raw=true)
![Widget](https://github.com/psb-001/minimaldoro/blob/main/docs/screenshot-widget.png?raw=true)

## Features

- **Event Management** — Add, edit, and delete countdown events with custom colors and reminder settings
- **Desktop Widgets** — Pin events to your desktop as resizable, always-on-top widgets
- **System Tray** — Runs quietly in the background; open the app from the tray icon
- **Auto-start** — Optional auto-launch on Windows login so your widgets appear automatically
- **Notifications** — Get reminded before events arrive via native Windows notifications
- **Privacy First** — All data stored locally in SQLite; no telemetry, no cloud sync

## Tech Stack

- **Frontend:** Svelte 5 + Vite 6
- **Desktop:** Electron 33
- **Database:** better-sqlite3
- **Build:** electron-builder (NSIS installer)

## Getting Started

### Prerequisites

- Node.js 18+
- Windows 10/11
- Git

### Install from Release

Download the latest installer from the [Releases page](https://github.com/psb-001/minimaldoro/releases).

### Build from Source

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the app
npm run build:app
```

## Usage

1. On first launch, accept the Terms & Conditions and Privacy Policy
2. Add events using the **New event** button
3. Pin events to desktop using the 📌 button on event cards
4. Resize and move widgets anywhere on your screen
5. Right-click a widget to unpin it
6. Access About / Privacy / Terms from the footer links

## Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev:vite

# Start Electron (in another terminal)
npm run dev:electron
```

## Auto-Updates

When a new version is released, Minimaldoro will automatically download the update and prompt you to restart.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Windows installer with auto-update
- [ ] Multi-monitor widget support
- [ ] Theme support (dark/light/system)
- [ ] Export/import events
- [ ] Celebration animations
- [ ] macOS support

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

- **psb-001** — [github.com/psb-001](https://github.com/psb-001)

---

*Built with Svelte, Electron, and SQLite.*
