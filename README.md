# Thai Locations

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd thai-locations

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

# Thai Local View

A React + Vite + TypeScript project for exploring and searching Thai administrative divisions (Province → District → Sub-district) with a modern UI powered by **shadcn-ui** and **Tailwind CSS**.

---

## Features

- 🌏 Load full dataset of Thai provinces, districts, and sub-districts
- 🔍 Search by Thai or English name across all levels
- 🗂️ Cascading selects (Province → District → Sub-district) with automatic reset
- 📮 Auto-display postal codes when a sub-district is selected
- 📊 Toggle result views: Card view or Table view
- 🎨 Responsive design with TailwindCSS & shadcn-ui components
- ⚡ Built with Vite for fast development and HMR

---

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

### Prerequisites
- Node.js (>=18)
- npm or yarn

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to project directory
cd thai-locations

# Step 3: Install dependencies
npm install

# Step 4: Start development server
npm run dev
```

The app will run on [http://localhost:5173](http://localhost:5173).

---

## Project Structure
```
thai-locations/
├── src/
│   ├── components/
│   │   └── SearchInterface.tsx   # Main search component
│   ├── App.tsx                   # Root app entry
│   └── main.tsx                  # React DOM renderer
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Deployment

This project is deployed on **Vercel**.

Live demo: [https://thai-locations.vercel.app](https://thai-locations.vercel.app)

### Build & Deploy manually
```sh
npm run build
```
This will generate a production-ready `dist/` folder that can be deployed to any static hosting service such as Vercel, Netlify, or GitHub Pages.
```
