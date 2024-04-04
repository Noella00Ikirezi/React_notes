import React from 'react';

function Note({
  note,
  setNote,
  isSaved,
  setIsSaved,
  hasChanged,
  setHasChanged,
  savingInProgress,
  updateNote
}) {
  const handleTitleChange = (event) => {
    setNote({ ...note, title: event.target.value });
    setIsSaved(false);
    setHasChanged(true);
  };

  const handleContentChange = (event) => {
    setNote({ ...note, content: event.target.value });
    setIsSaved(false);
    setHasChanged(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateNote();
    setHasChanged(true);
  };

  return (
    <div>
      <form className="Form" onSubmit={handleSubmit}>
        <input
          className="Note-editable Note-title"
          type="text"
          value={note ? note.title : ""}
          onChange={handleTitleChange}
        />
        <textarea
          className="Note-editable Note-content"
          value={note ? note.content : ""}
          onChange={handleContentChange}
        />
        <div className="Note-actions">
          <button className="Button">Enregistrer</button>
          {savingInProgress ? "Enregistrement…" : isSaved && "✓ Enregistré"}
        </div>
      </form>
    </div>
  );
}

export default Note;
