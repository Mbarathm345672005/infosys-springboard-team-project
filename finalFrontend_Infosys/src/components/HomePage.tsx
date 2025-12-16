import { useState } from 'react';
import { Download, TrendingUp, Tag, FileText, Calendar, User, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import NoteMateNavbar from './NoteMateNavbar';
import type { User as UserType, Note, Request } from '../App';

type HomePageProps = {
  user: UserType;
  notes: Note[];
  requests: Request[];
  onNavigate: (page: 'home' | 'upload' | 'my-notes' | 'requests' | 'profile' | 'note-details') => void;
  onLogout: () => void;
  onNoteClick: (noteId: string) => void;
};

export default function HomePage({ user, notes, requests, onNavigate, onLogout, onNoteClick }: HomePageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique subjects and semesters
  const subjects = ['all', ...Array.from(new Set(notes.map(n => n.subject)))];
  const semesters = ['all', ...Array.from(new Set(notes.map(n => n.semester)))];

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (selectedSubject !== 'all' && note.subject !== selectedSubject) return false;
    if (selectedSemester !== 'all' && note.semester !== selectedSemester) return false;
    return true;
  });

  // Trending notes (most downloaded)
  const trendingNotes = [...notes].sort((a, b) => b.downloads - a.downloads).slice(0, 5);

  // Popular tags
  const allTags = notes.flatMap(n => n.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NoteMateNavbar
        user={user}
        currentPage="home"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h1 className="text-2xl mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p className="text-blue-100">Discover and share notes with your fellow students</p>
            </div>

            {/* Quick Filters */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subject Filter */}
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Subject</label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Button
                          key={subject}
                          variant={selectedSubject === subject ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSubject(subject)}
                          className={selectedSubject === subject ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          {subject === 'all' ? 'All Subjects' : subject}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Semester Filter */}
                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Semester</label>
                    <div className="flex flex-wrap gap-2">
                      {semesters.map((semester) => (
                        <Button
                          key={semester}
                          variant={selectedSemester === semester ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSemester(semester)}
                          className={selectedSemester === semester ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          {semester === 'all' ? 'All Semesters' : semester}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Feed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-slate-900">
                  Notes Feed <span className="text-slate-500">({filteredNotes.length})</span>
                </h2>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                  <TabsList>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => onNoteClick(note.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                              {note.title}
                            </CardTitle>
                            <CardDescription className="mt-1">{note.subject}</CardDescription>
                          </div>
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="text-blue-600" size={20} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User size={14} />
                            <span>{note.uploadedBy.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {note.downloads}
                            </span>
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onNoteClick(note.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-slate-900 hover:text-blue-600 transition-colors">
                                {note.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                <span>{note.subject}</span>
                                <span>•</span>
                                <span>{note.uploadedBy.name}</span>
                                <span>•</span>
                                <span>{note.downloads} downloads</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Share2 size={16} />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                            >
                              <Download size={16} className="mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Trending Notes */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={18} className="text-yellow-500" />
                  Trending Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => onNoteClick(note.id)}
                  >
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-yellow-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 line-clamp-2">{note.title}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {note.downloads} downloads
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag size={18} className="text-blue-500" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Requests */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => onNavigate('requests')}
                  >
                    <div className="text-sm text-slate-900 line-clamp-2">{request.title}</div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar size={12} />
                      <span>{request.createdDate}</span>
                      <Badge
                        variant={request.status === 'Fulfilled' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => onNavigate('requests')}
                >
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
