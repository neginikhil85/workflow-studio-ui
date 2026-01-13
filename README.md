# Workflow Studio UI

The modern, responsive frontend for Workflow Engine, built with React, TypeScript, and Vite.

## Features

- 🎨 **Visual Workflow Builder**: Drag-and-drop interface using ReactFlow.
- 📊 **Execution History**: Detailed history of workflow runs.
- 🔍 **Node Observability**: Inspect inputs, outputs, and timing for every step of a run.
- 🔌 **Dynamic Configuration**: Forms for configuring HTTP, Kafka, and other integrations.
- 🚀 **Modern Stack**: React 18, TypeScript, TailwindCSS, Lucide Icons.

## Architecture

This project follows strictly typed, scalable patterns:

- **Service Pattern**: All API calls are centralized in `src/services` (`HttpWorkflowService`, `KafkaService`). Direct `axios` usage in components is prohibited.
- **Environment Config**: Type-safe configuration via `src/config/env.ts` and `.env`.
- **Constants**: Centralized constants in `src/config/constants.ts` (Status, Colors, Time).
- **Component Composition**: Small, focused components (e.g., `RunDetailsView`, `KafkaTopicConfig`).

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Environment:
Create `.env` file (or use default):
```env
VITE_API_BASE_URL=/api
```

### Running Locally

Start the development server:
```bash
npm run dev
```

Access the UI at `http://localhost:5173`.

### Building for Production

Build the type-safe production bundle:
```bash
npm run build
```

Artifacts will be generated in `dist/`.

## Project Structure

```
src/
├── components/     # UI Components
│   ├── layout/     # App Layout
│   ├── nodes/      # ReactFlow Nodes & Config Forms
│   └── workflow/   # Workflow List, History, Details
├── config/         # App Configuration (Env, Constants)
├── services/       # API Clients (HttpWorkflowService, KafkaService)
├── types/          # TypeScript Interfaces
└── utils/          # Helper functions
```
