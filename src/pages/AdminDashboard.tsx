
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface UserWithLimits {
  id: string;
  email?: string;
  qr_limit: number;
  qr_created: number;
  qr_successful: number;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalQRCodes: number;
  totalSuccessfulScans: number;
  averageUsage: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserWithLimits[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalQRCodes: 0,
    totalSuccessfulScans: 0,
    averageUsage: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<number>(100);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // We need to join users with limits
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, role');
        
      if (profilesError) throw profilesError;
      
      // Get users from auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;
      
      // Get user limits
      const { data: limits, error: limitsError } = await supabase
        .from('user_limits')
        .select('*');
        
      if (limitsError) throw limitsError;
      
      // Combine the data
      const combinedUsers = authUsers.map(user => {
        const userLimits = limits?.find(limit => limit.id === user.id) || {
          qr_limit: 100,
          qr_created: 0,
          qr_successful: 0
        };
        
        return {
          id: user.id,
          email: user.email,
          ...userLimits,
          created_at: user.created_at
        };
      });
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total users
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;
      
      // Get QR code stats
      const { data: limits, error: limitsError } = await supabase
        .from('user_limits')
        .select('qr_created, qr_successful');
        
      if (limitsError) throw limitsError;
      
      const totalQRCodes = limits?.reduce((sum, user) => sum + (user.qr_created || 0), 0) || 0;
      const totalSuccessfulScans = limits?.reduce((sum, user) => sum + (user.qr_successful || 0), 0) || 0;
      const averageUsage = users.length > 0 ? totalQRCodes / users.length : 0;
      
      setStats({
        totalUsers: users.length,
        totalQRCodes,
        totalSuccessfulScans,
        averageUsage
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateUserLimit = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_limits')
        .update({ qr_limit: newLimit })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success("User limit updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user limit:", error);
      toast.error("Failed to update user limit");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQRCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSuccessfulScans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. QR Codes per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageUsage.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user limits</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>QR Limit</TableHead>
                    <TableHead>QR Created</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {editingUser === user.id ? (
                          <Input 
                            type="number" 
                            value={newLimit} 
                            onChange={(e) => setNewLimit(parseInt(e.target.value))} 
                            className="w-20"
                          />
                        ) : (
                          user.qr_limit
                        )}
                      </TableCell>
                      <TableCell>{user.qr_created}</TableCell>
                      <TableCell>{user.qr_limit - user.qr_created}</TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(user.qr_created / user.qr_limit) * 100} 
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground w-12">
                            {Math.round((user.qr_created / user.qr_limit) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingUser === user.id ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => updateUserLimit(user.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingUser(user.id);
                              setNewLimit(user.qr_limit);
                            }}
                          >
                            Edit Limit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
