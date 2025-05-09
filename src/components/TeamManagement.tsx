
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Mail, Check, X, UserX, UserCog } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from 'uuid';

interface UserProfile {
  id: string;
  display_name: string;
  role: 'admin' | 'employee';
  created_at: string;
  updated_at: string;
}

interface UserInvite {
  id: string;
  email: string;
  token: string;
  role: 'admin' | 'employee';
  permissions: {
    generate: boolean;
    manage: boolean;
    analytics: boolean;
  };
  invited_by: string;
  created_at: string;
  expires_at: string;
  accepted: boolean;
}

const TeamManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<UserInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState<'admin' | 'employee'>('employee');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'employee'>('employee');
  const [editingPermissions, setEditingPermissions] = useState<{
    generate: boolean;
    manage: boolean;
    analytics: boolean;
  }>({
    generate: true,
    manage: false,
    analytics: false
  });

  // Load team data on component mount
  useEffect(() => {
    if (user) {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    try {
      setIsLoading(true);
      
      // Load user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        throw profilesError;
      }
      
      setUsers(profilesData || []);
      
      // Load pending invites
      const { data: invitesData, error: invitesError } = await supabase
        .from('user_invites')
        .select('*')
        .eq('accepted', false)
        .order('created_at', { ascending: false });
      
      if (invitesError) {
        throw invitesError;
      }
      
      setInvites(invitesData || []);
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    try {
      setIsSendingInvite(true);
      
      // Generate invite token
      const token = uuidv4();
      
      // Set default permissions based on role
      const permissions = {
        generate: true,
        manage: newInviteRole === 'admin',
        analytics: newInviteRole === 'admin'
      };
      
      const { error } = await supabase
        .from('user_invites')
        .insert({
          email: newInviteEmail.trim(),
          token,
          role: newInviteRole,
          permissions,
          invited_by: user!.id
        });
      
      if (error) {
        if (error.code === '23505') {
          toast.error('This email has already been invited');
        } else {
          throw error;
        }
        return;
      }
      
      toast.success(`Invite sent to ${newInviteEmail}`);
      setNewInviteEmail('');
      await loadTeamData();
      
      // In a real-world scenario, you would send an email to the invited user
      // with a link containing the token
      
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invite');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const deleteInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) {
        throw error;
      }
      
      setInvites(invites.filter(invite => invite.id !== inviteId));
      toast.success('Invite deleted');
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast.error('Failed to delete invite');
    }
  };

  const updateUserRole = async () => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          role: editingUserRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('User role updated');
      setEditingUser(null);
      await loadTeamData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const resendInvite = async (inviteId: string) => {
    try {
      // In a real app, this would send a new email to the user
      // For now, we'll just update the expiration date
      const { error } = await supabase
        .from('user_invites')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', inviteId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Invite resent');
      await loadTeamData();
    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error('Failed to resend invite');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their access levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {users.map((userProfile) => (
                  <div key={userProfile.id} className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium">{userProfile.display_name || 'Unnamed User'}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {userProfile.id === user?.id ? 'You' : ''}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          userProfile.role === 'admin' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {userProfile.role === 'admin' ? 'Admin' : 'Employee'}
                        </span>
                      </div>
                    </div>
                    {userProfile.id !== user?.id && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingUser(userProfile);
                              setEditingUserRole(userProfile.role);
                            }}
                          >
                            <UserCog className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update role and permissions for {userProfile.display_name || 'this user'}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Select 
                                value={editingUserRole} 
                                onValueChange={(value) => setEditingUserRole(value as 'admin' | 'employee')}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="employee">Employee</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-3">
                              <Label>Permissions</Label>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Generate QR codes</p>
                                    <p className="text-xs text-muted-foreground">
                                      Allows user to create new QR codes
                                    </p>
                                  </div>
                                  <Switch 
                                    checked={editingPermissions.generate}
                                    onCheckedChange={(checked) => 
                                      setEditingPermissions(prev => ({...prev, generate: checked}))
                                    }
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Manage QR codes</p>
                                    <p className="text-xs text-muted-foreground">
                                      Allows user to edit and delete existing QR codes
                                    </p>
                                  </div>
                                  <Switch 
                                    checked={editingUserRole === 'admin' ? true : editingPermissions.manage}
                                    onCheckedChange={(checked) => 
                                      setEditingPermissions(prev => ({...prev, manage: checked}))
                                    }
                                    disabled={editingUserRole === 'admin'}
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-sm font-medium">Access analytics</p>
                                    <p className="text-xs text-muted-foreground">
                                      Allows user to view analytics and reports
                                    </p>
                                  </div>
                                  <Switch 
                                    checked={editingUserRole === 'admin' ? true : editingPermissions.analytics}
                                    onCheckedChange={(checked) => 
                                      setEditingPermissions(prev => ({...prev, analytics: checked}))
                                    }
                                    disabled={editingUserRole === 'admin'}
                                  />
                                </div>
                              </div>
                              
                              {editingUserRole === 'admin' && (
                                <p className="text-xs text-amber-600">
                                  * Admins automatically have all permissions
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={updateUserRole}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Pending Invitations</h3>
                
                {invites.length > 0 ? (
                  <div className="space-y-3">
                    {invites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{invite.email}</p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              invite.role === 'admin' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {invite.role === 'admin' ? 'Admin' : 'Employee'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Invited {new Date(invite.created_at).toLocaleDateString()} • 
                            Expires {new Date(invite.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resendInvite(invite.id)}
                          >
                            <Mail className="mr-1 h-3 w-3" />
                            Resend
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => deleteInvite(invite.id)}
                          >
                            <UserX className="mr-1 h-3 w-3" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No pending invitations</p>
                )}
              </div>
              
              <form onSubmit={sendInvite} className="pt-4 border-t">
                <h3 className="font-medium mb-4">Invite New Team Member</h3>
                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input 
                      id="invite-email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={newInviteEmail}
                      onChange={(e) => setNewInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select 
                      value={newInviteRole} 
                      onValueChange={(value) => setNewInviteRole(value as 'admin' | 'employee')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-4 flex items-end">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSendingInvite}
                    >
                      {isSendingInvite ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invite
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
