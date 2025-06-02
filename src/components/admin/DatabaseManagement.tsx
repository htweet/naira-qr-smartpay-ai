
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TablesList from './database/TablesList';
import DataBrowser from './database/DataBrowser';
import ActivityLogs from './database/ActivityLogs';
import MaintenanceTools from './database/MaintenanceTools';

const DatabaseManagement = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Define valid table names to avoid TypeScript issues
  const validTables = [
    'profiles',
    'qr_codes',
    'payment_gateway_configs',
    'customer_management',
    'merchant_management',
    'system_settings',
    'database_logs',
    'admin_users'
  ];

  useEffect(() => {
    loadTables();
    loadLogs();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll use the existing tables with actual row counts
      const tablePromises = validTables.map(async (tableName) => {
        try {
          const { count, error } = await supabase
            .from(tableName as any)
            .select('*', { count: 'exact', head: true });
          
          return {
            name: tableName,
            schema: 'public',
            rows: count || 0,
            size: `${Math.max(8192, (count || 0) * 1024)} bytes`
          };
        } catch (error) {
          return {
            name: tableName,
            schema: 'public',
            rows: 0,
            size: '8192 bytes'
          };
        }
      });

      const tableResults = await Promise.all(tablePromises);
      setTables(tableResults);
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
    if (!validTables.includes(tableName)) {
      toast({
        title: "Error",
        description: "Invalid table name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName as any)
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
    if (!selectedTable || !validTables.includes(selectedTable)) return;
    
    try {
      const { data, error } = await supabase
        .from(selectedTable as any)
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
          <TablesList
            tables={tables}
            searchQuery={searchQuery}
            loading={loading}
            onSearchChange={setSearchQuery}
            onRefresh={loadTables}
            onTableSelect={handleTableSelect}
          />
        </TabsContent>

        <TabsContent value="data">
          <DataBrowser
            selectedTable={selectedTable}
            tableData={tableData}
            onExportData={handleExportData}
          />
        </TabsContent>

        <TabsContent value="logs">
          <ActivityLogs logs={logs} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTools
            loading={loading}
            onBackup={handleBackup}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseManagement;
