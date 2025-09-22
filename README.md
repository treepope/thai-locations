# Thai-Locations Project

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/22a2605e-822b-407f-8a3d-4b23a76cb533) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

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
cd thai-local-view

# Step 3: Install dependencies
npm install

# Step 4: Start development server
npm run dev
```

The app will run on [http://localhost:5173](http://localhost:5173).

---

## Project Structure
```
thai-local-view/
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

You can deploy this project easily on any static hosting service that supports Vite builds, such as:
- Vercel
- Netlify
- GitHub Pages

Build the project with:
```sh
npm run build
```
The production-ready files will be in the `dist/` folder.

---

## Customization
- Update styling in `tailwind.config.js`
- Extend UI components via [shadcn-ui](https://ui.shadcn.com/)
- API data source is fetched from [kongvut/thai-province-data](https://github.com/kongvut/thai-province-data)

---
