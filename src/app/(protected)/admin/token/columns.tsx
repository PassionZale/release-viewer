import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "@/libs/dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";

export type Token = PrismaModels["Token"] & {
  user: PrismaModels["User"];
};

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    accessorKey: "createdAt",
    header: "创建于",
    cell: ({ row }) => dayjs(row.original.createdAt).fromNow(),
  },
  {
    accessorKey: "lastUsedAt",
    header: "最近使用",
    cell: ({ row }) =>
      row.original.lastUsedAt
        ? dayjs(row.original.expiresAt).format("YYYY-MM-DD")
        : "---",
  },
  {
    accessorKey: "expiresAt",
    header: "到期",
    cell: ({ row }) =>
      row.original.expiresAt ? (
        dayjs().isSameOrAfter(dayjs(row.original.expiresAt)) ? (
          <Badge variant={"destructive"}>已过期</Badge>
        ) : (
          <Badge>{dayjs(row.original.expiresAt).format("YYYY-MM-DD")}</Badge>
        )
      ) : (
        <Badge>永久有效</Badge>
      ),
  },
  {
    accessorKey: "user",
    header: "创建人",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2 text-sm">
        {row.original.user.avatar ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={row.original.user.avatar}
                    alt={row.original.user.nickname}
                  />
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.user.nickname}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p>{row.original.user.nickname}</p>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions deleteApiPath={`/api/tokens/${row.original.id}`} />
    ),
  },
];
