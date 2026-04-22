import { NextResponse } from 'next/server';
import { AuditService } from '@/core/services/AuditService';

export async function GET() {
  const audit = AuditService.getInstance();
  return NextResponse.json(audit.getRecentLogs(20));
}
