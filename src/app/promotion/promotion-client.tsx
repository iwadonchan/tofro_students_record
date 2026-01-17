'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Save, RefreshCw } from 'lucide-react';

type StudentBase = {
    id: string;
    sNumber: string;
    legalName: string;
    currentGrade: number;
    currentClass: string;
    currentNo: number;
};

type PromotionEntry = StudentBase & {
    nextGrade: number;
    nextClass: string;
    nextNo: number;
    isRetained: boolean;
};

export default function PromotionClient({ students }: { students: StudentBase[] }) {
    const [entries, setEntries] = useState<PromotionEntry[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize draft data
    useEffect(() => {
        const drafts = students.map(s => ({
            ...s,
            nextGrade: s.currentGrade + 1,
            nextClass: s.currentClass,
            nextNo: s.currentNo,
            isRetained: false
        }));
        setEntries(drafts);
    }, [students]);

    const handleRetainChange = (index: number, checked: boolean) => {
        setEntries(prev => {
            const next = [...prev];
            if (checked) {
                next[index].isRetained = true;
                next[index].nextGrade = next[index].currentGrade;
            } else {
                next[index].isRetained = false;
                next[index].nextGrade = next[index].currentGrade + 1;
            }
            return next;
        });
    };

    const handleInputChange = (index: number, field: keyof PromotionEntry, value: any) => {
        setEntries(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // In a real app, send to API
        try {
            console.log('Submitting promotions', entries);
            // Simulate API call
            await new Promise(r => setTimeout(r, 1000));
            alert('Promotion data saved successfully!');
        } catch (e) {
            alert('Error saving data');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>Bulk Promotion</CardTitle>
                        <CardDescription>Review and edit students' placement for the next academic year.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Confirm & Promote
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-200 overflow-hidden">
                        {/* Note: Using standard HTML input for speed in dense tables often feels snappier than heavy components */}
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[80px]">S-No</TableHead>
                                    <TableHead className="w-[180px]">Name</TableHead>
                                    <TableHead className="w-[100px] text-center border-l">Cur. Gr</TableHead>
                                    <TableHead className="w-[80px] text-center">Class</TableHead>
                                    <TableHead className="w-[60px] text-center">No.</TableHead>

                                    <TableHead className="w-[60px] px-2 bg-blue-50/50 border-l border-blue-100 text-blue-700">Retain</TableHead>
                                    <TableHead className="w-[100px] bg-blue-50/50 text-blue-700">Next Gr</TableHead>
                                    <TableHead className="w-[100px] bg-blue-50/50 text-blue-700">Class</TableHead>
                                    <TableHead className="w-[100px] bg-blue-50/50 text-blue-700">No.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map((entry, idx) => (
                                    <TableRow key={entry.id} className="hover:bg-slate-50">
                                        <TableCell className="font-mono text-xs">{entry.sNumber}</TableCell>
                                        <TableCell className="font-medium text-sm">{entry.legalName}</TableCell>

                                        <TableCell className="text-center text-slate-500 border-l bg-slate-50/30">{entry.currentGrade}</TableCell>
                                        <TableCell className="text-center text-slate-500 bg-slate-50/30">{entry.currentClass}</TableCell>
                                        <TableCell className="text-center text-slate-500 bg-slate-50/30">{entry.currentNo}</TableCell>

                                        <TableCell className="text-center border-l border-blue-50 bg-blue-50/10">
                                            <Checkbox
                                                checked={entry.isRetained}
                                                onCheckedChange={(c) => handleRetainChange(idx, c as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell className="bg-blue-50/10">
                                            <Input
                                                className="h-8 w-16 text-center"
                                                value={entry.nextGrade}
                                                onChange={(e) => handleInputChange(idx, 'nextGrade', parseInt(e.target.value) || 0)}
                                            />
                                        </TableCell>
                                        <TableCell className="bg-blue-50/10">
                                            <Input
                                                className="h-8 w-16 text-center"
                                                value={entry.nextClass}
                                                onChange={(e) => handleInputChange(idx, 'nextClass', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="bg-blue-50/10">
                                            <Input
                                                className="h-8 w-16 text-center"
                                                value={entry.nextNo}
                                                onChange={(e) => handleInputChange(idx, 'nextNo', parseInt(e.target.value) || 0)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
