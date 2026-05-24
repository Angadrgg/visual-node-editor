import { useRef, useState, useCallback, useEffect } from 'react'
import Canvas from './components/Canvas.jsx'
import Toolbar from './components/Toolbar.jsx'
import './App.css'

const NODE_TYPES = {
  default:  { label: 'Process',   color: '#4f8ef7', icon: '⬡' },
  input:    { label: 'Input',     color: '#22c55e', icon: '▶' },
  output:   { label: 'Output',    color: '#f97316', icon: '■' },
  decision: { label: 'Decision',  color: '#a855f7', icon: '◆' },
  note:     { label: 'Note',      color: '#eab308', icon: '✎'  },
}

let nodeIdCounter = 1
function makeNode(type, x, y) {
  return {
    id: String(nodeIdCounter++),
    type,
    x, y,
    width: 180,
    height: 72,
    title: NODE_TYPES[type].label,
    body: 'Double-click to edit',
  }
}

export default function App() {
  const [nodes, setNodes] = useState([
    { ...makeNode('input', 120, 160), title: 'Start', body: 'Entry point' },
    { ...makeNode('default', 380, 100), title: 'Process A', body: 'Transform data' },
    { ...makeNode('decision', 380, 260), title: 'Condition', body: 'x > 0 ?' },
    { ...makeNode('output', 640, 180), title: 'Result', body: 'Display output' },
    { ...makeNode('note', 640, 340), title: 'Note', body: 'Add comments here' },
  ])
  const [edges, setEdges] = useState([
    { id: 'e1', from: '1', to: '2' },
    { id: 'e2', from: '1', to: '3' },
    { id: 'e3', from: '2', to: '4' },
    { id: 'e4', from: '3', to: '4' },
  ])
  const [selected, setSelected] = useState(null)
  const [connecting, setConnecting] = useState(null) // { fromId }

  const addNode = useCallback((type, canvasX, canvasY) => {
    setNodes(ns => [...ns, makeNode(type, canvasX, canvasY)])
  }, [])

  const updateNode = useCallback((id, patch) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n))
  }, [])

  const deleteSelected = useCallback(() => {
    if (!selected) return
    setNodes(ns => ns.filter(n => n.id !== selected))
    setEdges(es => es.filter(e => e.from !== selected && e.to !== selected))
    setSelected(null)
  }, [selected])

  const startConnect = useCallback((fromId) => setConnecting({ fromId }), [])
  const finishConnect = useCallback((toId) => {
    if (!connecting || connecting.fromId === toId) { setConnecting(null); return }
    const exists = edges.some(e => e.from === connecting.fromId && e.to === toId)
    if (!exists) {
      setEdges(es => [...es, { id: 'e' + Date.now(), from: connecting.fromId, to: toId }])
    }
    setConnecting(null)
  }, [connecting, edges])

  const deleteEdge = useCallback((id) => {
    setEdges(es => es.filter(e => e.id !== id))
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteSelected])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Toolbar nodeTypes={NODE_TYPES} onAddNode={addNode} selected={selected} onDelete={deleteSelected} connecting={!!connecting} />
      <Canvas
        nodes={nodes} edges={edges} selected={selected}
        nodeTypes={NODE_TYPES} connecting={connecting}
        onSelect={setSelected} onUpdateNode={updateNode}
        onStartConnect={startConnect} onFinishConnect={finishConnect}
        onDeleteEdge={deleteEdge} onAddNode={addNode}
        onCancelConnect={() => setConnecting(null)}
      />
    </div>
  )
}