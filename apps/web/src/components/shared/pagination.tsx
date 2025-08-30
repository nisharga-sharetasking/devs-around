import React from "react";

type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages || total === 0;

  return (
    <div className="flex justify-center items-center gap-4 lg:mt-6">
      {/* Prev Button */}
      <button
        onClick={() => !isFirstPage && onPageChange(page - 1)}
        disabled={isFirstPage}
        className={`px-4 py-2 border rounded-md transition ${
          isFirstPage
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-gray-800 border-gray-400 hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {/* Next Button */}
      <button
        onClick={() => !isLastPage && onPageChange(page + 1)}
        disabled={isLastPage}
        className={`px-3 py-1.5 lg:px-4 lg:py-2 border rounded-md transition ${
          isLastPage
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-gray-800 border-gray-400 hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
