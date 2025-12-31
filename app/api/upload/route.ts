import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase/config';

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${fileExtension}`;
    const filePath = `${type}/${filename}`;

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
    
    // Upload file to storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

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
