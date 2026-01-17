'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Users, GraduationCap, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';

type StudentSummary = {
    id: string;
    sNumber: string;
    legalName: string;
    aliasName: string | null;
    useAliasFlag: boolean;
    status: string;
    grade: number;
    class: string;
};

export default function DashboardClient({ initialStudents }: { initialStudents: StudentSummary[] }) {
    const [query, setQuery] = useState('');
    const [students, setStudents] = useState(initialStudents);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut '/' to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter logic (Client-side for MVP speed)
    const filteredStudents = students.filter(s =>
        s.legalName.toLowerCase().includes(query.toLowerCase()) ||
        (s.aliasName && s.aliasName.toLowerCase().includes(query.toLowerCase())) ||
        s.sNumber.includes(query)
    );

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Active Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.filter(s => s.status === 'ACTIVE').length}</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Warning Status</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.filter(s => s.status === 'WARNING').length}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graduation Candidates</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.filter(s => s.grade === 3).length}</div>
                        <p className="text-xs text-muted-foreground">3rd Grade Students</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search & List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">Student Directory</h2>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search students... (/)"
                            className="pl-9 bg-white"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S-No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-slate-50">
                                    <TableCell className="font-mono text-slate-600">{student.sNumber}</TableCell>
                                    <TableCell className="font-medium">
                                        {student.useAliasFlag && student.aliasName ? (
                                            <div className="flex flex-col">
                                                <span>{student.aliasName}</span>
                                                <span className="text-xs text-slate-400">{student.legalName}</span>
                                            </div>
                                        ) : (
                                            student.legalName
                                        )}
                                    </TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'}
                                            className={student.status === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/students/${student.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Details
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
