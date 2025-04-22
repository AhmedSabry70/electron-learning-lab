# 🚀 Electron Learning Lab

_A sandbox for mastering cross-platform desktop app development with Electron.js_

![Electron.js](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg) ![Electron Version](https://img.shields.io/badge/Electron-28.2.0-47848F?logo=electron) ![Node Version](https://img.shields.io/badge/Node-18.16.1-339933?logo=nodedotjs)
![GitHub License](https://img.shields.io/github/license/AhmedSabry70/electron-learning-lab)
![Last Commit](https://img.shields.io/github/last-commit/AhmedSabry70/electron-learning-lab)

**Explore • Experiment • Master** - A hands-on laboratory for building modern desktop applications using Electron fundamentals.

---

## 🎯 Features

- 🖥️ **Core Concepts** - Main/renderer process architecture
- 📡 **IPC Communication** - Secure message passing examples
- 🧪 **UI Experiments** - System tray, native dialogs, menus
- 📦 **Packaging** - Multi-platform builds with electron-builder
- 🔥 **Hot Reload** - Instant development feedback

---

## 📦 Project Structure

```bash
electron-learning-lab/
├── src/
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Core Framework**: [Electron](https://www.electronjs.org/) 28+
- **Packaging**: [electron-builder](https://www.electron.build/)
- **UI Toolkit**: [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/AhmedSabry70/electron-learning-lab.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build production packages
npm run build
```

---

## 🌟 Featured Experiments

---

## 🧭 Learning Path

- `basic-window` – Minimal Electron setup
- `ipc-demo` – Process communication
- `native-features` – System integrations
- `packaging` – Distribution workflows

---

## 🤝 Contributing

Found a bug or have an idea? Contributions welcome!

```bash
# Fork the repository

# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

Distributed under the **MIT License**.  
See [`LICENSE`](./LICENSE) for more information.

---

## 🛠️ Crafted with ❤️ by [Ahmed Sabry]

📧 **Reach out:** [mrsabry134@gmail.com]  
🔗 [Electron Documentation](https://www.electronjs.org/docs)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
