import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { promotions, targetFiscalYear } = body;
        // promotions: { studentId: string, grade: number, class: string, attendanceNumber: number }[]

        if (!promotions || !Array.isArray(promotions)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Bulk create enrollments
        // Using transaction to ensure all or nothing
        await prisma.$transaction(
            promotions.map((p: any) =>
                prisma.enrollment.create({
                    data: {
                        studentId: p.studentId,
                        fiscalYear: targetFiscalYear,
                        grade: p.grade,
                        class: p.class,
                        attendanceNumber: p.attendanceNumber,
                        status: 'ACTIVE'
                    }
                })
            )
        );

        return NextResponse.json({ success: true, count: promotions.length });
    } catch (error) {
        console.error('Promotion error:', error);
        return NextResponse.json({ error: 'Failed to process promotions' }, { status: 500 });
    }
}
