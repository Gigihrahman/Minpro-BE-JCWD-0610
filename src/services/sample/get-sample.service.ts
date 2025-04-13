import prisma from "../../config/prisma";

export const getSampleService = async () => {
  const samples = await prisma.sample.findMany();
  return samples;
};
