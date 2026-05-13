import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate size (2MB limit)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 2MB limit" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e6);
    // Use a clean prefix to avoid issues with special characters in original filenames
    const uniqueName = `upload-${timestamp}-${random}.${ext}`;
    
    // Save to public/images/uploads (using /images/ path which is confirmed working)
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    
    // Ensure directory exists with correct permissions
    try {
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true, mode: 0o755 });
    } catch (err) {
      console.error("Failed to create upload directory:", err);
    }

    const filePath = path.join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);
    
    const fileUrl = `/images/uploads/${uniqueName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during file upload" }, { status: 500 });
  }
}
