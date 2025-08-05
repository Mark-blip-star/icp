import { createClient } from "@supabase/supabase-js";

export class PhotoRepository {
  private supabase;
  private readonly bucketName = "generated_images";
  private readonly tempPrefix = "temp/";

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  async uploadGeneratedPhoto(userId: string, imageUrl: string): Promise<string> {
    try {
      // Fetch the image data with proper headers
      const response = await fetch(imageUrl, {
        headers: {
          Accept: "image/*",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Get the content type from the response
      const contentType = response.headers.get("content-type") || "image/png";
      const extension = contentType.includes("jpeg") ? "jpg" : "png";

      // Get the binary data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create a unique filename using timestamp
      const timestamp = new Date().getTime();
      const filename = `${timestamp}.${extension}`;
      const filePath = `${this.tempPrefix}${userId}/${filename}`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType,
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get the public URL of the uploaded file
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

      // Schedule cleanup after 24 hours if not saved
      setTimeout(() => {
        this.deletePhoto(filePath).catch(console.error);
      }, 24 * 60 * 60 * 1000);

      return publicUrl;
    } catch (error) {
      console.error("Error in uploadGeneratedPhoto:", error);
      throw new Error(
        `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async deletePhoto(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in deletePhoto:", error);
      throw new Error(
        `Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async savePhoto(tempPath: string, userId: string): Promise<string> {
    try {
      // Get the filename from the temp path
      const filename = tempPath.split('/').pop();
      if (!filename) throw new Error('Invalid temp path');

      // Create the permanent path
      const permanentPath = `${userId}/${filename}`;

      // Copy the file to the permanent location
      const { data: copyData, error: copyError } = await this.supabase.storage
        .from(this.bucketName)
        .copy(tempPath, permanentPath);

      if (copyError) {
        throw new Error(`Failed to save image: ${copyError.message}`);
      }

      // Delete the temporary file
      await this.deletePhoto(tempPath);

      // Get the public URL of the permanent file
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucketName).getPublicUrl(permanentPath);

      return publicUrl;
    } catch (error) {
      console.error("Error in savePhoto:", error);
      throw new Error(
        `Failed to save image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
