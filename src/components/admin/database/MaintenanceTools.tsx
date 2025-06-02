
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MaintenanceToolsProps {
  loading: boolean;
  onBackup: () => void;
}

const MaintenanceTools = ({ loading, onBackup }: MaintenanceToolsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Backup & Restore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onBackup} disabled={loading} className="w-full">
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
  );
};

export default MaintenanceTools;
