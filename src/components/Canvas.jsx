import { useRef, useState, useCallback, useEffect } from 'react'
import Node from './Node.jsx'
import EdgeLayer from './EdgeLayer.jsx'

export default function Canvas({
  nodes, edges, selected, nodeTypes, connecting,
  onSelect, onUpdateNode, onStartConnect, onFinishConnect,
  onDeleteEdge, onAddNode, onCancelConnect
}) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  const screenToCanvas = useCallback((sx, sy) => ({
    x: (sx - pan.x) / zoom,
    y: (sy - pan.y) / zoom,
  }), [pan, zoom])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(z => Math.min(3, Math.max(0.2, z * delta)))
  }, [])

  const onMouseDown = useCallback((e) => {
    if (e.target !== canvasRef.current && e.target.tagName !== 'svg' && !e.target.classList.contains('edge-hit')) return
    if (connecting) { onCancelConnect(); return }
    if (e.button !== 0 && e.button !== 1) return
    isPanning.current = true
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    onSelect(null)
  }, [pan, connecting, onSelect, onCancelConnect])

  const onMouseMove = useCallback((e) => {
    if (!isPanning.current) return
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y })
  }, [])

  const onMouseUp = useCallback(() => { isPanning.current = false }, [])

  const onDblClick = useCallback((e) => {
    if (e.target !== canvasRef.current && e.target.tagName !== 'svg') return
    const { x, y } = screenToCanvas(e.clientX, e.clientY)
    onAddNode('default', x - 90, y - 36)
  }, [screenToCanvas, onAddNode])

  useEffect(() => {
    const el = canvasRef.current
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  return (
    <div
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDblClick}
      style={{
        position: 'absolute', inset: 0,
        cursor: connecting ? 'crosshair' : isPanning.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0f0f13 100%)',
      }}
    >
      {/* Dot grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <pattern id="dots" x={pan.x % (20 * zoom)} y={pan.y % (20 * zoom)}
            width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
            <circle cx={zoom} cy={zoom} r={zoom * 0.4} fill="#ffffff12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* World transform group */}
      <div style={{
        position: 'absolute', transformOrigin: '0 0',
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        width: 0, height: 0,
      }}>
        {/* Edge SVG layer */}
        <EdgeLayer nodes={nodes} edges={edges} nodeTypes={nodeTypes} onDelete={onDeleteEdge} zoom={zoom} />

        {/* Nodes */}
        {nodes.map(node => (
          <Node
            key={node.id} node={node} nodeTypes={nodeTypes}
            selected={selected === node.id} connecting={connecting}
            pan={pan} zoom={zoom}
            onSelect={() => onSelect(node.id)}
            onUpdate={(patch) => onUpdateNode(node.id, patch)}
            onStartConnect={() => onStartConnect(node.id)}
            onFinishConnect={() => onFinishConnect(node.id)}
          />
        ))}
      </div>

      {/* Zoom indicator */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        background: '#ffffff10', border: '1px solid #ffffff20',
        borderRadius: 8, padding: '6px 12px', color: '#ffffff70',
        fontSize: 13, fontFamily: 'monospace', backdropFilter: 'blur(4px)',
      }}>
        {Math.round(zoom * 100)}% &nbsp;|&nbsp; scroll to zoom &nbsp;|&nbsp; drag to pan &nbsp;|&nbsp; dbl-click to add
      </div>
    </div>
  )
}