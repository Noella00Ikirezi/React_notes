import React, { useEffect, useState} from 'react';
import './App.css';
import Note from './components/Note/Note';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:4000/notes');
        if (!response.ok) throw new Error('Failed to fetch notes.');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

 
  const updateNote = async (noteToUpdate) => {
    setLoading(true);
    const updatedData = { ...noteToUpdate, dateOfLastUpdate: new Date().toISOString() };

    try {
      const response = await fetch(`http://localhost:4000/notes/${noteToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update note.');
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => note.id === updatedNote.id ? updatedNote : note)
      );
      setActiveNote(updatedNote);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

const togglePin = async (id) => {
  const noteToPin = notes.find((note) => note.id === id);
  const updatedNote = { ...noteToPin, isPinned: !noteToPin.isPinned };
  
  try {
    const response = await fetch(`http://localhost:4000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });
    if (!response.ok) throw new Error('Could not update the note pin status.');

    let updatedNotes = notes.map((note) => 
      note.id === updatedNote.id ? updatedNote : note
    );
    
    updatedNotes = updatedNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setNotes(updatedNotes);
  } catch (error) {
    setError(error.toString());
  }
};



  const onAddNote = async () => {
    const newNote = {
      title: 'New Note',
      content: '',
      dateOfLastUpdate: new Date().toISOString(),
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Failed to add note.');
      const note = await response.json();
      setNotes([note, ...notes]);
      setActiveNote(note);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const onDeleteNote = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note.');
      setNotes(notes.filter(note => note.id !== id));
      setActiveNote(null); 
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const isActiveNoteFilteredOut = !notes.some(note => 
      note.id === activeNote?.id &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       note.content.toLowerCase().includes(searchTerm.toLowerCase())));
    if (isActiveNoteFilteredOut) {
      setActiveNote(null); 
    }
  }, [notes, searchTerm, activeNote?.id]);

  const onSearch = (event) => setSearchTerm(event.target.value);

  const clearSearch = () => setSearchTerm('');

  
  const filteredNotes = searchTerm
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : notes;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load notes. Please try again." />;

  return (
    <div className="app">
  

  <aside className="app-sidebar">
     <h1>Notes</h1>
    <header className="app-sidebar-header">
     
      
      <div className="search-bar">
        <input type="text" value={searchTerm} onChange={onSearch} placeholder="Search notes" />
        {searchTerm && <button className="clear-search-btn" onClick={clearSearch}>X</button>}
      </div>

      <button className="add-note-btn" onClick={onAddNote}>+ Créer une note</button>
    </header>

    

    <div className="app-sidebar-notes">
      {filteredNotes.map((note) => (
        <div key={note.id} 
             className={`note-preview ${note.id === activeNote?.id ? 'active' : ''}`} 
             onClick={() => setActiveNote(note)}>
          <div className="note-details">
            <strong className="note-title">
    {note.title || "Untitled Note"}
    <FontAwesomeIcon 
      icon={faThumbtack} 
      className={`pin-icon ${note.isPinned ? 'pinned' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        togglePin(note.id);
      }}
    />
  </strong>
            <span className="note-date">
              {new Date(note.dateOfLastUpdate).toLocaleDateString()} 
              {new Date(note.dateOfLastUpdate).toLocaleTimeString()}
            </span>
            <p className="note-content">{note.content && note.content.substr(0, 30) + '...'}</p>
          </div>
          <button className="delete-note-btn" 
                  onClick={(e) => {e.stopPropagation(); onDeleteNote(note.id);}}>
            Delete
          </button>
        </div>
      ))}
    </div>
  </aside>

  <main className="note-display">
    {activeNote ? (
      <Note activeNote={activeNote} updateNote={updateNote} />
    ) : (
      <div className="no-active-note">Select a note or create a new one.</div>
    )}
  </main>
</div>

  );
};

export default App;