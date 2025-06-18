/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Grid2X2, List } from 'lucide-react';

interface Tambon {
  id: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Amphure {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tambon: Tambon[];
}

interface Province {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  amphure: Amphure[];
}

export function SearchInterface() {
  const [data, setData] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedAmphure, setSelectedAmphure] = useState<string>('all');
  const [selectedTambon, setSelectedTambon] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
        const result = await response.json();
        setData(result);
        console.log('Loaded provinces:', result.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResults = useMemo(() => {
    if (!data.length) return [];

    // eslint-disable-next-line prefer-const
    let results: any[] = [];

    data.forEach(province => {
      // Check if province matches filters
      const provinceMatches = selectedProvince === 'all' || selectedProvince === province.id.toString();
      const provinceSearchMatches = searchTerm === '' || 
        province.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
        province.name_en.toLowerCase().includes(searchTerm.toLowerCase());

      // Process amphures
      province.amphure.forEach(amphure => {
        const amphureMatches = selectedAmphure === 'all' || selectedAmphure === amphure.id.toString();
        const amphureSearchMatches = searchTerm === '' ||
          amphure.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
          amphure.name_en.toLowerCase().includes(searchTerm.toLowerCase());

        // Process tambons
        amphure.tambon.forEach(tambon => {
          const tambonMatches = selectedTambon === 'all' || selectedTambon === tambon.id.toString();
          const tambonSearchMatches = searchTerm === '' ||
            tambon.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tambon.name_en.toLowerCase().includes(searchTerm.toLowerCase());

          // Add tambon if it matches search OR filter criteria
          if (tambonMatches && tambonSearchMatches && provinceMatches && amphureMatches) {
            results.push({
              type: 'tambon',
              id: tambon.id,
              name_th: tambon.name_th,
              name_en: tambon.name_en,
              parent: `${amphure.name_th}, ${province.name_th}`
            });
          }
        });

        // Add amphure if it matches search OR filter criteria (and no specific tambon is selected)
        if (selectedTambon === 'all' && amphureMatches && amphureSearchMatches && provinceMatches) {
          results.push({
            type: 'amphure',
            id: amphure.id,
            name_th: amphure.name_th,
            name_en: amphure.name_en,
            parent: province.name_th
          });
        }
      });

      // Add province if it matches search OR filter criteria (and no specific amphure/tambon is selected)
      if (selectedAmphure === 'all' && selectedTambon === 'all' && provinceMatches && provinceSearchMatches) {
        results.push({
          type: 'province',
          id: province.id,
          name_th: province.name_th,
          name_en: province.name_en,
          parent: null
        });
      }
    });

    return results.slice(0, 100); // Limit results for performance
  }, [data, searchTerm, selectedProvince, selectedAmphure, selectedTambon]);

  const availableAmphures = useMemo(() => {
    if (selectedProvince === 'all' || !data.length) return [];
    const province = data.find(p => p.id.toString() === selectedProvince);
    return province ? province.amphure : [];
  }, [data, selectedProvince]);

  const availableTambons = useMemo(() => {
    if (selectedAmphure === 'all' || !data.length) return [];
    const province = data.find(p => p.id.toString() === selectedProvince);
    if (!province) return [];
    const amphure = province.amphure.find(a => a.id.toString() === selectedAmphure);
    return amphure ? amphure.tambon : [];
  }, [data, selectedProvince, selectedAmphure]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('all');
    setSelectedAmphure('all');
    setSelectedTambon('all');
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {filteredResults.map((result, index) => (
        <div
          key={`${result.type}-${result.id}`}
          className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-fade-in bg-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">
              {result.name_th}
            </h3>
            <Badge
              variant={
                result.type === 'province'
                  ? 'default'
                  : result.type === 'amphure'
                  ? 'secondary'
                  : 'outline'
              }
              className="text-xs"
            >
              {result.type === 'province'
                ? 'จังหวัด'
                : result.type === 'amphure'
                ? 'อำเภอ'
                : 'ตำบล'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {result.name_en}
          </p>
          {result.parent && (
            <p className="text-xs text-muted-foreground">
              {result.parent}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อภาษาไทย</TableHead>
            <TableHead>ชื่อภาษาอังกฤษ</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>สังกัด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResults.map((result) => (
            <TableRow key={`${result.type}-${result.id}`}>
              <TableCell className="font-medium">{result.name_th}</TableCell>
              <TableCell>{result.name_en}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    result.type === 'province'
                      ? 'default'
                      : result.type === 'amphure'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {result.type === 'province'
                    ? 'จังหวัด'
                    : result.type === 'amphure'
                    ? 'อำเภอ'
                    : 'ตำบล'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {result.parent || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ค้นหาจังหวัด อำเภอ ตำบล
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">
                ค้นหาทั่วไป
              </Label>
              <Input
                id="search"
                placeholder="ค้นหาชื่อ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium">
                จังหวัด
              </Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {data.map((province) => (
                    <SelectItem key={province.id} value={province.id.toString()}>
                      {province.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amphure" className="text-sm font-medium">
                อำเภอ
              </Label>
              <Select 
                value={selectedAmphure} 
                onValueChange={(value) => {
                  setSelectedAmphure(value);
                  setSelectedTambon('all'); // Reset tambon when amphure changes
                }}
                disabled={selectedProvince === 'all'}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกอำเภอ" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {availableAmphures.map((amphure) => (
                    <SelectItem key={amphure.id} value={amphure.id.toString()}>
                      {amphure.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tambon" className="text-sm font-medium">
                ตำบล
              </Label>
              <Select 
                value={selectedTambon} 
                onValueChange={setSelectedTambon}
                disabled={selectedAmphure === 'all'}
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกตำบล" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {availableTambons.map((tambon) => (
                    <SelectItem key={tambon.id} value={tambon.id.toString()}>
                      {tambon.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="secondary"
                className="w-full"
              >
                เคลียร์ตัวกรอง
              </Button>
            </div>

            <div className="flex items-end">
              <div className="flex rounded-md border border-input overflow-hidden w-full">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="flex-1 rounded-none"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex-1 rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>ผลการค้นหา</span>
            <Badge variant="secondary" className="animate-fade-in">
              {filteredResults.length} รายการ
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบข้อมูลที่ตรงกับการค้นหา
            </div>
          ) : (
            viewMode === 'card' ? renderCardView() : renderTableView()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
