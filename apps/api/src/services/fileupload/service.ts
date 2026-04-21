import { Folder } from "@/schemas/folder"
import { File } from "@/schemas/file"
import { s3 } from "./s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { env } from "@repo/env/server"
import { ShareItem } from "@/schemas/share"

// export const deleteFolderRecursive = async(userId:string,folderId:string)=>{
//     const subFiles = await FileModel.find({
//         parentFolder:folderId,
//         userId
//     })

//     const subFolders = await Folder.find({
//         parentFolder:folderId,
//         userId
//     })

//     for(const file of subFiles){
//         await s3.send(
//             new DeleteObjectCommand({
//                 Bucket:env.BUCKET_NAME,
//                 Key:file.key,
//             })
//         )
//         await FileModel.findByIdAndDelete(file._id)
//     }

//     for(const folder of subFolders){
//         await deleteFolderRecursive(userId,folder.id);
//         await Folder.findByIdAndDelete(folder._id);
//     }
// }

// Unoptimized Verison:

// export const shareFolderRecursive = async (userId:string,folderId: string, permissions: string[]) => {

//     await ShareItem.create({
//         folderId,
//         permissions,
//         userId
//     })
//     const subFiles = await File.find({ parentFolder: folderId });
//     for (const file of subFiles) {
//         await ShareItem.create({
//             fileId: file.id,
//             permissions,
//             userId
//         });
//     }
//     const subFolders = await Folder.find({ parentFolder: folderId });
//     for (const folder of subFolders) {
//         await shareFolderRecursive(userId, folder.id, permissions);
//     }


// };


export const deleteFolderRecursive = async (userId: string, folderId: string) => {
  // Use the correct model name 'File' (or whatever your schema is named)
  const [subFiles, subFolders] = await Promise.all([
    File.find({ parentFolder: folderId, userId }),
    Folder.find({ parentFolder: folderId, userId })
  ]);

  // Delete files in parallel
  await Promise.all(subFiles.map(async (file) => {
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: file.key,
      }));
    } catch (err) {
      console.error(`S3 Delete Failed for ${file.key}:`, err);
      // We continue so the DB record can still be cleaned up or retried
    }
    return File.deleteOne({ _id: file._id });
  }));

  // Recurse into subfolders
  for (const folder of subFolders) {
    // FIX: use _id.toString()
    await deleteFolderRecursive(userId, folder._id.toString());
    await Folder.deleteOne({ _id: folder._id });
  }
}

export const shareFolderRecursive = async (sharerId: string, recipientId: string, folderId: string, permissions: string[]) => {
    // Share the current folder
    const sharedFolder = await ShareItem.create({
        folderId,
        permissions,
        userId: recipientId,
        sharedBy: sharerId
    });

    const [subFiles, subFolders] = await Promise.all([
        File.find({ parentFolder: folderId }),
        Folder.find({ parentFolder: folderId })
    ]);

    // Bulk Insert Files
    if (subFiles.length > 0) {
        const fileShares = subFiles.map(file => ({
            fileId: file._id.toString(),
            permissions,
            userId: recipientId,
            sharedBy: sharerId
        }));
        await ShareItem.insertMany(fileShares);
    }

    // Recursive calls for folders
    if (subFolders.length > 0) {
        await Promise.all(
            subFolders.map(folder => shareFolderRecursive(sharerId, recipientId, folder._id.toString(), permissions))
        );
    }

    return sharedFolder;
};

export const getSharedFolderRecursive = async (folderId: string) => {
  const [subFolders, subFiles] = await Promise.all([
    Folder.find({ parentFolder: folderId }).lean(),
    File.find({ parentFolder: folderId }).lean(),
  ]);

  const nestedFolders: any = await Promise.all(
    subFolders.map(async (folder) => {
      const contents = await getSharedFolderRecursive(folder._id.toString());

      return {
        ...folder,
        _id: folder._id.toString(),
        itemType: 'folder',
        folders: contents.folders, // Nested sub-folders
        files: contents.files, // Nested sub-files
      };
    }),
  );

  return {
    folders: nestedFolders,
    files: subFiles.map((file) => ({ ...file, _id: file._id.toString(), itemType: 'file' })),
  };
};