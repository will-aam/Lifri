"use client"

import { useState } from "react"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { useNotes } from "@/hooks/use-notes"
import { ChevronLeftIcon, PlusIcon, TrashIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, mounted } = useNotes()
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [isQuote, setIsQuote] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleSave = () => {
    if (!text.trim()) return
    addNote({ text, author, isQuote })
    setText("")
    setAuthor("")
    setIsQuote(false)
    setIsOpen(false)
  }

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Anotações</h1>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-10 w-10">
                <PlusIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90vw] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Nova Anotação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Escreva sua anotação..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Autor (Opcional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Usar como Citação</p>
                    <p className="text-xs text-muted-foreground">Pode aparecer na tela inicial</p>
                  </div>
                  <Switch checked={isQuote} onCheckedChange={setIsQuote} />
                </div>
                <Button className="w-full" onClick={handleSave} disabled={!text.trim()}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {notes.length === 0 ? (
          <div className="text-center mt-12 text-muted-foreground">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma anotação ainda.</p>
            <p className="text-sm mt-1">Toque no + para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                {note.author && <p className="text-xs text-muted-foreground font-medium">{note.author}</p>}
                
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={note.isQuote}
                      onCheckedChange={(checked) => updateNote(note.id, { isQuote: checked })}
                      className="scale-75 origin-left"
                    />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ChatBubbleBottomCenterTextIcon className="h-3 w-3" />
                      Citação
                    </span>
                  </div>
                  
                  {showDeleteConfirm === note.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => setShowDeleteConfirm(null)}>
                        Cancelar
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs px-2" onClick={() => deleteNote(note.id)}>
                        Excluir
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(note.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-md"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </MobileShell>
  )
}
