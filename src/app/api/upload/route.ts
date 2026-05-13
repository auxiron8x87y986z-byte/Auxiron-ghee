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
    const ext = file.name.split('.').pop()?.toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    
    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    try {
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create upload directory:", err);
    }

    const filePath = path.join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);
    
    // Create a symlink in the root for Nginx compatibility (Linux only)
    if (process.platform !== "win32") {
      try {
        const { symlink, lstat } = await import("fs/promises");
        const rootUploads = path.join(process.cwd(), "uploads");
        try {
          await lstat(rootUploads);
        } catch (e) {
          // Only create if it doesn't exist
          await symlink("public/uploads", rootUploads, "dir");
        }
      } catch (err) {
        // Silently fail if symlink creation is not possible
      }
    }
    
    const fileUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during file upload" }, { status: 500 });
  }
}
