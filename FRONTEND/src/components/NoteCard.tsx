import { useState } from "react";
// import "./NoteCard.css";

interface Note {
  _id: string;
  title: string;
  note: string;
  userId: string;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string) => void;
  onEdit: (noteId: string, title: string, content: string) => void;
}

const NoteCard = ({ note, onDelete, onEdit }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.note);
  const [editError, setEditError] = useState("");

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note._id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.note);
    setEditError("");
  };

  const handleSave = async () => {
    if (editTitle.trim() === "") {
      setEditError("Title is required!");
      return;
    }

    if (editContent.trim() === "") {
      setEditError("Content is required!");
      return;
    }

    try {
      await onEdit(note._id, editTitle.trim(), editContent.trim());
      setIsEditing(false);
      setEditError("");
    } catch (error) {
      setEditError("Failed to update note");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.note);
    setEditError("");
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title-input"
            placeholder="Note title"
          />
        ) : (
          <h3 className="note-title">{note.title}</h3>
        )}

        <div className="note-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave} title="Save changes">
                ✓
              </button>
              <button className="cancel-edit-btn" onClick={handleCancel} title="Cancel editing">
                ✕
              </button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEdit} title="Edit note">
                ✏️
              </button>
              <button className="delete-btn" onClick={handleDelete} title="Delete note">
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {editError && <p className="edit-error">{editError}</p>}

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="edit-content-input"
          placeholder="Note content"
        />
      ) : (
        <p className="note-content">{note.note}</p>
      )}

      <div className="note-footer">
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
