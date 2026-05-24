import { useRef, useState, useCallback } from 'react'

export default function Node({ node, nodeTypes, selected, connecting, pan, zoom, onSelect, onUpdate, onStartConnect, onFinishConnect }) {
  const meta = nodeTypes[node.type] || nodeTypes.default
  const dragStart = useRef(null)
  const [editing, setEditing] = useState(null) // 'title' | 'body'

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    if (connecting) { onFinishConnect(); e.stopPropagation(); return }
    e.stopPropagation()
    onSelect()
    dragStart.current = {
      mx: e.clientX, my: e.clientY,
      nx: node.x, ny: node.y,
    }
    const onMove = (ev) => {
      if (!dragStart.current) return
      const dx = (ev.clientX - dragStart.current.mx) / zoom
      const dy = (ev.clientY - dragStart.current.my) / zoom
      onUpdate({ x: dragStart.current.nx + dx, y: dragStart.current.ny + dy })
    }
    const onUp = () => {
      dragStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [node, zoom, connecting, onSelect, onUpdate, onFinishConnect])

  const isDecision = node.type === 'decision'

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: node.x, top: node.y,
        width: node.width, height: node.height,
        transform: isDecision ? 'rotate(0deg)' : undefined,
        cursor: connecting ? 'crosshair' : 'grab',
        zIndex: selected ? 10 : 1,
      }}
    >
      {/* Card */}
      <div style={{
        width: '100%', height: '100%',
        background: selected ? `${meta.color}22` : '#1e1e2e',
        border: `2px solid ${selected ? meta.color : '#ffffff18'}`,
        borderRadius: node.type === 'note' ? 4 : 12,
        borderLeft: `4px solid ${meta.color}`,
        boxShadow: selected ? `0 0 0 2px ${meta.color}55, 0 8px 32px #00000060` : '0 4px 16px #00000040',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '8px 12px', transition: 'border-color 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ color: meta.color, fontSize: 14 }}>{meta.icon}</span>
          {editing === 'title' ? (
            <input
              autoFocus
              defaultValue={node.title}
              onBlur={e => { onUpdate({ title: e.target.value }); setEditing(null) }}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              }}
            />
          ) : (
            <span
              onDoubleClick={e => { e.stopPropagation(); setEditing('title') }}
              style={{ flex: 1, color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >{node.title}</span>
          )}
        </div>
        {/* Body */}
        {editing === 'body' ? (
          <textarea
            autoFocus
            defaultValue={node.body}
            rows={2}
            onBlur={e => { onUpdate({ body: e.target.value }); setEditing(null) }}
            style={{
              background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              color: '#ffffffaa', fontSize: 11, fontFamily: 'inherit', width: '100%',
            }}
          />
        ) : (
          <div
            onDoubleClick={e => { e.stopPropagation(); setEditing('body') }}
            style={{ color: '#ffffff66', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >{node.body}</div>
        )}
      </div>

      {/* Connect handle (right side) */}
      <div
        onMouseDown={e => { e.stopPropagation(); onStartConnect() }}
        title="Drag to connect"
        style={{
          position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: meta.color, border: '2px solid #0f0f13',
          cursor: 'crosshair', zIndex: 20,
          boxShadow: `0 0 8px ${meta.color}88`,
          transition: 'transform 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.3)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
      />
      {/* Receive handle (left side) */}
      <div
        onMouseDown={e => { e.stopPropagation(); if (connecting) onFinishConnect() }}
        style={{
          position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: '#1e1e2e', border: `2px solid ${meta.color}`,
          cursor: connecting ? 'crosshair' : 'default', zIndex: 20,
        }}
      />
    </div>
  )
}