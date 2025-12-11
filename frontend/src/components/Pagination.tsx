import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 12,
  totalItems,
}) => {
  // Không hiển thị nếu chỉ có 1 trang hoặc không có dữ liệu
  if (!totalPages || totalPages <= 1 || !totalItems) {
    return null;
  }

  // Tính toán số trang cần hiển thị
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Hiển thị tất cả nếu <= 5 trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị thông minh
      if (currentPage <= 3) {
        // Đầu: 1, 2, 3, 4, ..., last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Cuối: 1, ..., n-3, n-2, n-1, n
        pages.push(1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Giữa: 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 mt-12 mb-8 px-4">
      {/* Thông tin hiển thị */}
      {totalItems && (
        <div className="text-sm text-gray-600 font-medium">
          Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemsPerPage === 12 ? 'bài học' : 'bài kiểm tra'}
        </div>
      )}

      {/* Nút phân trang */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Nút Trước */}
        <button
          type="button"
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={currentPage === 1}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-center gap-1 min-w-[80px]
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md active:scale-95'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Trước</span>
        </button>

        {/* Số trang */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {visiblePages.map((page, index) => {
            // Thêm dấu ... giữa các trang
            const prevPage = index > 0 ? visiblePages[index - 1] : 0;
            const needEllipsis = page - prevPage > 1;

            return (
              <React.Fragment key={page}>
                {needEllipsis && (
                  <span className="px-2 text-gray-400 text-sm">...</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px]
                    ${currentPage === page
                      ? 'bg-blue-600 text-white shadow-md font-semibold'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md active:scale-95'
                    }
                  `}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Nút Sau */}
        <button
          type="button"
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-center gap-1 min-w-[80px]
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md active:scale-95'
            }
          `}
        >
          <span>Sau</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

