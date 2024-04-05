import React, { useEffect, useState } from 'react';
import './Note.css';

const Note = ({ activeNote, updateNote }) => {
  const [note, setNote] = useState({ title: '', content: '' });

  useEffect(() => {
    setNote(activeNote || { title: '', content: '', id: null });
  }, [activeNote]);

  // Called when the save button is clicked
  const onSaveNote = () => {
    if(note.id) {
      // Update the last updated date and save the note
      updateNote({ ...note, dateOfLastUpdate: new Date().toISOString() });
    }
  };

  // Update the note's title or content as the user types
  const onEditField = (key, value) => {
    setNote({ ...note, [key]: value });
  };

  if (!note) return <div className="no-active-note">No Note Selected</div>;

  return (
    <div className="note">
      <div className="note-header">
        <input
          type="text"
          id="title"
          placeholder="Note Title"
          autoFocus
          value={note.title}
          onChange={(e) => onEditField('title', e.target.value)}
        />
      </div>
      <textarea
        id="content"
        placeholder="Note Content"
        value={note.content}
        onChange={(e) => onEditField('content', e.target.value)}
      />
      <button className="save-note-btn" onClick={onSaveNote}>Save</button>
    </div>
  );
};

export default Note;
