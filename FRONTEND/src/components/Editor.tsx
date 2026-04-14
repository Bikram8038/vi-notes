import { useState } from "react";
import Header from "./Header";

export default function Edit() {
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setText(e.target.value);
  };

  const handleTitle = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // validation
    if (title.trim() === "") {
      setError("Title is required!");
      setSuccess("");
      return;
    }

    if (text.trim() === "") {
      setError("Note content is required!");
      setSuccess("");
      return;
    }

    setError("");

    // Get userId from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;
    if (!userId) {
      setError("Please login first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/notes/add-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // important for passport session
          body: JSON.stringify({
            title,
            note: text,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save note");
        setSuccess("");
        return;
      }

      console.log(data);

      // success message
      setSuccess("Note saved successfully!");
      setError("");

      //  clear form
      setText("");
      setTitle("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="editor-container">
      <Header />

      <h2 className="heading">Your Notes</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitle}
          placeholder="Enter title"
        />

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Success */}
        {success && (
          <p style={{ color: "green", marginBottom: "10px" }}>
            {success}
          </p>
        )}

        {/* Content */}
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className="editor"
          value={text}
          onChange={handleInput}
          placeholder="Start writing..."
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}