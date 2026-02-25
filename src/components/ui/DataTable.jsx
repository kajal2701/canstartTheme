import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import TablePagination from "@/components/ui/TablePagination";

const DataTable = ({
  title,
  columns,
  data,
  initialPageSize = 10,
  loading = false,
  skeletonRows = 6,
  rightHeaderContent,
}) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: initialPageSize,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
    gotoPage,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  return (
    <Card noborder>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        <div className="flex items-center gap-3">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          {rightHeaderContent}
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto rounded-t-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-gray-100 table-fixed dark:divide-gray-700"
                {...getTableProps}
              >
                <thead className="bg-gray-100 dark:bg-gray-700 ">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps(),
                          )}
                          scope="col"
                          className=" table-th last:text-center "
                        >
                          <div className="flex items-center gap-1">
                            {column.render("Header")}
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <Icon
                                  icon="heroicons:chevron-down"
                                  className="text-gray-600 dark:text-gray-400"
                                  width={16}
                                />
                              ) : (
                                <Icon
                                  icon="heroicons:chevron-up"
                                  className="text-gray-600 dark:text-gray-400"
                                  width={16}
                                />
                              )
                            ) : (
                              <Icon
                                icon="heroicons:chevron-up-down"
                                className="text-gray-400 dark:text-gray-500 opacity-50"
                                width={16}
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700"
                  {...getTableBodyProps}
                >
                  {loading && (!data || data.length === 0)
                    ? Array.from({ length: skeletonRows }).map((_, rIdx) => (
                        <tr key={`sk-${rIdx}`} className="animate-pulse">
                          {columns.map((_, cIdx) => (
                            <td key={`sk-${rIdx}-${cIdx}`} className="table-td">
                              <div
                                className={`h-4 rounded ${
                                  cIdx % 2 === 0
                                    ? "bg-gray-100 dark:bg-gray-700 w-5/6"
                                    : "bg-gray-100 dark:bg-gray-700 w-3/4"
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    : page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr
                            {...row.getRowProps()}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30"
                          >
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  {...cell.getCellProps()}
                                  className="table-td"
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {!loading && (
          <TablePagination
            pageIndex={pageIndex}
            totalPages={pageOptions.length}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
            gotoPage={gotoPage}
          />
        )}
      </div>
    </Card>
  );
};

export default DataTable;
