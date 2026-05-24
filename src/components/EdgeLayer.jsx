import { useMemo } from 'react'

function getCenter(node) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
    rx: node.x + node.width,
    lx: node.x,
  }
}

function bezierPath(fromNode, toNode) {
  const f = getCenter(fromNode)
  const t = getCenter(toNode)
  const fx = f.rx, fy = f.y
  const tx = t.lx, ty = t.y
  const cx = (fx + tx) / 2
  return `M ${fx} ${fy} C ${cx} ${fy}, ${cx} ${ty}, ${tx} ${ty}`
}

export default function EdgeLayer({ nodes, edges, nodeTypes, onDelete }) {
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes])

  const bounds = useMemo(() => {
    if (!nodes.length) return { minX: -2000, minY: -2000, w: 6000, h: 6000 }
    const xs = nodes.flatMap(n => [n.x, n.x + n.width])
    const ys = nodes.flatMap(n => [n.y, n.y + n.height])
    const pad = 500
    const minX = Math.min(...xs) - pad
    const minY = Math.min(...ys) - pad
    const w = Math.max(...xs) - minX + pad
    const h = Math.max(...ys) - minY + pad
    return { minX, minY, w, h }
  }, [nodes])

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
      width={bounds.w} height={bounds.h}
      viewBox={`${bounds.minX} ${bounds.minY} ${bounds.w} ${bounds.h}`}
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ffffff40" />
        </marker>
      </defs>
      {edges.map(edge => {
        const fromNode = nodeMap[edge.from]
        const toNode = nodeMap[edge.to]
        if (!fromNode || !toNode) return null
        const d = bezierPath(fromNode, toNode)
        const meta = nodeTypes[fromNode.type] || nodeTypes.default
        return (
          <g key={edge.id} style={{ pointerEvents: 'auto' }}>
            {/* Hit area */}
            <path d={d} stroke="transparent" strokeWidth={16} fill="none"
              className="edge-hit"
              style={{ cursor: 'pointer' }}
              onDoubleClick={() => onDelete(edge.id)}
            />
            {/* Visible edge */}
            <path d={d}
              stroke={meta.color}
              strokeWidth={2} fill="none" opacity={0.7}
              strokeDasharray="0"
              markerEnd="url(#arrow)"
              style={{ pointerEvents: 'none' }}
            />
          </g>
        )
      })}
    </svg>
  )
}