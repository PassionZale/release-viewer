import { Prisma, PrismaClient } from "@prisma/client";
import { ModelNames } from "@/types/interface";

type PrismaOperations<ModelName extends ModelNames> =
  Prisma.TypeMap["model"][ModelName]["operations"];

type PrismaFindManyArgs<ModelName extends ModelNames> =
  PrismaOperations<ModelName>["findMany"]["args"];

type PaginationOptions<ModelName extends ModelNames> =
  PrismaFindManyArgs<ModelName> & {
    searchParams: URLSearchParams;
  };

async function paginate<ModelName extends ModelNames>(
  model: PrismaClient[Uncapitalize<ModelName>],
  options: PaginationOptions<ModelName>
) {
  const { searchParams, ...args } = options;

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const skip = (page - 1) * pageSize;

  const [total, records] = await Promise.all([
    // @ts-ignore
    model.count({
      where: args.where,
    }),
    // @ts-ignore
    model.findMany({
      ...args,
      skip,
      take: pageSize,
    }),
  ]);

  const pageCount = Math.ceil(total / pageSize);

  return {
    records,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

export default paginate;
