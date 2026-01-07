import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // Support both single-file and multi-file uploads
    const multipleFiles = data.getAll('photos') as File[];
    const singleFile: File | null = data.get('photo') as unknown as File;
    const type: string | null = data.get('type') as string;

    const files: File[] =
      multipleFiles && multipleFiles.length > 0
        ? multipleFiles
        : singleFile
        ? [singleFile]
        : [];

    if (!files.length) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'Upload type is required' }, { status: 400 });
    }

    // Validate all files & prepare upload buffers
    const fileBuffers: { file: File; buffer: Buffer; filename: string; filePath: string }[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename & path
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const filename = `${randomUUID()}.${fileExtension}`;
      const filePath = `${type}/${filename}`;

      fileBuffers.push({ file, buffer, filename, filePath });
    }

    // Upload to Supabase Storage using service role client (bypasses RLS)
    // Create client directly with service role key to ensure RLS bypass
    const config = getSupabaseConfig();
    if (!config.serviceRoleKey) {
      throw new Error('Service role key is required for file uploads');
    }
    
    const supabase = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Check if bucket exists, create if it doesn't
    const bucketName = 'uploads';
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (!listError) {
      const bucketExists = buckets?.some(b => b.name === bucketName);
      if (!bucketExists) {
        // Try to create the bucket (this might fail if we don't have permissions)
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        });
        
        if (createError) {
          console.warn('Could not create bucket (may already exist or need manual creation):', createError.message);
        }
      }
    }
    
    const uploadedUrls: string[] = [];
    const uploadedFilenames: string[] = [];

    // Upload each file to storage bucket
    for (const { file, buffer, filename, filePath } of fileBuffers) {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        console.error('Error details:', JSON.stringify(uploadError, null, 2));
        
        // If RLS error, provide detailed instructions
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          throw new Error(
            `Storage bucket RLS is blocking uploads. To fix this:\n` +
            `1. Go to Supabase Dashboard → Storage\n` +
            `2. Find the '${bucketName}' bucket\n` +
            `3. Click on the bucket → Settings (gear icon)\n` +
            `4. Toggle OFF "Enable RLS" or add a policy:\n` +
            `   CREATE POLICY "Allow all uploads" ON storage.objects FOR ALL USING (bucket_id = '${bucketName}');\n` +
            `Error: ${uploadError.message}`
          );
        }
        
        throw new Error(`Failed to upload to storage: ${uploadError.message}`);
      }

      // Get public URL for each file
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      uploadedUrls.push(publicUrl);
      uploadedFilenames.push(filename);
    }

    // Backwards compatible response:
    // - For single file: keep `url` and `filename`
    // - Also expose `urls` and `filenames` for multi-file callers
    const responseBody: any = {
      success: true,
      urls: uploadedUrls,
      filenames: uploadedFilenames,
    };

    if (uploadedUrls.length === 1) {
      responseBody.url = uploadedUrls[0];
      responseBody.filename = uploadedFilenames[0];
    }

    return NextResponse.json(responseBody);

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
