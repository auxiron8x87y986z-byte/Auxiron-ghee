"use server";

import { exec } from "child_process";
import { promisify } from "util";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const execAsync = promisify(exec);

export async function restartPM2() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    // We run this in the background and don't wait for it to finish because 
    // the process will be killed immediately.
    console.log("PM2 Restart triggered from Admin Panel");
    
    // Use a small delay to allow the response to reach the client if possible
    exec("sleep 1 && pm2 restart auxiron", (error) => {
      if (error) {
        console.error("PM2 restart error:", error);
      }
    });

    return { success: true, message: "Restart command sent. App will be down for a few seconds." };
  } catch (error: any) {
    console.error("Failed to trigger PM2 restart:", error);
    return { success: false, error: error.message || "Failed to restart" };
  }
}
