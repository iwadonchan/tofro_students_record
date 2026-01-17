import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    orderBy: { fiscalYear: 'desc' }
                },
                dataHistory: {
                    orderBy: { effectiveDate: 'desc' }
                },
                statusHistory: {
                    orderBy: { startDate: 'desc' }
                }
            }
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { fieldName, newValue, oldValue, effectiveDate, reason } = body;

        // Temporal Data Logic
        // In a real app, we check if effectiveDate is now/past to update the main record.
        // For MVP, assuming immediate effect for simplicity unless specified.

        // Transaction: Create history, and optionally update main record
        const result = await prisma.$transaction(async (tx) => {
            const history = await tx.dataHistory.create({
                data: {
                    studentId: id,
                    fieldName,
                    oldValue: String(oldValue),
                    newValue: String(newValue),
                    effectiveDate: new Date(effectiveDate),
                    reason
                }
            });

            // If effective date is passed or today, update the main record
            if (new Date(effectiveDate) <= new Date()) {
                await tx.student.update({
                    where: { id },
                    data: {
                        [fieldName]: newValue
                    }
                });
            }

            return history;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }
}
