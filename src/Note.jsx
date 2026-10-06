import { useRef } from 'react';
import Draggable from 'react-draggable';

export default function Note({ 
  note, 
  updateNotePosition, 
  deleteNote, 
  changeColor,
  updateNoteText, 
  bringToFront 
}) {
  const nodeRef = useRef(null);
  const colorOptions = ['#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8']; 

 const handleDrag = (e, data) => {
    updateNotePosition(note.id, data.x, data.y);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: note.x, y: note.y }} // Swapped from defaultPosition to strictly controlled position
      onDrag={handleDrag} // Swapped from onStop to onDrag
      onStart={() => bringToFront(note.id)}
      bounds="parent"
      cancel=".no-drag" 
    >
      <div
        ref={nodeRef}
        onMouseDown={() => bringToFront(note.id)}
        style={{
          minWidth: '200px', // NEW: Swapped from fixed width to allow resizing
          minHeight: '150px',
          display: 'flex', // NEW: Flexbox keeps the textarea scaling with the note
          flexDirection: 'column',
          resize: 'both', // NEW: Adds the native drag-to-resize handle
          overflow: 'hidden', // NEW: Required for CSS resize to work
          backgroundColor: note.color,
          padding: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          cursor: 'grab',
          position: 'absolute',
          zIndex: note.zIndex || 1
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {colorOptions.map((color) => (
              <button
                key={color}
                className="no-drag" 
                onClick={() => changeColor(note.id, color)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: note.color === color ? '2px solid #333' : '1px solid #ccc',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
          
          <button
            className="no-drag" 
            onClick={() => deleteNote(note.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#555'
            }}
          >
            ✕
          </button>
        </div>

        <textarea
          className="no-drag" 
          value={note.text}
          onChange={(e) => updateNoteText(note.id, e.target.value)}
          placeholder="Type something..."
          style={{
            width: '100%',
            flexGrow: 1, // NEW: Tells the textarea to stretch to fill the resized space
            border: 'none',
            background: 'transparent',
            resize: 'none', // Disables resizing just the textarea (we resize the whole note now)
            outline: 'none',
            fontFamily: 'inherit',
            color: '#333'
          }}
        />

        {/* NEW: Display the Author's Name */}
        <div style={{
          textAlign: 'right',
          fontSize: '11px',
          color: 'rgba(0,0,0,0.5)',
          marginTop: '8px',
          fontStyle: 'italic',
          cursor: 'default' // Prevents text cursor when hovering the name
        }}>
          ~ {note.author || 'Guest'}
        </div>
      </div>
    </Draggable>
  );
}