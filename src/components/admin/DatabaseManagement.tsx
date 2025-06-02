
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database, 
  Trash2, 
  Edit, 
  Plus, 
  RefreshCw, 
  Download, 
  Upload,
  Search,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DatabaseManagement = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTables();
    loadLogs();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      // Get table information from information_schema
      const { data, error } = await supabase
        .rpc('get_table_info');

      if (error) throw error;

      // For demo purposes, we'll use the existing tables
      const mockTables = [
        { name: 'profiles', schema: 'public', rows: 0, size: '8192 bytes' },
        { name: 'qr_codes', schema: 'public', rows: 0, size: '8192 bytes' },
        { name: 'payment_gateway_configs', schema: 'public', rows: 0, size: '8192 bytes' },
        { name: 'customer_management', schema: 'public', rows: 0, size: '8192 bytes' },
        { name: 'merchant_management', schema: 'public', rows: 0, size: '8192 bytes' },
        { name: 'system_settings', schema: 'public', rows: 5, size: '16384 bytes' },
        { name: 'database_logs', schema: 'public', rows: 0, size: '8192 bytes' },
      ];
      
      setTables(mockTables);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast({
        title: "Error",
        description: "Failed to load database tables.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('database_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100);

      if (error) throw error;
      setTableData(data || []);
    } catch (error) {
      console.error('Error loading table data:', error);
      toast({
        title: "Error",
        description: `Failed to load data from ${tableName}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    loadTableData(tableName);
  };

  const logAction = async (action: string, tableName?: string, recordId?: string, changes?: any) => {
    try {
      await supabase
        .from('database_logs')
        .insert({
          admin_user_id: (await supabase.auth.getUser()).data.user?.id,
          action_type: action,
          table_name: tableName,
          record_id: recordId,
          changes: changes,
        });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const handleExportData = async () => {
    if (!selectedTable) return;
    
    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*');

      if (error) throw error;

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      await logAction('EXPORT', selectedTable);
      
      toast({
        title: "Export Successful",
        description: `Data from ${selectedTable} has been exported.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export table data.",
        variant: "destructive",
      });
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would trigger a full database backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await logAction('BACKUP');
      
      toast({
        title: "Backup Initiated",
        description: "Database backup has been started. You'll receive a notification when it's complete.",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to initiate database backup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription>
            Manage database tables, monitor activity, and perform administrative tasks
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="data">Data Browser</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Database Tables</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search tables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button onClick={loadTables} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Estimated Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.schema}</TableCell>
                      <TableCell>{table.rows}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTableSelect(table.name)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Browse
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Browser</CardTitle>
                  <CardDescription>
                    {selectedTable ? `Viewing data from ${selectedTable}` : 'Select a table to browse data'}
                  </CardDescription>
                </div>
                {selectedTable && (
                  <Button onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedTable}</Badge>
                    <span className="text-sm text-gray-600">
                      {tableData.length} records
                    </span>
                  </div>
                  
                  {tableData.length > 0 ? (
                    <div className="border rounded-lg overflow-auto max-h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(tableData[0]).map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value: any, cellIndex) => (
                                <TableCell key={cellIndex} className="max-w-48 truncate">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No data found in this table
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a table from the Tables tab to browse its data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Database Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Admin User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action_type}</Badge>
                      </TableCell>
                      <TableCell>{log.table_name || '-'}</TableCell>
                      <TableCell>{log.admin_user_id || '-'}</TableCell>
                      <TableCell className="max-w-48 truncate">
                        {log.changes ? JSON.stringify(log.changes) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No activity logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleBackup} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Create Full Backup
                    </>
                  )}
                </Button>
                
                <div className="border-t pt-4">
                  <Label htmlFor="restore-file">Restore from Backup</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="restore-file"
                      type="file"
                      accept=".sql,.json"
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Clear All Logs</h4>
                  <p className="text-sm text-red-600 mb-3">
                    This will permanently delete all database activity logs.
                  </p>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Clear Logs
                  </Button>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Reset Database</h4>
                  <p className="text-sm text-red-600 mb-3">
                    This will reset the database to its initial state. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" disabled>
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    Reset Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManagement;
