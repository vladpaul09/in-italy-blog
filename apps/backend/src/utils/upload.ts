import fs from "fs";
import path from "path";

/**
 * Saves the uploaded file to the specified directory and returns its path.
 * @param file The file object extracted from the request body.
 * @param folder The target folder to store the file.
 * @returns The path of the saved file relative to the server.
 */
export const saveUploadedFile = async (
  file: {
    type: string;
    buffer: Buffer;
  },
  folders: Array<string>,
  uploadName: string
): Promise<string> => {
  const uploadsPath = path.join(__dirname, "..", "..", "public", "uploads", ...folders);
  // Ensure the folder exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  const fileName = `${uploadName.split(".").length > 1 ? uploadName.split(".").slice(0, -1).join(".") : uploadName}.${file.type.split("/")[1]}`;
  const filePath = path.join(uploadsPath, fileName);
  console.log(filePath);

  // Save the file to the target directory
  await fs.writeFile(filePath, file.buffer, () => {});

  // Return the relative path (to serve later)
  return fileName;
};

/**
 * Deletes a file from the uploads directory.
 * @param fileName The name of the file to delete.
 * @param folder The folder where the file is stored.
 */
export const deleteUploadedFile = (fileName: string, folders: Array<string>): void => {
  if (!fileName) return;
  const filePath = path.join(__dirname, "..", "..", "public", "uploads", ...folders, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
