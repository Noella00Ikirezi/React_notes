

import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import Note from './components/Note/Note';
import debounce from 'lodash.debounce';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:4000/notes')
      .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch notes.'))
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const debouncedSave = useCallback(debounce((note) => {
    updateNote(note);
  }, 2000), []);

 
  useEffect(() => {
    if (activeNote?.id) { 
      debouncedSave(activeNote);
    }
  }, [activeNote, debouncedSave]);

  const onAddNote = async () => {
    setLoading(true);
    const newNote = {
      title: 'New Note',
      content: '',
      dateOfLastUpdate: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:4000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error('Failed to add note.');
      }

      const note = await response.json();
      setNotes([note, ...notes]);
      setActiveNote(note); 
    } catch (error) {
      console.error('Error:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const updateNote = useCallback(async (noteToUpdate) => {
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

    if (!response.ok) {
      
      throw new Error('Failed to update note.');
    }

    const updatedNote = await response.json();

    
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );

    
    setActiveNote(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    setError(error.toString());
  } finally {
    setLoading(false);
  }
}, []);


  const onDeleteNote = useCallback(async (idToDelete) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/notes/${idToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note.');
      }

      setNotes(notes.filter(note => note.id !== idToDelete));
      if (activeNote?.id === idToDelete) {
        setActiveNote(null); 
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }, [activeNote, notes]);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!filtered.find(note => note.id === activeNote?.id)) {
      setActiveNote(null); 
    }
  }, [notes, searchTerm, activeNote?.id]);

  const onSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load notes. Please try again." />;

 return (
    <div className="app">
  <aside className="app-sidebar">
    <header className="app-sidebar-header">
      <h1>Notes</h1>
      <button className="add-note-btn" onClick={onAddNote}>+ Add Note</button>
      <div className="search-bar">
        <input type="text" value={searchTerm} onChange={onSearch} placeholder="Search notes" />
        {searchTerm && <button className="clear-search-btn" onClick={clearSearch}>X</button>}
      </div>
    </header>
    <div className="app-sidebar-notes">
      {notes.map(note => (
        <div
          key={note.id}
          className={`note-preview ${note.id === activeNote?.id ? 'active' : ''}`}
          onClick={() => setActiveNote(note)}
        >
          <strong>{note.title || "Untitled Note"}</strong>
          <span>{new Date(note.dateOfLastUpdate).toLocaleDateString()} {new Date(note.dateOfLastUpdate).toLocaleTimeString()}</span>
          <button className="delete-note-btn" onClick={(e) => {
            e.stopPropagation();
            onDeleteNote(note.id);
          }}>Delete</button>
          <p>{note.content && note.content.substr(0, 100) + '...'}</p>
        </div>
      ))}
    </div>
  </aside>
  <main className="note-display">
    {activeNote ? (
      <Note activeNote={activeNote} updateNote={updateNote} onDeleteNote={onDeleteNote} />
    ) : (
      <div className="no-active-note">No note selected</div>
    )}
  </main>
</div>

  );
};

export default App;
