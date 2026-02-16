import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth';

const DATA_DIR = path.resolve(process.cwd(), 'data/applications');

const applicationSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(18).max(99),
  phone: z.string().regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/),
  email: z.string().email(),
  shopId: z.string().min(1),
  jobType: z.string().min(1),
  selfPR: z.string().max(1000).optional().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError.message },
        { status: 400 },
      );
    }

    const id = randomUUID();
    const application = {
      id,
      ...result.data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await writeFile(filePath, JSON.stringify(application, null, 2), 'utf-8');

    return NextResponse.json({ success: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error('Application POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    await mkdir(DATA_DIR, { recursive: true });

    const { readdir } = await import('node:fs/promises');
    const files = await readdir(DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const applications = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await readFile(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(content);
      }),
    );

    applications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Application GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
