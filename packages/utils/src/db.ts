export const  withTimestamps = (data: any) => ({
  ...data,
  createdAt: data.createdAt || new Date(),
  updatedAt: new Date(),
});