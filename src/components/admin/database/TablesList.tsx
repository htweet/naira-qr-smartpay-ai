
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RefreshCw, Edit } from 'lucide-react';

interface TableInfo {
  name: string;
  schema: string;
  rows: number;
  size: string;
}

interface TablesListProps {
  tables: TableInfo[];
  searchQuery: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onTableSelect: (tableName: string) => void;
}

const TablesList = ({ tables, searchQuery, loading, onSearchChange, onRefresh, onTableSelect }: TablesListProps) => {
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={onRefresh} disabled={loading}>
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
                    onClick={() => onTableSelect(table.name)}
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
  );
};

export default TablesList;
