import { Context, Next } from "hono";
import { Folder } from "@/schemas/folder";
import { File } from "@/schemas/file";
import { ShareItem } from "@/schemas/share";

const findAncestorShare = async (
    folderId: string,
    userId: string,
): Promise<any | null> => {
    let currentFolderId: string | null = folderId;
    const visited = new Set<string>(); // prevent infinite loops

    while (currentFolderId) {
        if (visited.has(currentFolderId)) break;
        visited.add(currentFolderId);

        const shareRecord = await ShareItem.findOne({
            userId: userId,
            folderId: currentFolderId,
        });

        if (shareRecord) return shareRecord;

        const folder = await Folder.findById(currentFolderId);
        if (!folder || !folder.parentFolder) break;
        currentFolderId = folder.parentFolder as string;
    }

    return null;
};

export const validatePermissions = (
    requiredPermission: 'read' | 'create' | 'delete',
) => {
    return async (c: Context, next: Next) => {
        const userId = c.get('user').id;
        if (!userId) return c.json({ error: "Authentication Required" }, 401);

        let targetFolderId = c.req.query('parentFolder') || c.req.query('folderId');
        let targetFileId = c.req.query('fileId');

        
        if (!targetFolderId && !targetFileId) {
            return await next();
        }

        const ownedResource = targetFolderId
            ? await Folder.findOne({ _id: targetFolderId, userId })
            : await File.findOne({ _id: targetFileId, userId });

        if (ownedResource) return await next();

        // 2. Check Direct Share
        const directShareFilter: any = { userId };
        if (targetFolderId) directShareFilter.folderId = targetFolderId;
        else if (targetFileId) directShareFilter.fileId = targetFileId;

        const directShare = await ShareItem.findOne(directShareFilter);

        if (directShare) {
            if (!directShare.permissions.includes(requiredPermission)) {
                return c.json({
                    error: `Access Denied: ${requiredPermission} permission required`,
                }, 403);
            }
            return await next();
        }

        // 3. Check Ancestor Share (for folders/files inside shared folders)
        let ancestorShare: any = null;

        if (targetFolderId) {
            const folder = await Folder.findById(targetFolderId);
            if (folder && folder.parentFolder) {
                ancestorShare = await findAncestorShare(
                    folder.parentFolder as string,
                    userId,
                );
            }
        } else if (targetFileId) {
            const file = await File.findById(targetFileId);
            if (file && file.parentFolder) {
                ancestorShare = await findAncestorShare(
                    file.parentFolder as string,
                    userId,
                );
            }
        }

        if (ancestorShare) {
            if (!ancestorShare.permissions.includes(requiredPermission)) {
                return c.json({
                    error: `Access Denied: ${requiredPermission} permission required`,
                }, 403);
            }
            return await next();
        }

        return c.json({
            error: 'Access Denied: No shared access to this resource',
        }, 403);
    };
};