import { prisma } from '@/lib/prisma';
import PromotionClient from './promotion-client';

async function getStudentsForPromotion() {
    try {
        const students = await prisma.student.findMany({
            where: {
                statusHistory: {
                    some: {
                        status: 'ACTIVE',
                        endDate: null
                    }
                }
            },
            include: {
                enrollments: {
                    orderBy: { fiscalYear: 'desc' },
                    take: 1
                }
            },
            orderBy: { sNumber: 'asc' }
        });

        return students.map(s => ({
            id: s.id,
            sNumber: s.sNumber,
            legalName: s.legalName,
            currentGrade: s.enrollments[0]?.grade || 1,
            currentClass: s.enrollments[0]?.class || '?',
            currentNo: s.enrollments[0]?.attendanceNumber || 0
        }));

    } catch (error) {
        // Fallback Mock
        return [
            { id: '1', sNumber: '2025001', legalName: 'Yamada Taro', currentGrade: 1, currentClass: 'A', currentNo: 1 },
            { id: '2', sNumber: '2025002', legalName: 'Suzuki Hanako', currentGrade: 1, currentClass: 'B', currentNo: 15 },
            { id: '3', sNumber: '2025003', legalName: 'Tanaka Ken', currentGrade: 2, currentClass: 'A', currentNo: 5 },
            { id: '4', sNumber: '2025004', legalName: 'Sato Yumi', currentGrade: 2, currentClass: 'C', currentNo: 20 },
        ];
    }
}

export default async function PromotionPage() {
    const students = await getStudentsForPromotion();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span>Administration</span>
                <span>/</span>
                <span className="font-medium text-slate-800">Year-End Processing</span>
            </div>
            <PromotionClient students={students} />
        </div>
    );
}
