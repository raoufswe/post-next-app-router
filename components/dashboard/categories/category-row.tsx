"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    children?: CategoryRowProps["category"][];
  };
  level: number;
}

export function CategoryRow({ category, level }: CategoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <TableRow>
        <TableCell className="flex items-center gap-2">
          <div
            style={{ marginLeft: `${level * 24}px` }}
            className="flex items-center gap-2"
          >
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {category.name}
          </div>
        </TableCell>
        <TableCell>{category.description}</TableCell>
        <TableCell className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/categories/${category.id}`}>Edit</Link>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <DeleteDialog
                    id={category.id}
                    name={category.name}
                    url="/api/categories"
                    disabled={hasChildren}
                  />
                </span>
              </TooltipTrigger>
              {hasChildren && (
                <TooltipContent>
                  <p>Cannot delete category with subcategories</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      </TableRow>
      {isExpanded &&
        hasChildren &&
        category.children?.map((child) => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
    </>
  );
}
