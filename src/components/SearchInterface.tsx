/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Grid2X2, List } from 'lucide-react';

// ==== Types aligned with the NEW API shape ====
// Example API shape (province -> districts -> sub_districts)
// https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json

interface SubDistrict {
  id: number;
  zip_code: number | null;
  name_th: string;
  name_en: string;
  district_id: number;
  lat: number | null;
  long: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface District {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sub_districts: SubDistrict[];
}

interface Province {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  districts: District[];
}

// ==== Component ====
export function SearchInterface() {
  // Remote data states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Current selections
  const [selected, setSelected] = useState<{
    province_id?: number;
    district_id?: number;
    sub_district_id?: number;
    postal_code?: number; // derived from sub_district.zip_code
  }>({});

  // Fetch provinces on mount (sorted by Thai name)
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(
          'https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json',
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Province[] = await res.json();
        data.sort((a, b) => (a.name_th || '').localeCompare(b.name_th || '', 'th-TH'));
        setProvinces(data);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError('โหลดข้อมูลจังหวัดไม่สำเร็จ กรุณาลองใหม่');
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Helpers
  const resetSelectedFields = (fields: (keyof typeof selected)[]) => {
    setSelected((prev) => {
      const next = { ...prev } as any;
      for (const f of fields) next[f] = undefined;
      return next;
    });
  };

  const makeLabel = (item: { name_th?: string; name_en?: string; id?: number }) => {
    const th = item?.name_th || '';
    const en = item?.name_en || '';
    if (th && en) return `${th} — ${en}`;
    return th || en || String(item?.id ?? '');
  };

  // Selection handlers (follow reference logic)
  const handleProvinceChange = (provinceIdStr: string) => {
    const provinceId =
      provinceIdStr && provinceIdStr !== 'all' ? Number(provinceIdStr) : undefined;

    setDistricts([]);
    setSubDistricts([]);
    resetSelectedFields(['province_id', 'district_id', 'sub_district_id', 'postal_code']);

    if (!provinceId) return;

    setSelected((prev) => ({ ...prev, province_id: provinceId }));
    const province = provinces.find((p) => p.id === provinceId);
    const ds = (province?.districts || [])
      .slice()
      .sort((a, b) => (a.name_th || '').localeCompare(b.name_th || '', 'th-TH'));
    setDistricts(ds);
  };

  const handleDistrictChange = (districtIdStr: string) => {
    const districtId =
      districtIdStr && districtIdStr !== 'all' ? Number(districtIdStr) : undefined;

    setSubDistricts([]);
    resetSelectedFields(['district_id', 'sub_district_id', 'postal_code']);

    if (!districtId) return;

    setSelected((prev) => ({ ...prev, district_id: districtId }));
    const district = districts.find((d) => d.id === districtId);
    const sds = (district?.sub_districts || [])
      .slice()
      .sort((a, b) => (a.name_th || '').localeCompare(b.name_th || '', 'th-TH'));
    setSubDistricts(sds);
  };

  const handleSubDistrictChange = (subDistrictIdStr: string) => {
    const subDistrictId =
      subDistrictIdStr && subDistrictIdStr !== 'all' ? Number(subDistrictIdStr) : undefined;

    resetSelectedFields(['sub_district_id', 'postal_code']);

    if (!subDistrictId) return;

    const sd = subDistricts.find((s) => s.id === subDistrictId);
    setSelected((prev) => ({
      ...prev,
      sub_district_id: subDistrictId,
      postal_code: sd?.zip_code ?? undefined,
    }));
  };

  // Disable logic
  const isDistrictDisabled = !selected.province_id || districts.length === 0;
  const isSubDistrictDisabled = !selected.district_id || subDistricts.length === 0;

  // Controlled <Select> values
  const selectedProvinceValue = useMemo(
    () => (selected.province_id ? String(selected.province_id) : ''),
    [selected.province_id]
  );
  const selectedDistrictValue = useMemo(
    () => (selected.district_id ? String(selected.district_id) : ''),
    [selected.district_id]
  );
  const selectedSubDistrictValue = useMemo(
    () => (selected.sub_district_id ? String(selected.sub_district_id) : ''),
    [selected.sub_district_id]
  );

  // Results list supports free-text search across current data graph, strictly respecting selected hierarchy
  const filteredResults = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!provinces.length) return [] as any[];

    const nameMatch = (th?: string, en?: string) => {
      if (!q) return true;
      const t = (th || '').toLowerCase();
      const e = (en || '').toLowerCase();
      return t.includes(q) || e.includes(q);
    };

    const results: any[] = [];

    for (const province of provinces) {
      // Province filter gate
      if (selected.province_id && province.id !== selected.province_id) continue;

      const provMatch = nameMatch(province.name_th, province.name_en);

      for (const district of province.districts) {
        // District filter gate
        if (selected.district_id && district.id !== selected.district_id) continue;

        const distMatch = nameMatch(district.name_th, district.name_en);

        for (const sd of district.sub_districts) {
          // Sub-district filter gate
          if (selected.sub_district_id && sd.id !== selected.sub_district_id) continue;

          const sdMatch = nameMatch(sd.name_th, sd.name_en);
          if (sdMatch) {
            results.push({
              type: 'sub_district',
              id: sd.id,
              name_th: sd.name_th,
              name_en: sd.name_en,
              parent: `${district.name_th}, ${province.name_th}`,
              zip: sd.zip_code ?? '-',
            });
          }
        }

        // Only add district rows when NOT narrowed down to a specific sub-district
        if (!selected.sub_district_id && distMatch) {
          results.push({
            type: 'district',
            id: district.id,
            name_th: district.name_th,
            name_en: district.name_en,
            parent: province.name_th,
          });
        }
      }

      // Only add province rows when NOT narrowed down to district/sub-district
      if (!selected.district_id && !selected.sub_district_id && provMatch) {
        results.push({
          type: 'province',
          id: province.id,
          name_th: province.name_th,
          name_en: province.name_en,
        });
      }
    }

    return results.slice(0, 100);
  }, [provinces, searchTerm, selected.province_id, selected.district_id, selected.sub_district_id]);

  const handleReset = () => {
    setDistricts([]);
    setSubDistricts([]);
    setSelected({});
    setSearchTerm('');
  };

  // === Render helpers (reuse your original card/table views but adapted) ===
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {filteredResults.map((result, index) => (
        <div
          key={`${result.type}-${result.id}`}
          className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/30 animate-fade-in bg-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{result.name_th}</h3>
            <Badge
              variant={
                result.type === 'province' ? 'default' : result.type === 'district' ? 'secondary' : 'outline'
              }
              className="text-xs"
            >
              {result.type === 'province' ? 'จังหวัด' : result.type === 'district' ? 'อำเภอ' : 'ตำบล'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{result.name_en}</p>
          {result.parent && (
            <p className="text-xs text-muted-foreground">{result.parent}</p>
          )}
          {typeof result.zip !== 'undefined' && (
            <p className="text-xs text-muted-foreground">รหัสไปรษณีย์: {result.zip}</p>
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
            <TableHead>รหัสไปรษณีย์</TableHead>
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
                    result.type === 'province' ? 'default' : result.type === 'district' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {result.type === 'province' ? 'จังหวัด' : result.type === 'district' ? 'อำเภอ' : 'ตำบล'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{result.parent || '-'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{typeof result.zip !== 'undefined' ? result.zip : '-'}</TableCell>
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-destructive mb-2">{error}</p>
          <Button onClick={() => location.reload()} variant="secondary">ลองใหม่</Button>
        </div>
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
              <Label htmlFor="search" className="text-sm font-medium">ค้นหาทั่วไป</Label>
              <Input
                id="search"
                placeholder="ค้นหาชื่อ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium">จังหวัด</Label>
              <Select value={selectedProvinceValue} onValueChange={handleProvinceChange}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name_th}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-medium">อำเภอ</Label>
              <Select value={selectedDistrictValue} onValueChange={handleDistrictChange} disabled={isDistrictDisabled}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกอำเภอ" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name_th}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-district */}
            <div className="space-y-2">
              <Label htmlFor="subdistrict" className="text-sm font-medium">ตำบล</Label>
              <Select value={selectedSubDistrictValue} onValueChange={handleSubDistrictChange} disabled={isSubDistrictDisabled}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="เลือกตำบล" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-popover border border-border">
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {subDistricts.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name_th}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <Button onClick={handleReset} variant="secondary" className="w-full">เคลียร์ตัวกรอง</Button>
            </div>

            {/* View toggle */}
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

          {/* Selected snapshot */}
          <div className="text-sm text-muted-foreground">
            {selected.province_id && (
              <span className="mr-4">จังหวัด: {makeLabel(provinces.find((p) => p.id === selected.province_id)!)}</span>
            )}
            {selected.district_id && (
              <span className="mr-4">อำเภอ: {makeLabel(districts.find((d) => d.id === selected.district_id)!)}</span>
            )}
            {selected.sub_district_id && (
              <span className="mr-4">ตำบล: {makeLabel(subDistricts.find((s) => s.id === selected.sub_district_id)!)}</span>
            )}
            {selected.postal_code && <span>รหัสไปรษณีย์: {selected.postal_code}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>ผลการค้นหา</span>
            <Badge variant="secondary" className="animate-fade-in">{filteredResults.length} รายการ</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
          ) : viewMode === 'card' ? (
            renderCardView()
          ) : (
            renderTableView()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
