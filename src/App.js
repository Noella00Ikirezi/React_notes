import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import Note from "./components/Note";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    const response = await fetch("http://localhost:4000/notes");
    const data = await response.json();

    setNotes(data);
    setIsLoading(false);
  };

  const createNote = async () => {
    const response = await fetch("http://localhost:4000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle note",
        content: "",
        lastUpdatedAt: new Date(),
      }),
    });
    const newNote = await response.json();
    setNotes([newNote, ...notes]);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to handle selecting a note
  const selectNote = (note) => {
    setSelectedNote(note);
  };

  return (
    <>
      <aside className="Side">
        <div className="Create-note-wrapper">
          <Button onClick={createNote}>+ Create new note</Button>
        </div>
        {isLoading ? (
          "Chargement…"
        ) : (
          notes?.map((note) => (
            <button
              className="Note-button"
              key={note.id}
              onClick={() => selectNote(note)} // Set the selected note when clicked
            >
              {note.title}
            </button>
          ))
        )}
      </aside>
      <main className="Main">
        {selectedNote && (
          <Note
            note={selectedNote}
            setNote={setSelectedNote}
            isSaved={true} 
            setIsSaved={() => {}} 
            hasChanged={false} 
            setHasChanged={() => {}} 
            savingInProgress={false}
            updateNote={() => {}} 
          />
        )}
      </main>
    </>
  );
}

export default App;
