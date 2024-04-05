import React, { useState, useEffect } from 'react';
import './Note.css';
import debounce from 'lodash.debounce';

const Note = ({ activeNote, updateNote }) => {
  // Local state to manage input changes
  const [note, setNote] = useState(activeNote);

  // Update local state whenever the activeNote changes
  useEffect(() => {
    setNote(activeNote);
  }, [activeNote]);

  // Debounced update function
  const debouncedUpdateNote = debounce(updateNote, 2000);

  const onEditField = (field, value) => {
    const updatedNote = { ...note, [field]: value, dateOfLastUpdate: new Date().toISOString() };
    setNote(updatedNote);
    debouncedUpdateNote(updatedNote);
  };

  // Handle manual save - if you decide to keep a save button
  const onSaveNote = () => {
    updateNote(note);
  };

  if (!note) return <div className="no-active-note">No Note Selected</div>;

  return (
    <div className="note">
      <div className="note-header">
        <input
          type="text"
          id="title"
          value={note.title || ''}
          placeholder="Note Title"
          onChange={(e) => onEditField('title', e.target.value)}
          autoFocus
        />
      </div>
      <textarea
        id="content"
        placeholder="Note Content"
        value={note.content || ''}
        onChange={(e) => onEditField('content', e.target.value)}
      />
      <div className="note-footer">
        {/* Optional Save Button */}
        <button onClick={onSaveNote}>Save</button>
      </div>
    </div>
  );
};

export default Note;
