import { prisma } from '@/lib/prisma';
import DashboardClient from './dashboard-client';

// Mock data fallback if DB fails (for demonstration purposes)
const MOCK_STUDENTS = [
  { id: '1', sNumber: '2025001', legalName: 'Yamada Taro', aliasName: null, useAliasFlag: false, status: 'ACTIVE', grade: 1, class: 'A' },
  { id: '2', sNumber: '2025002', legalName: 'Suzuki Hanako', aliasName: 'Hana', useAliasFlag: true, status: 'ACTIVE', grade: 1, class: 'B' },
  { id: '3', sNumber: '2025003', legalName: 'Tanaka Ken', aliasName: null, useAliasFlag: false, status: 'WARNING', grade: 2, class: 'A' },
  { id: '4', sNumber: '2025004', legalName: 'Sato Yumi', aliasName: null, useAliasFlag: false, status: 'LEAVE', grade: 3, class: 'C' },
  { id: '5', sNumber: '2025005', legalName: 'Ito Takashi', aliasName: null, useAliasFlag: false, status: 'ACTIVE', grade: 1, class: 'A' },
];

async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        enrollments: {
          orderBy: { fiscalYear: 'desc' }, // Get latest
          take: 1
        },
        statusHistory: {
          where: { endDate: null },
          take: 1
        }
      },
      orderBy: { sNumber: 'asc' }
    });

    return students.map(s => ({
      id: s.id,
      sNumber: s.sNumber,
      legalName: s.legalName,
      aliasName: s.aliasName,
      useAliasFlag: s.useAliasFlag || false,
      status: s.statusHistory[0]?.status || 'UNKNOWN',
      grade: s.enrollments[0]?.grade || 0,
      class: s.enrollments[0]?.class || '-',
    }));
  } catch (error) {
    console.warn('Database connection failed, using mock data for demo. Ensure DATABASE_URL is correct and migrations are applied.');
    return MOCK_STUDENTS;
  }
}

export default async function DashboardPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>

      <DashboardClient initialStudents={students as any} />
    </div>
  );
}
