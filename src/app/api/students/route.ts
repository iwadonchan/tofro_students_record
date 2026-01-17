import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        // Determine fiscal year, defaulting to current year (e.g. 2025 starting April)
        // For simplicity, just using a fixed year or query param
        const fiscalYear = 2025;

        const where: any = {};
        if (query) {
            where.OR = [
                { legalName: { contains: query } },
                { aliasName: { contains: query } },
                { sNumber: { contains: query } },
            ];
        }

        const students = await prisma.student.findMany({
            where,
            include: {
                enrollments: {
                    where: { fiscalYear },
                    take: 1
                },
                statusHistory: {
                    where: { endDate: null },
                    take: 1
                }
            },
            orderBy: { sNumber: 'asc' }
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation omitted for brevity

        const student = await prisma.student.create({
            data: {
                sNumber: body.sNumber,
                legalName: body.legalName,
                aliasName: body.aliasName,
                useAliasFlag: body.useAliasFlag || false,
                birthday: new Date(body.birthday),
                gender: body.gender,
                enrollments: {
                    create: {
                        fiscalYear: 2025, // Default for now
                        grade: body.grade,
                        class: body.class,
                        attendanceNumber: body.attendanceNumber,
                        status: 'ACTIVE'
                    }
                },
                statusHistory: {
                    create: {
                        status: 'ACTIVE',
                        startDate: new Date(),
                    }
                }
            }
        });

        return NextResponse.json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
