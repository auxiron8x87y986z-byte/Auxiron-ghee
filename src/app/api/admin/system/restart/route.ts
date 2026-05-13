import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to restart the server
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Initiating PM2 restart for auxiron...');

    // Run the PM2 restart command
    // We use a small delay to allow the response to be sent before the process dies
    exec('pm2 restart auxiron', (error, stdout, stderr) => {
      if (error) {
        console.error(`PM2 Restart Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`PM2 Restart Stderr: ${stderr}`);
        return;
      }
      console.log(`PM2 Restart Success: ${stdout}`);
    });

    return NextResponse.json({ message: 'Restart command sent successfully. The server will be back online in a few seconds.' });
  } catch (error: any) {
    console.error('System Restart API Error:', error);
    return NextResponse.json({ error: 'Failed to initiate restart' }, { status: 500 });
  }
}
