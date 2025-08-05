import { createClient } from "@/utils/supabase/server";
import { UpdateSettingsRequest } from "../services/settings";

export class SettingsRepository {
  async updateUserSettings(updates: UpdateSettingsRequest) {
    const supabase = await createClient();

    const { ...metadata } = updates;
    let user;
    // Update user metadata (first_name, last_name)
    if (Object.keys(metadata).length > 0) {
      const {
        data: { user: userData },
        error: metadataError,
      } = await supabase.auth.updateUser({
        data: metadata,
      });
      user = userData;
      if (metadataError) {
        throw new Error(`Failed to update user metadata: ${metadataError.message}`);
      }
    }
    return user;
  }
}
