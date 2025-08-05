import crypto from "crypto";

const ENCRYPTION_KEY =  "";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required in environment variables");
}

if (ENCRYPTION_KEY.length !== 64 || !/^[0-9a-fA-F]+$/.test(ENCRYPTION_KEY)) {
  throw new Error("Invalid ENCRYPTION_KEY format - must be 64-character hex string");
}

export function encrypt(text: string): string {
  // const iv = crypto.randomBytes(IV_LENGTH);
  // const cipher = crypto.createCipheriv(
  //   ALGORITHM,
  //   Buffer.from(ENCRYPTION_KEY, "hex"),
  //   iv
  // );

  // let encrypted = cipher.update(text, "utf8", "hex");
  // encrypted += cipher.final("hex");

  // const authTag = cipher.getAuthTag();

  // // Combine IV, encrypted text, and auth tag
  // return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

export function decrypt(encryptedData: string): string {
  // const [ivHex, encryptedText, authTagHex] = encryptedData.split(":");

  // if (!ivHex || !encryptedText || !authTagHex) {
  //   throw new Error("Invalid encrypted data format");
  // }

  // const iv = Buffer.from(ivHex, "hex");
  // const authTag = Buffer.from(authTagHex, "hex");

  // const decipher = crypto.createDecipheriv(
  //   ALGORITHM,
  //   Buffer.from(ENCRYPTION_KEY, "hex"),
  //   iv
  // );

  // decipher.setAuthTag(authTag);

  // let decrypted = decipher.update(encryptedText, "hex", "utf8");
  // decrypted += decipher.final("utf8");

  // return decrypted;
}
