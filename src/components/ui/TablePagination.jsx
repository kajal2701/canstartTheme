import Icon from "@/components/ui/Icon";

const getVisiblePages = (current, total) => {
  const pages = [];
  const add = (p) => pages.push(p);
  const addEllipsis = () => {
    if (pages[pages.length - 1] !== "...") pages.push("...");
  };
  const first = 0;
  const last = Math.max(0, total - 1);
  add(first);
  const start = Math.max(first + 1, current - 1);
  const end = Math.min(last - 1, current + 1);
  if (start > first + 1) addEllipsis();
  for (let i = start; i <= end; i++) add(i);
  if (end < last - 1) addEllipsis();
  if (last !== first) add(last);
  return pages;
};

const TablePagination = ({
  pageIndex,
  totalPages,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
}) => {
  return (
    <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center px-5 pb-5">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="flex space-x-2 rtl:space-x-reverse items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Go
          </span>
          <span>
            <input
              type="number"
              min={1}
              max={totalPages}
              step={1}
              className="text-control py-2"
              value={pageIndex + 1}
              onChange={(e) => {
                const val = e.target.valueAsNumber;
                if (Number.isNaN(val)) return;
                const clamped = Math.min(Math.max(val, 1), totalPages);
                if (clamped !== val) {
                  e.target.value = String(clamped);
                }
                gotoPage(clamped - 1);
              }}
              style={{ width: "60px" }}
            />
          </span>
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Page{" "}
          <span>
            {pageIndex + 1} of {totalPages}
          </span>
        </span>
      </div>
      <ul className="flex items-center space-x-3 rtl:space-x-reverse">
        <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
          <button
            className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <Icon icon="heroicons-outline:chevron-left" />
          </button>
        </li>
        {getVisiblePages(pageIndex, totalPages).map((p, idx) =>
          p === "..." ? (
            <li key={`dots-${idx}`} className="text-gray-400 text-sm">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                aria-current="page"
                className={` ${
                  p === pageIndex
                    ? "bg-[#d42d27] text-white font-medium "
                    : "bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-900 font-normal "
                } text-sm rounded leading-[16px] min-w-6 h-6 px-2 NB flex items-center justify-center transition-all duration-150`}
                onClick={() => gotoPage(p)}
              >
                {p + 1}
              </button>
            </li>
          ),
        )}
        <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
          <button
            className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <Icon icon="heroicons-outline:chevron-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TablePagination;
