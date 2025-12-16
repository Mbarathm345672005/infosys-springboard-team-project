import { Download, Share2, Calendar, TrendingUp, User, ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import NoteMateNavbar from './NoteMateNavbar';
import type { User as UserType, Note } from '../App';
import { toast } from 'sonner@2.0.3';

type NoteDetailsPageProps = {
  user: UserType;
  note: Note;
  onNavigate: (page: 'home' | 'upload' | 'my-notes' | 'requests' | 'profile') => void;
  onLogout: () => void;
};

export default function NoteDetailsPage({ user, note, onNavigate, onLogout }: NoteDetailsPageProps) {
  const handleDownload = () => {
    toast.success('Note downloaded successfully!');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for when clipboard API is blocked
      const url = window.location.href;
      toast.info('Link ready to share: ' + url.substring(0, 50) + '...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NoteMateNavbar
        user={user}
        currentPage=""
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Notes
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Header */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-slate-900 mb-2">{note.title}</CardTitle>
                    <CardDescription className="text-lg">{note.subject} • {note.semester}</CardDescription>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600" size={32} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Preview */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <FileText size={48} className="mx-auto mb-3" />
                    <p>PDF Preview</p>
                    <p className="text-sm">Click download to view the full document</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section (Future Feature) */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
                <CardDescription>Comments and questions about this note</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-500 py-8">
                  <p>Comments feature coming soon!</p>
                  <p className="text-sm mt-2">Students will be able to discuss and ask questions about notes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 h-11"
                  onClick={handleDownload}
                >
                  <Download size={18} className="mr-2" />
                  Download Note
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={handleShare}
                >
                  <Share2 size={18} className="mr-2" />
                  Share Note
                </Button>
              </CardContent>
            </Card>

            {/* Uploader Info */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Uploaded By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                      {note.uploadedBy.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-slate-900">{note.uploadedBy.name}</div>
                    <div className="text-sm text-slate-500">View Profile</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} />
                    <span>Uploaded</span>
                  </div>
                  <span className="text-sm text-slate-900">{note.uploadedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp size={16} />
                    <span>Downloads</span>
                  </div>
                  <span className="text-sm text-slate-900">{note.downloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText size={16} />
                    <span>File Type</span>
                  </div>
                  <span className="text-sm text-slate-900">{note.fileType}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Notes */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Related Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-slate-500 py-4">
                  <p className="text-sm">More notes from {note.subject}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}