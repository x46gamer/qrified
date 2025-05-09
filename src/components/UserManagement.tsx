
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  display_name: string;
  role: 'admin' | 'employee';
  created_at: string;
}

interface UserInvite {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  permissions: Record<string, boolean>;
  invited_by: string;
  created_at: string;
  accepted: boolean;
}

interface UserPermissions {
  canGenerateQR: boolean;
  canManageQR: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canCustomizeTemplates: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<UserInvite[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee'>('employee');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState<UserPermissions>({
    canGenerateQR: true,
    canManageQR: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canCustomizeTemplates: false,
  });
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchInvites();
    }
  }, [user]);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setUsers(data as UserProfile[]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('accepted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setInvites(data as UserInvite[]);
      }
    } catch (error: any) {
      console.error('Error fetching invites:', error.message);
    }
  };
  
  const sendInvite = async () => {
    try {
      if (!email) {
        toast.error('Please enter an email address');
        return;
      }
      
      setIsLoading(true);
      
      // Generate a unique token for the invite
      const token = uuidv4();
      
      const { error } = await supabase
        .from('user_invites')
        .insert([
          {
            email,
            token,
            role: selectedRole,
            permissions: permissions,
            invited_by: user?.id
          }
        ]);
      
      if (error) throw error;
      
      // In a real app, send an email with the invite link
      const inviteLink = `${window.location.origin}/signup?email=${encodeURIComponent(email)}&token=${token}`;
      
      toast.success('Invitation sent successfully');
      console.log('Invite link (would be sent via email):', inviteLink);
      
      setEmail('');
      setSelectedRole('employee');
      setIsDialogOpen(false);
      await fetchInvites();
    } catch (error: any) {
      console.error('Error sending invite:', error.message);
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, newRole: 'admin' | 'employee') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success('User role updated successfully');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      toast.error('Failed to update user role');
    }
  };
  
  const deleteInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);
      
      if (error) throw error;
      
      toast.success('Invitation deleted');
      await fetchInvites();
    } catch (error: any) {
      console.error('Error deleting invite:', error.message);
      toast.error('Failed to delete invitation');
    }
  };
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  const handlePermissionChange = (key: keyof UserPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage team members and their permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Team Members</h3>
          <Button onClick={handleOpenDialog}>Invite User</Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.display_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Employee'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {user.role === 'admin' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(user.id, 'employee')}
                          >
                            Make Employee
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateUserRole(user.id, 'admin')}
                          >
                            Make Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Pending Invitations</h3>
              {invites.length === 0 ? (
                <p className="text-sm text-gray-500">No pending invitations</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.map((invite) => (
                        <TableRow key={invite.id}>
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invite.role === 'admin' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {invite.role === 'admin' ? 'Admin' : 'Employee'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(invite.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => deleteInvite(invite.id)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Invite User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  placeholder="colleague@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="role-employee" 
                      name="role" 
                      checked={selectedRole === 'employee'}
                      onChange={() => setSelectedRole('employee')}
                    />
                    <Label htmlFor="role-employee">Employee</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="role-admin" 
                      name="role" 
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                    />
                    <Label htmlFor="role-admin">Admin</Label>
                  </div>
                </div>
              </div>
              
              {selectedRole === 'employee' && (
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="can-generate-qr" className="cursor-pointer">Generate QR Codes</Label>
                      <Switch 
                        id="can-generate-qr"
                        checked={permissions.canGenerateQR}
                        onCheckedChange={() => handlePermissionChange('canGenerateQR')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="can-manage-qr" className="cursor-pointer">Manage QR Codes</Label>
                      <Switch 
                        id="can-manage-qr"
                        checked={permissions.canManageQR}
                        onCheckedChange={() => handlePermissionChange('canManageQR')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="can-view-analytics" className="cursor-pointer">View Analytics</Label>
                      <Switch 
                        id="can-view-analytics"
                        checked={permissions.canViewAnalytics}
                        onCheckedChange={() => handlePermissionChange('canViewAnalytics')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="can-customize-templates" className="cursor-pointer">Customize Templates</Label>
                      <Switch 
                        id="can-customize-templates"
                        checked={permissions.canCustomizeTemplates}
                        onCheckedChange={() => handlePermissionChange('canCustomizeTemplates')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="can-manage-users" className="cursor-pointer">Manage Users</Label>
                      <Switch 
                        id="can-manage-users"
                        checked={permissions.canManageUsers}
                        onCheckedChange={() => handlePermissionChange('canManageUsers')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={sendInvite} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
