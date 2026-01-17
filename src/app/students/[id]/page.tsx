import { prisma } from '@/lib/prisma';
import StudentDetailClient from './student-detail-client';
import { notFound } from 'next/navigation';

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let student: any = null;

    try {
        student = await prisma.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    orderBy: { fiscalYear: 'desc' },
                },
                dataHistory: {
                    orderBy: { effectiveDate: 'desc' },
                },
                statusHistory: {
                    orderBy: { startDate: 'desc' },
                }
            }
        });
    } catch (error) {
        console.warn('DB Fetch failed. Using mock.');
        // Mock Data for Demo
        if (id === '2') {
            student = {
                id: '2',
                sNumber: '2025002',
                legalName: 'Suzuki Hanako',
                aliasName: 'Hana',
                useAliasFlag: true,
                birthday: '2009-04-01',
                gender: 'female',
                enrollments: [{ fiscalYear: 2025, grade: 1, class: 'B', attendanceNumber: 15 }],
                statusHistory: [{ status: 'ACTIVE' }],
                dataHistory: [
                    { id: 'h1', fieldName: 'aliasName', oldValue: 'None', newValue: 'Hana', effectiveDate: '2025-04-10', reason: 'Requested by parent' },
                    { id: 'h2', fieldName: 'address', oldValue: 'Tokyo', newValue: 'Saitama', effectiveDate: '2025-03-20', reason: 'Moved' }
                ]
            };
        } else {
            student = {
                id,
                sNumber: '2025001',
                legalName: 'Yamada Taro',
                aliasName: null,
                useAliasFlag: false,
                birthday: '2009-05-15',
                gender: 'male',
                enrollments: [{ fiscalYear: 2025, grade: 1, class: 'A', attendanceNumber: 5 }],
                statusHistory: [{ status: 'ACTIVE' }],
                dataHistory: []
            }
        }
    }

    if (!student) {
        // try mock fallback again if id match fails in try block but logic allows
        if (id !== 'error') {
            // Just return mock for any ID for MVP demo
            student = {
                id,
                sNumber: '2025001',
                legalName: 'Yamada Taro (Mock)',
                aliasName: null,
                useAliasFlag: false,
                birthday: '2009-05-15',
                gender: 'male',
                enrollments: [{ fiscalYear: 2025, grade: 1, class: 'A', attendanceNumber: 5 }],
                statusHistory: [{ status: 'ACTIVE' }],
                dataHistory: []
            }
        } else {
            return notFound();
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span>Students</span>
                <span>/</span>
                <span className="font-medium text-slate-800">{student.legalName}</span>
            </div>

            <StudentDetailClient student={student} />
        </div>
    );
}
