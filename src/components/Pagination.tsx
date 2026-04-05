import React from "react";
import { Button } from "@/components/ui/button";
import { getVisiblePages } from "../utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 pt-4 flex-wrap ${className}`}>
      
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      {getVisiblePages(page, totalPages).map((p, i) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-muted-foreground flex items-center"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </Button>
        );
      })}

      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>

    </div>
  );
};