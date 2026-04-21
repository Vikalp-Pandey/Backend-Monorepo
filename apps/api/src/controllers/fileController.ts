import { Context } from "hono";
import { File } from "@/schemas/file";
// import { createInstance } from "@repo/db/utils";
import { generateUploadUrl, s3 } from "@/services/fileupload/s3";
import { Folder } from "@/schemas/folder";
import { env } from "@repo/env/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { deleteFolderRecursive } from "@/services/fileupload/service";
import mongoose from "mongoose";



/**
 * 1. FILE UPLOAD URL
 * FIX: Unified key generation and added a timestamp to prevent collisions.
 */
export const fileUploadUrl = async (c: Context) => {
  const { fileName, parentFolder } = await c.req.json();
  const userId = c.get('user').id;

  if (!fileName) {
    return c.json({ error: "File name is required" }, 400);
  }

  // Inherit ownership from parent folder if it exists (for storage pathing)
  let storageUserId = userId;
  if (parentFolder && mongoose.isValidObjectId(parentFolder)) {
    const parent = await Folder.findById(parentFolder);
    if (parent) storageUserId = parent.userId;
  }

  // Use storageUserId and timestamp to ensure the path is unique and isolated
  const safeName = fileName.replace(/\s+/g, '').toLowerCase();
  const uniqueKey = `uploads/${storageUserId}/${Date.now()}_${safeName}`;

  const { uploadUrl, fileUrl } = await generateUploadUrl(uniqueKey);
  
  return c.json({ data: { uploadUrl, fileUrl, key: uniqueKey } }, 200);
}

/**
 * 2. SAVE FILE
 * FIX: Removed redundant URL generation; now strictly saves metadata.
 */
export const saveFile = async (c: Context) => {
  const { name, size, parentFolder, key, mimeType, fileUrl } = await c.req.json();
  const userId = c.get('user').id;

  if (!name || !size || !key || !mimeType || !fileUrl) {
    return c.json({ error: "All fields are required" }, 400);
  }

  // Inherit ownership from parent folder if it exists
  let effectiveUserId = userId;
  if (parentFolder && mongoose.isValidObjectId(parentFolder)) {
    const parent = await Folder.findById(parentFolder);
    if (parent) {
      effectiveUserId = parent.userId;
    }
  }

  const file = await File.create({
    name,
    size,
    parentFolder: parentFolder || null,
    key,
    mimeType,
    fileUrl,
    userId: effectiveUserId
  });

  return c.json({ file }, 201);
}

export const saveFolder = async (c: Context) => {
  const { name, parentFolder } = await c.req.json();
  const userId = c.get('user').id;

  if (!name) return c.json({ error: "Folder name is required" }, 400);

  // Inherit ownership from parent folder if it exists
  let effectiveUserId = userId;
  if (parentFolder && mongoose.isValidObjectId(parentFolder)) {
    const parent = await Folder.findById(parentFolder);
    if (parent) {
      effectiveUserId = parent.userId;
    }
  }

  const folder = await Folder.create({
    name,
    parentFolder: parentFolder || null,
    userId: effectiveUserId
  });

  return c.json({ folder }, 201);
}

/**
 * 3. GET ITEMS
 * FIX: Logic is kept simple; handles personal directory navigation.
 */
export const getItems = async (c: Context) => {
  const parentFolder = c.req.query('parentFolder') || null;
  const userId = c.get('user').id;

  // We still filter by the owner ID to find items in this specific path.
  // If this is a shared folder, we should fetch the items owned by the folder's owner.
  let targetUserId = userId;
  if (parentFolder && mongoose.isValidObjectId(parentFolder)) {
    const parent = await Folder.findById(parentFolder);
    if (parent) targetUserId = parent.userId;
  }

  const [folders, files] = await Promise.all([
    Folder.find({ parentFolder, userId: targetUserId }),
    File.find({ parentFolder, userId: targetUserId })
  ]);

  return c.json({ data: [...folders, ...files] }, 200);
}

/**
 * 4. DELETE FILE
 */
export const deleteFile = async (c: Context) => {
  const fileId = c.req.query('fileId');
  if (!fileId) return c.json({ error: "Invalid File ID" }, 400);

  // Rely on validatePermissions middleware for security.
  // We just fetch the file to get the key for S3 deletion.
  const file = await File.findById(fileId);
  if (!file) return c.json({ error: "File not found" }, 404);

  await s3.send(new DeleteObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: file.key,
  }));

  await File.findByIdAndDelete(fileId);
  return c.json({ message: "Deleted the file successfully" }, 200);
}

/**
 * 5. DELETE FOLDER
 */
export const deleteFolder = async (c: Context) => {
  const folderId = c.req.query('folderId');
  if (!folderId) return c.json({ error: "Invalid Folder Id" }, 400);

  const folder = await Folder.findById(folderId);
  if (!folder) return c.json({ error: "Folder not found" }, 404);

  // Recursive deletion of contents
  await deleteFolderRecursive(folder.userId, folder._id.toString());
  
  // Delete the folder itself
  await Folder.deleteOne({ _id: folderId });
  
  return c.json({ message: "Deleted the folder successfully" }, 200);
}
