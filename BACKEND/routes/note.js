import express from "express";
import Note from "../models/note.js";

const router = express.Router();

// ✅ create note
router.post("/add-note", async (req, res) => {
  try {
    const { title, note, userId } = req.body;

    if (!title || !note || !userId) {
      return res.status(400).json({
        success: false,
        message: "Title, note, and userId are required",
      });
    }

    const newNote = new Note({
      title,
      note,
      userId,
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note saved successfully",
      note: newNote,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save note",
    });
  }
});

// ✅ get all notes for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
});

// ✅ delete a note
router.delete("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
});

export default router;