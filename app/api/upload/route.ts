import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('photo') as unknown as File;
    const type: string | null = data.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'Upload type is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', type);
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Failed to create uploads directory:', mkdirError);
      throw new Error(`Failed to create upload directory: ${mkdirError instanceof Error ? mkdirError.message : 'Unknown error'}`);
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    try {
      await writeFile(filepath, buffer);
    } catch (writeError) {
      console.error('Failed to write file:', writeError);
      throw new Error(`Failed to write file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }

    // Return public URL
    const publicUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
