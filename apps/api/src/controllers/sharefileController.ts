import { ShareItem } from "@/schemas/share";
import { Context } from "hono";
import { File } from "@/schemas/file";
import User from "@repo/db/schemas/user";
import { Folder } from "@/schemas/folder";
import { getSharedFolderRecursive, shareFolderRecursive } from "@/services/fileupload/service";


export const shareItem = async (c: Context) => {
  const { fileId, folderId, permissions, email } = await c.req.json();
  const sharerId = c.get('user').id;

  if (!fileId && !folderId) return c.json({ error: "Invalid Item" }, 400);

  const recipient = await User.findOne({ email });
  if (!recipient) return c.json({ error: "Recipient user not found" }, 404);
  
  if (recipient._id.toString() === sharerId) {
    return c.json({ error: "Cannot share with yourself" }, 400);
  }

  // Ownership verification
  const itemOwner = fileId 
    ? await File.findOne({ _id: fileId, userId: sharerId })
    : await Folder.findOne({ _id: folderId, userId: sharerId });

  if (!itemOwner) return c.json({ error: "You do not own this item" }, 403);

  if (fileId) {
    const sharedFile = await ShareItem.create({
      fileId,
      permissions,
      userId: recipient.id,
      sharedBy: sharerId
    });
    return c.json({ sharedFile }, 200);
  }

  const shareRecord = await shareFolderRecursive(sharerId, recipient._id.toString(), folderId, permissions);
  return c.json({ shareRecord }, 200);
}

/**
 * 7. GET SHARED WITH ME
 * FIX: Optimized by removing nested loops and recursive DB calls. 
 * Returns top-level shared items only.
 */
export const getSharedWithMe = async (c: Context) => {
  const userId = c.get('user').id;

  const shares = await ShareItem.find({ userId }).lean();

  const folderIds = shares.map((s) => s.folderId).filter(Boolean);
  const fileIds = shares.map((s) => s.fileId).filter(Boolean);

  const [folders, files] = await Promise.all([
    Folder.find({ _id: { $in: folderIds } }).lean(),
    File.find({ _id: { $in: fileIds } }).lean(),
  ]);

  // Build a Set of shared folder ID strings for reliable lookup
  const sharedFolderIdSet = new Set(folderIds.map((id) => id!.toString()));

  // Identify root-level shared items (those whose parents aren't also shared)
  const rootFolders = folders.filter(f => !f.parentFolder || !sharedFolderIdSet.has(f.parentFolder.toString()));
  const rootFiles = files.filter(f => !f.parentFolder || !sharedFolderIdSet.has(f.parentFolder.toString()));

  const result = await Promise.all([...rootFolders, ...rootFiles].map(async (item) => {
    const share = shares.find(s => 
      s.folderId?.toString() === item._id.toString() || 
      s.fileId?.toString() === item._id.toString()
    );
    
    const isFolder = (item as any).size === undefined;
    let contents: any = { folders: [], files: [] };
    
    if (isFolder) {
      contents = await getSharedFolderRecursive(item._id.toString());
    }

    return {
      ...item,
      _id: item._id.toString(),
      itemType: isFolder ? 'folder' : 'file',
      isShared: true,
      permissions: share?.permissions || [],
      sharedBy: share?.sharedBy || null,
      folders: contents.folders,
      files: contents.files
    };
  }));

  return c.json({ data: result }, 200);
};

export const getSharesForItem = async (c: Context) => {
  const userId = c.get('user').id;
  const itemId = c.req.param('itemId');
  const itemType = c.req.query('itemType');

  const item = itemType === 'file' 
    ? await File.findOne({ _id: itemId, userId })
    : await Folder.findOne({ _id: itemId, userId });

  if (!item) return c.json({ error: 'Item not found or unauthorized' }, 403);

  const filter = itemType === 'file' ? { fileId: itemId } : { folderId: itemId };
  const shares = await ShareItem.find(filter).populate('userId', 'name email').lean();

  // Map to rename userId to recipient for the frontend
  const result = shares.map((share: any) => ({
    ...share,
    recipient: share.userId,
  }));

  return c.json({ data: result }, 200);
};

export const revokeShare = async (c: Context) => {
  const shareId = c.req.param('shareId');
  const userId = c.get('user').id;

  const share = await ShareItem.findById(shareId);
  if (!share) return c.json({ error: 'Share not found' }, 404);

  // FIX: Ensure the person revoking is the one who shared it
  if (share.sharedBy.toString() !== userId) {
    return c.json({ error: 'Unauthorized to revoke this share' }, 403);
  }

  await ShareItem.findByIdAndDelete(shareId);
  return c.json({ message: 'Share revoked successfully' }, 200);
};

export const searchUsers = async (c: Context) => {
  const userId = c.get('user').id;
  const q = c.req.query('q');

  if (!q || q.trim().length < 1) return c.json({ data: [] }, 200);

  const searchRegex = new RegExp(q.trim(), 'i');
  const users = await User.find({
    _id: { $ne: userId },
    $or: [{ name: { $regex: searchRegex } }, { email: { $regex: searchRegex } }],
  }).select('name email').limit(10).lean();

  return c.json({ data: users }, 200);
};