
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface LogEntry {
  id: string;
  created_at: string;
  action_type: string;
  table_name?: string;
  admin_user_id?: string;
  changes?: any;
}

interface ActivityLogsProps {
  logs: LogEntry[];
}

const ActivityLogs = ({ logs }: ActivityLogsProps) => {
  return (
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
  );
};

export default ActivityLogs;
