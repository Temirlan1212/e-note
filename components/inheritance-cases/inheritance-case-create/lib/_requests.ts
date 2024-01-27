export const isNewInheritanceCase = async (
  pin: string,
  update: (fetchUrl?: string, fetchBody?: FormData | Record<string, any> | null | undefined) => Promise<any>
) => {
  const res = await update(`/api/inheritance-cases/check-pin/${pin}`);
  return res?.data?.[0]?.id;
};
