import { useState } from 'react';
import { FileText, Download, MessageSquare, Settings, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import NoteMateNavbar from './NoteMateNavbar';
import type { User, Note, Request } from '../App';
import { toast } from 'sonner@2.0.3';

type ProfilePageProps = {
  user: User;
  uploadedNotes: Note[];
  requests: Request[];
  onNavigate: (page: 'home' | 'upload' | 'my-notes' | 'requests' | 'profile') => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
};

export default function ProfilePage({ user, uploadedNotes, requests, onNavigate, onLogout, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const totalDownloads = uploadedNotes.reduce((sum, note) => sum + note.downloads, 0);

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name,
      bio,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NoteMateNavbar
        user={user}
        currentPage="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                          onClick={handleSaveProfile}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user.name);
                            setBio(user.bio || '');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl text-slate-900 mb-1">{user.name}</h2>
                      <p className="text-sm text-slate-500 mb-3">{user.email}</p>
                      {user.bio && (
                        <p className="text-sm text-slate-600 mb-4">{user.bio}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FileText size={18} />
                    <span>Notes Uploaded</span>
                  </div>
                  <span className="text-slate-900">{uploadedNotes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Download size={18} />
                    <span>Total Downloads</span>
                  </div>
                  <span className="text-slate-900">{totalDownloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MessageSquare size={18} />
                    <span>Requests Made</span>
                  </div>
                  <span className="text-slate-900">{requests.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="uploads" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="uploads">My Uploads</TabsTrigger>
                <TabsTrigger value="requests">My Requests</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="uploads" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Uploaded Notes</CardTitle>
                    <CardDescription>Notes you've shared with the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {uploadedNotes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p>You haven't uploaded any notes yet</p>
                        <Button
                          variant="link"
                          className="text-blue-600 mt-2"
                          onClick={() => onNavigate('upload')}
                        >
                          Upload your first note
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedNotes.slice(0, 5).map((note) => (
                          <div
                            key={note.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="text-slate-900">{note.title}</div>
                              <div className="text-sm text-slate-500 mt-1">
                                {note.subject} • {note.downloads} downloads
                              </div>
                            </div>
                          </div>
                        ))}
                        {uploadedNotes.length > 5 && (
                          <Button
                            variant="ghost"
                            className="w-full text-blue-600"
                            onClick={() => onNavigate('my-notes')}
                          >
                            View All ({uploadedNotes.length})
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>My Requests</CardTitle>
                    <CardDescription>Notes you've requested from the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p>You haven't made any requests yet</p>
                        <Button
                          variant="link"
                          className="text-blue-600 mt-2"
                          onClick={() => onNavigate('requests')}
                        >
                          Make your first request
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {requests.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="text-slate-900">{request.title}</div>
                              <div className="text-sm text-slate-500 mt-1">
                                {request.subject} • {request.semester}
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                request.status === 'Fulfilled'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-slate-900">Email Notifications</div>
                          <div className="text-sm text-slate-500">Receive updates about your notes and requests</div>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-slate-900">Dark Mode</div>
                          <div className="text-sm text-slate-500">Switch to dark theme</div>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="text-slate-900 mb-4">Change Password</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Once you delete your account, there is no going back.
                      </p>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
