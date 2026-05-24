export default function Toolbar({ nodeTypes, onAddNode, selected, onDelete, connecting }) {
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#1e1e2eee', border: '1px solid #ffffff18',
      borderRadius: 14, padding: '8px 16px',
      backdropFilter: 'blur(12px)', zIndex: 100,
      boxShadow: '0 8px 32px #00000060',
    }}>
      <span style={{ color: '#ffffff50', fontSize: 13, marginRight: 4 }}>Add node:</span>
      {Object.entries(nodeTypes).map(([type, meta]) => (
        <button
          key={type}
          title={`Add ${meta.label} node`}
          onClick={() => onAddNode(type, 200 + Math.random() * 400, 200 + Math.random() * 300)}
          style={{
            background: 'transparent',
            border: `1.5px solid ${meta.color}60`,
            borderRadius: 8, padding: '5px 12px',
            color: meta.color, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${meta.color}20`; e.currentTarget.style.borderColor = meta.color }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${meta.color}60` }}
        >
          <span>{meta.icon}</span> {meta.label}
        </button>
      ))}
      <div style={{ width: 1, height: 24, background: '#ffffff15', margin: '0 4px' }} />
      {connecting && (
        <span style={{ color: '#f97316', fontSize: 13, fontWeight: 600, animation: 'pulse 1s infinite' }}>
          ● Click a node to connect
        </span>
      )}
      {selected && !connecting && (
        <button
          onClick={onDelete}
          style={{
            background: 'transparent', border: '1.5px solid #ef444460',
            borderRadius: 8, padding: '5px 12px',
            color: '#ef4444', fontSize: 13, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ef444420'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ✕ Delete
        </button>
      )}
      {!selected && !connecting && (
        <span style={{ color: '#ffffff30', fontSize: 12 }}>Select a node to delete</span>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}