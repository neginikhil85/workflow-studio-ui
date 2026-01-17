# Frontend Coding Style Guidelines

## Core Philosophy

> **Declarative Composition with Recursive Modularization**
> 
> Components should be so clear that looking at JSX tells you the entire mental model.
> Break down recursively until a component is atomic and further splitting is illogical.

---

## Component Design Principles

### 1. Declarative JSX = Mental Map

The JSX should read like a blueprint. Anyone should understand the UI structure at a glance.

```tsx
// ✅ GOOD: Clear mental model from JSX
const WorkflowLayout: React.FC = () => {
    return (
        <div className="w-screen h-screen flex flex-col">
            <Header state={state} execution={execution} />
            <div className="flex-1 flex">
                <Sidebar />
                <Canvas state={state} actions={actions} />
                <ConfigModal node={selectedNode} isOpen={isModalOpen} />
            </div>
        </div>
    );
};

// ❌ BAD: Logic mixed with JSX, unclear structure
const WorkflowLayout: React.FC = () => {
    return (
        <div>
            {isLoading ? <Spinner /> : (
                <div>
                    {nodes.map(n => <div key={n.id}>{n.type === 'http' ? ... : ...}</div>)}
                </div>
            )}
        </div>
    );
};
```

### 2. Recursive Modularization

Break components down until they're atomic. Stop when further splitting is illogical.

```
WorkflowLayout          ← Page-level composition
├── Header              ← Section (groups related elements)
│   ├── HeaderTitle     ← Atomic (single responsibility)
│   └── HeaderActions   ← Atomic
├── Sidebar             ← Section
│   ├── SidebarCategory ← Atomic
│   └── SidebarItem     ← Atomic
└── Canvas              ← Section
    └── ...
```

**Rule**: If a component does > 1 thing, split it. If a split creates meaningless fragments, stop.

### 3. Abstraction Hides Implementation

Parent components don't know HOW children work, only WHAT they do.

```tsx
// ✅ Parent doesn't know Canvas internals
<Canvas state={state} actions={actions} />

// ❌ Parent managing Canvas implementation
<div ref={canvasRef} onDragOver={handleDrag} onDrop={handleDrop}>
    {nodes.map(n => <Node key={n.id} {...n} />)}
</div>
```

---

## File Structure

```
src/
├── components/
│   ├── layout/           # Page layouts
│   │   ├── WorkflowLayout.tsx
│   │   └── header/
│   │       ├── Header.tsx
│   │       ├── HeaderTitle.tsx
│   │       └── HeaderActions.tsx
│   ├── workflow/         # Feature components
│   └── common/           # Shared UI (buttons, modals)
├── hooks/
│   └── workflow/
│       ├── useWorkflow.ts      # Facade hook
│       ├── useWorkflowState.ts # State management
│       └── useWorkflowCanvas.ts # Canvas logic
├── services/             # API calls
├── contexts/             # React contexts
├── types/                # TypeScript interfaces
└── utils/                # Pure utility functions
```

---

## Hooks Pattern

### Facade Hook Pattern

One facade hook composes smaller hooks and exposes a clean API.

```ts
// ✅ useWorkflow.ts - Facade
export const useWorkflow = () => {
    const state = useWorkflowState();
    const canvas = useWorkflowCanvas(state);
    const execution = useWorkflowExecution(state);
    const persistence = useWorkflowPersistence(state);

    return {
        state: { nodes, edges, workflowId, ... },
        actions: { onConnect, onDrop, ... },
        execution: { isRunning, run, stop },
        persistence: { save, load, clear },
    };
};
```

**Benefits**:
- Component only imports `useWorkflow`
- Clean separation of concerns
- Easy to test individual hooks

---

## Props Interface Pattern

```tsx
// ✅ Define interface before component
interface HeaderProps {
    state: HeaderState;
    execution: HeaderExecution;
    onWorkflows: () => void;
}

const Header: React.FC<HeaderProps> = ({ state, execution, onWorkflows }) => {
    // ...
};
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `HeaderActions.tsx` |
| Hook | camelCase with use | `useWorkflow.ts` |
| Service | camelCase + .service | `auth.service.ts` |
| Type/Interface | PascalCase | `WorkflowNode` |
| Context | PascalCase + Context | `AuthContext.tsx` |

---

## Code Quality Rules

1. **No inline logic in JSX** - Extract to handler or child component
2. **No comments needed** - Code should be self-documenting
3. **Max 80 lines per file** - Split if larger
4. **Single export per file** - Exception: types
5. **Props drilling max 2 levels** - Use context beyond
6. **No any type** - Properly type everything

---

## Example: Good Component

```tsx
// HeaderActions.tsx - ~30 lines, single responsibility
import React from 'react';
import { HeaderExecution, HeaderPersistence } from '../../../types';

interface HeaderActionsProps {
    execution: HeaderExecution;
    persistence: HeaderPersistence;
    onWorkflows: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ 
    execution, 
    persistence, 
    onWorkflows 
}) => {
    return (
        <div className="flex items-center gap-2">
            <Button onClick={persistence.saveWorkflow} icon={<SaveIcon />}>
                Save
            </Button>
            <Button onClick={execution.runWorkflow} variant="primary">
                {execution.isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button onClick={onWorkflows}>Workflows</Button>
        </div>
    );
};
```
