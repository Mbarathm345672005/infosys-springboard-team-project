import { useState } from 'react';
import { Plus, Calendar, User, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import NoteMateNavbar from './NoteMateNavbar';
import type { User as UserType, Request } from '../App';
import { toast } from 'sonner@2.0.3';

type RequestsPageProps = {
  user: UserType;
  requests: Request[];
  onNavigate: (page: 'home' | 'upload' | 'my-notes' | 'requests' | 'profile') => void;
  onLogout: () => void;
  onAddRequest: (request: Omit<Request, 'id' | 'requestedBy' | 'status' | 'createdDate'>) => void;
};

export default function RequestsPage({ user, requests, onNavigate, onLogout, onAddRequest }: RequestsPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');

  const myRequests = requests.filter(r => r.requestedBy.id === user.id);
  const communityRequests = requests.filter(r => r.requestedBy.id !== user.id && r.status === 'Pending');

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Engineering',
    'Economics',
    'Business',
    'Literature',
    'History',
  ];

  const semesters = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !semester || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    onAddRequest({
      title,
      subject,
      semester,
      description,
    });

    toast.success('Request posted successfully!');
    setIsDialogOpen(false);
    setTitle('');
    setSubject('');
    setSemester('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NoteMateNavbar
        user={user}
        currentPage="requests"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-slate-900 mb-2">Requests</h1>
            <p className="text-slate-600">Request or fulfill note requests from the community</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus size={18} className="mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create a Request</DialogTitle>
                <DialogDescription>
                  Request notes from the community
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="request-title">Title</Label>
                  <Input
                    id="request-title"
                    placeholder="What notes do you need?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="request-subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="request-subject">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-semester">Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger id="request-semester">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem}>
                            {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request-description">Description</Label>
                  <Textarea
                    id="request-description"
                    placeholder="Provide details about what you're looking for..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Post Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="community" className="space-y-6">
          <TabsList>
            <TabsTrigger value="community">
              Community Requests ({communityRequests.length})
            </TabsTrigger>
            <TabsTrigger value="my-requests">
              My Requests ({myRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="space-y-4">
            {communityRequests.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-16 text-center">
                  <p className="text-slate-600">No community requests at the moment</p>
                </CardContent>
              </Card>
            ) : (
              communityRequests.map((request) => (
                <Card key={request.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {request.subject} • {request.semester}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{request.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {request.requestedBy.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {request.createdDate}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => onNavigate('upload')}
                      >
                        <Upload size={16} className="mr-2" />
                        Fulfill Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            {myRequests.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-16 text-center">
                  <p className="text-slate-600 mb-4">You haven't made any requests yet</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Create Your First Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myRequests.map((request) => (
                <Card key={request.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {request.subject} • {request.semester}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={request.status === 'Fulfilled' ? 'default' : 'secondary'}
                        className={request.status === 'Fulfilled' ? 'bg-green-500' : ''}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{request.description}</p>
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {request.createdDate}
                      </span>
                      {request.status === 'Fulfilled' && request.fulfilledBy && (
                        <span className="text-green-600">
                          Fulfilled by {request.fulfilledBy.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
