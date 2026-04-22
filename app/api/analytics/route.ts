import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/core/services/AnalyticsService';

export async function GET() {
  const analytics = new AnalyticsService();
  return NextResponse.json({
    stats: analytics.getGlobalStats(),
    weeklyActivity: analytics.getWeeklyActivity()
  });
}
