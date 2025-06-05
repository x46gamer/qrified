import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Trash2, Edit2, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface Invitation {
  id: string;
  email: string;
  token: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

const TeamManagement = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState('');

  // Fetch team members and invitations
  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch team members (employees) with email from auth.users
      const { data: members, error: membersError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          role,
          created_at,
          user:auth.users (
            email
          )
        `)
        .eq('role', 'employee');

      if (membersError) throw membersError;
      
      // Transform the data to match our interface
      const transformedMembers = members?.map(member => ({
        id: member.id,
        email: member.user?.email || 'No email',
        role: member.role,
        created_at: member.created_at
      })) || [];
      
      setTeamMembers(transformedMembers);

      // Fetch pending invitations
      const { data: invites, error: invitesError } = await supabase
        .from('user_invites')
        .select('*')
        .is('accepted_at', null)
        .gte('expires_at', new Date().toISOString());

      if (invitesError) throw invitesError;
      setInvitations(invites || []);

    } catch (error: any) {
      console.error('Error fetching team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // Copy invitation link to clipboard
  const copyInviteLink = (token: string) => {
    const inviteLink = `${window.location.origin}/employeeportal?token=${token}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => toast.success('Invitation link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  // Send new invitation
  const sendInvitation = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsInviting(true);
      
      // Generate a unique token
      const token = crypto.randomUUID();
      
      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create invitation in database (email will be sent by trigger)
      const { error: dbError } = await supabase
        .from('user_invites')
        .insert({
          email: inviteEmail,
          token,
          expires_at: expiresAt.toISOString(),
          invited_by: user?.id
        });

      if (dbError) throw dbError;

      toast.success('Invitation sent successfully');
      setInviteEmail('');
      fetchTeamData(); // Refresh the list

    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  // Update team member role
  const updateMemberRole = async () => {
    if (!editingMember || !newRole) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', editingMember.id);

      if (error) throw error;

      toast.success('Team member role updated');
      setEditingMember(null);
      fetchTeamData(); // Refresh the list

    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  // Remove team member
  const removeTeamMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Team member removed');
      fetchTeamData(); // Refresh the list

    } catch (error: any) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  // Cancel invitation
  const cancelInvitation = async (inviteId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;

    try {
      const { error } = await supabase
        .from('user_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Invitation cancelled');
      fetchTeamData(); // Refresh the list

    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite New Member Section */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Button 
              onClick={sendInvitation}
              disabled={isInviting}
              className="self-end"
            >
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>{new Date(invite.expires_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invite.token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelInvitation(invite.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {invitations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No pending invitations
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMember(member);
                              setNewRole(member.role);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Team Member Role</DialogTitle>
                            <DialogDescription>
                              Change the role for {member.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Select
                              value={newRole}
                              onValueChange={setNewRole}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button onClick={updateMemberRole}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {teamMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No team members yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement; 