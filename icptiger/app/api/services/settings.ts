import { SettingsRepository } from "../repositories/settings";

export interface UpdateSettingsRequest {
  first_name?: string;
  last_name?: string;
}

export class SettingsService {
  private repository: SettingsRepository;

  constructor() {
    this.repository = new SettingsRepository();
  }

  validateUpdateRequest(body: any): {
    isValid: boolean;
    updates: UpdateSettingsRequest;
    error?: string;
  } {
    const updates: UpdateSettingsRequest = {};
    const allowedFields = ["first_name", "last_name"] as const;
    let hasValidField = false;

    // Check for invalid fields
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key as keyof UpdateSettingsRequest),
    );
    if (invalidFields.length > 0) {
      return {
        isValid: false,
        updates: {},
        error: `Invalid fields provided: ${invalidFields.join(", ")}`,
      };
    }

    // Validate and collect valid fields
    for (const field of allowedFields) {
      if (field in body) {
        const value = body[field];

        // Validate name fields if provided
        if ((field === "first_name" || field === "last_name") && value) {
          if (typeof value !== "string" || value.length < 1) {
            return {
              isValid: false,
              updates: {},
              error: `${field} must be a non-empty string`,
            };
          }
        }

        hasValidField = true;
        updates[field] = value;
      }
    }

    if (!hasValidField) {
      return {
        isValid: false,
        updates: {},
        error: "At least one field (first_name, last_name) must be provided",
      };
    }

    return { isValid: true, updates };
  }

  async updateSettings(body: any) {
    const validation = this.validateUpdateRequest(body);

    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return await this.repository.updateUserSettings(validation.updates);
  }
}
