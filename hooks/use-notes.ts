"use client"

import { useState, useEffect, useCallback } from "react"
import type { Note } from "@/lib/types"

const NOTES_KEY = "lifri-notes"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    const storedNotes = localStorage.getItem(NOTES_KEY)

    if (storedNotes) {
      const parsed = JSON.parse(storedNotes)
      setNotes(parsed.map((n: Note) => ({ ...n, createdAt: new Date(n.createdAt) })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  }, [notes, mounted])

  const addNote = useCallback((note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }, [])

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const getQuotes = useCallback(() => {
    return notes.filter((n) => n.isQuote)
  }, [notes])

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getQuotes,
    mounted,
  }
}
