// lib/linkedin.ts
// import { decrypt } from "@/lib/encryption";

/**
 * Extracts and decrypts LinkedIn cookies from an account object
 * @param accountData The LinkedIn account data from the database
 * @returns Array of cookie objects with name and value properties
 */
export function getLinkedInCookies(accountData: any): Array<{ name: string; value: string }> {
  if (!accountData) {
    throw new Error("Account data is required");
  }

  const cookies: Array<{ name: string; value: string }> = [];

  try {
    // Handle li_at cookie
    if (accountData.li_at) {
      try {
        const decryptedLiAt = accountData.li_at;
        // Validate cookie value
        if (decryptedLiAt && decryptedLiAt.length > 10) {
          cookies.push({
            name: "li_at",
            value: decryptedLiAt,
          });
        } else {
          console.error("Invalid li_at cookie value");
        }
      } catch (error) {
        console.error("Error processing li_at cookie:", error);
      }
    } else {
      // console.log("❌ li_at cookie is missing in account data");
    }

    // Handle li_a cookie (if present)
    if (accountData.li_a && accountData.li_a.length > 0) {
      try {
        const decryptedLiA = decrypt(accountData.li_a);
        // console.log("li_a decrypted successfully");

        if (decryptedLiA && decryptedLiA.length > 5) {
          cookies.push({
            name: "li_a",
            value: decryptedLiA,
          });
          // console.log("li_a cookie is valid");
        } else {
          // console.log("Li_a cookie is missing or invalid after decryption");
        }
      } catch (error) {
        console.error("❌ Error decrypting li_a:", error);
      }
    } else {
      // console.log("li_a is empty");
    }

    // console.log(`Generated ${cookies.length} LinkedIn cookies`);
    return cookies;
  } catch (error) {
    console.error("❌ Error processing LinkedIn cookies:", error);
    throw new Error(
      `Failed to process LinkedIn cookies: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
