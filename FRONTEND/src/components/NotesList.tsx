import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import "./NotesList.css";

interface Note {
  _id: string;
  title: string;
  note: string;
  userId: string;
  createdAt: string;
}

const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();

    // Listen for notes refresh event
    const handleNotesRefresh = () => {
      fetchNotes();
    };

    const handleLogout = () => {
      setNotes([]);
      setError("Please login to view your notes");
      setLoading(false);
    };

    window.addEventListener("notesRefresh", handleNotesRefresh);
    window.addEventListener("userLogout", handleLogout);

    return () => {
      window.removeEventListener("notesRefresh", handleNotesRefresh);
      window.removeEventListener("userLogout", handleLogout);
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id;

      if (!userId) {
        setNotes([]);
        setError("Please login to view your notes");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/notes/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch notes");
        setLoading(false);
        return;
      }

      setNotes(data.notes || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/${noteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError("Failed to delete note");
        return;
      }

      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error(err);
      setError("Something went wrong while deleting note");
    }
  };

  const handleEditNote = async (noteId: string, title: string, content: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            note: content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      // Update the note in the local state
      setNotes(notes.map((note) =>
        note._id === noteId
          ? { ...note, title, note: content }
          : note
      ));
    } catch (err) {
      console.error(err);
      throw new Error("Failed to update note");
    }
  };

  if (loading) {
    return (
      <div className="notes-list-container">
        <div className="loading">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="notes-list-container">
      {error && <div className="error-message">{error}</div>}

      {notes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📝</p>
          <p className="empty-text">No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          <div className="notes-header">
            <h2>Your Notes ({notes.length})</h2>
          </div>
          <div className="notes-card-grid">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
