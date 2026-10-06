import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { collection, onSnapshot, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Note from './Note';

function App() {
  const [notes, setNotes] = useState([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [authorName, setAuthorName] = useState('Guest');

  // CONNECT TO FIREBASE: Listen for live updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const notesData = snapshot.docs.map(doc => doc.data());
      setNotes(notesData);
      
      // Keep maxZIndex updated based on all users' notes
      const highestZ = Math.max(0, ...notesData.map(n => n.zIndex || 0));
      setMaxZIndex(highestZ);
    });
    
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const addNote = async () => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    
    const newNote = {
      id: uuidv4(),
      text: '',
      x: Math.floor(Math.random() * 200) + 50,
      y: Math.floor(Math.random() * 200) + 50,
      color: '#fef08a',
      zIndex: newZ,
      author: authorName
    };
    
    // WRITE to Firebase instead of local state
    await setDoc(doc(db, 'notes', newNote.id), newNote);
  };

  const updateNotePosition = async (id, newX, newY) => {
    await updateDoc(doc(db, 'notes', id), { x: newX, y: newY });
  };

  const updateNoteText = async (id, newText) => {
    await updateDoc(doc(db, 'notes', id), { text: newText });
  };

  const bringToFront = async (id) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    await updateDoc(doc(db, 'notes', id), { zIndex: newZ });
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, 'notes', id));
  };

  const changeColor = async (id, newColor) => {
    await updateDoc(doc(db, 'notes', id), { color: newColor });
  };

  const clearBoard = () => {
    if (window.confirm("Are you sure you want to delete all notes for everyone?")) {
      // Delete each note from the database
      notes.forEach(async (note) => {
        await deleteDoc(doc(db, 'notes', note.id));
      });
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ 
        padding: '20px', 
        position: 'absolute', 
        zIndex: 99999,
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <button onClick={addNote} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}>
          + Add Sticky Note
        </button>
        <button onClick={clearBoard} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#ffb3b3', border: '1px solid #ff6666' }}>
          Clear Board
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <label style={{ fontSize: '14px', color: '#555' }}>Name:</label>
          <input 
            type="text" 
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        {notes.map((note) => (
          <Note 
            key={note.id} 
            note={note} 
            updateNotePosition={updateNotePosition}
            updateNoteText={updateNoteText}
            bringToFront={bringToFront}
            deleteNote={deleteNote}
            changeColor={changeColor}
          />
        ))}
      </div>
    </div>
  );
}

export default App;