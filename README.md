# Visual Node Editor

An infinite-canvas visual node editor built with React + Vite. Drag nodes, pan and zoom the canvas, and connect nodes with bezier curves.

## Features

- **Infinite canvas** — pan with click-drag, zoom with scroll wheel
- **5 node types** — Process, Input, Output, Decision, Note
- **Bezier connections** — click the right handle to start, click another node's left handle to connect
- **Inline editing** — double-click any node title or body to edit text
- **Delete** — select a node and press Delete/Backspace, or double-click an edge
- **Dot-grid background** — moves with pan/zoom for spatial reference

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Usage

| Action | How |
|---|---|
| Pan canvas | Click-drag on empty space |
| Zoom | Scroll wheel |
| Add node | Click a button in toolbar, or double-click empty canvas |
| Move node | Click-drag the node |
| Connect nodes | Click right dot handle → click destination node |
| Edit label | Double-click node title or body |
| Delete node | Select → Delete key or Delete button |
| Delete edge | Double-click the edge line |
