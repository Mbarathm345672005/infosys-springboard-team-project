import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import NoteMateNavbar from './NoteMateNavbar';
import type { User, Note } from '../App';

type MyNotesPageProps = {
  user: User;
  notes: Note[];
  onNavigate: (page: 'home' | 'upload' | 'my-notes' | 'requests' | 'profile' | 'note-details') => void;
  onLogout: () => void;
  onNoteClick: (noteId: string) => void;
};

export default function MyNotesPage({ user, notes, onNavigate, onLogout, onNoteClick }: MyNotesPageProps) {
  const totalDownloads = notes.reduce((sum, note) => sum + note.downloads, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NoteMateNavbar
        user={user}
        currentPage="my-notes"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl text-slate-900 mb-2">My Notes</h1>
          <p className="text-slate-600">Manage all the notes you've uploaded</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Total Notes</CardTitle>
              <FileText className="text-blue-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">{notes.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Total Downloads</CardTitle>
              <Download className="text-green-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">{totalDownloads}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">Average Downloads</CardTitle>
              <TrendingUp className="text-indigo-500" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-slate-900">
                {notes.length > 0 ? Math.round(totalDownloads / notes.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-16 text-center">
              <FileText className="text-slate-300 mx-auto mb-4" size={64} />
              <h3 className="text-xl text-slate-900 mb-2">No notes yet</h3>
              <p className="text-slate-600 mb-6">Start sharing your knowledge with others!</p>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => onNavigate('upload')}
              >
                Upload Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => onNoteClick(note.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="text-blue-600" size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-slate-900 mb-1 hover:text-blue-600 transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-slate-600 mb-3">{note.subject} • {note.semester}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {note.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {note.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 4}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {note.uploadedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={14} />
                            {note.downloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
