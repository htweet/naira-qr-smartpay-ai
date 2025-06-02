
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface DataBrowserProps {
  selectedTable: string;
  tableData: any[];
  onExportData: () => void;
}

const DataBrowser = ({ selectedTable, tableData, onExportData }: DataBrowserProps) => {
  return (
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
            <Button onClick={onExportData}>
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
  );
};

export default DataBrowser;
