'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, History, ArrowRight, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

type StudentDetailProps = {
    student: any; // Using any for MVP speed, ideally proper type
};

export default function StudentDetailClient({ student }: StudentDetailProps) {
    const [publicMode, setPublicMode] = useState(false);

    // Logic to determine display name
    const displayName = publicMode
        ? student.legalName
        : (student.useAliasFlag && student.aliasName ? student.aliasName : student.legalName);

    const displayLabel = publicMode
        ? '(Legal Name)'
        : (student.useAliasFlag && student.aliasName ? '(Alias Name)' : '(Legal Name)');

    const currentEnrollment = student.enrollments?.[0] || {};

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Column: Profile */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-t-4 border-t-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {displayName}
                                <span className="text-sm font-normal text-slate-500">{displayLabel}</span>
                            </CardTitle>
                            <CardDescription className="mt-2 text-base flex items-center gap-2">
                                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{student.sNumber}</span>
                                <Badge variant={student.statusHistory?.[0]?.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                    {student.statusHistory?.[0]?.status || 'UNKNOWN'}
                                </Badge>
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Switch id="mode-toggle" checked={publicMode} onCheckedChange={setPublicMode} />
                            <Label htmlFor="mode-toggle" className="cursor-pointer text-sm font-medium text-slate-600">
                                Public Mode (Legal Name)
                            </Label>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-slate-500 text-xs uppercase tracking-wide">Grade / Class</Label>
                                <div className="text-lg font-medium">{currentEnrollment.grade ? `Grade ${currentEnrollment.grade}` : 'N/A'} - {currentEnrollment.class}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-slate-500 text-xs uppercase tracking-wide">Attendance No.</Label>
                                <div className="text-lg font-medium">{currentEnrollment.attendanceNumber || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-slate-500 text-xs uppercase tracking-wide">Birthday</Label>
                                <div className="text-lg font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    {student.birthday ? format(new Date(student.birthday), 'yyyy-MM-dd') : '-'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-slate-500 text-xs uppercase tracking-wide">Gender</Label>
                                <div className="text-lg font-medium capitalize">{student.gender}</div>
                            </div>
                        </div>

                        <Separator />

                        {/* Note: Edit functionality would go here (Dialog) */}
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex gap-3 text-blue-700 text-sm">
                            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Modify Information</p>
                                <p>Any changes to Name or Address must be recorded with an Effective Date. Use the "Edit" action to create a history record.</p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto bg-white hover:bg-blue-50 text-blue-700 border-blue-200">
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Timeline */}
            <div className="lg:col-span-1 h-full">
                <Card className="h-full flex flex-col shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <History className="w-5 h-5 text-slate-500" />
                            Data Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-full max-h-[600px] p-4">
                            <div className="relative border-l border-slate-200 ml-2 space-y-6 pl-6 py-2">
                                {student.dataHistory && student.dataHistory.length > 0 ? (
                                    student.dataHistory.map((history: any) => (
                                        <div key={history.id} className="relative">
                                            {/* Dot */}
                                            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-blue-300 ring-4 ring-white" />

                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-semibold text-blue-600">
                                                    {format(new Date(history.effectiveDate), 'MMM d, yyyy')}
                                                </span>
                                                <span className="text-sm font-medium text-slate-800">
                                                    {history.fieldName} Changed
                                                </span>
                                                <div className="mt-1 text-sm bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="line-through text-slate-400 text-xs">{history.oldValue}</span>
                                                        <ArrowRight className="w-3 h-3 text-slate-400" />
                                                        <span className="font-medium text-slate-900">{history.newValue}</span>
                                                    </div>
                                                    {history.reason && (
                                                        <p className="mt-1 text-xs italic text-slate-400">"{history.reason}"</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-slate-400 py-8">
                                        No history records found.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
