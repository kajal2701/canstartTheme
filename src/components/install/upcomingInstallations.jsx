import React, { useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../../pages/table/react-tables/GlobalFilter";

// ✅ Dummy Data for Upcoming Installations
const UpcomingInstallationsData = [
  {
    id: 1,
    installationDate: "20 Feb, 2026",
    daysAhead: "5 days",
    quoteNumber: "QTE2600145",
    initial: "Sarah Chen",
    customerName: "Michael Anderson",
    phone: "7801234567",
    address: "456 Oak Avenue, Edmonton, Alberta, T5K 2P4",
    linearFeet: "85 ft",
    totalAmount: "$2,100.00",
    paymentStatus: "Confirmed - Full Payment",
    status: "Scheduled",
  },
  {
    id: 2,
    installationDate: "22 Feb, 2026",
    daysAhead: "7 days",
    quoteNumber: "QTE2600158",
    initial: "David Lee",
    customerName: "Emma Thompson",
    phone: "7809876543",
    address: "789 Pine Street, Calgary, Alberta, T2R 0K8",
    linearFeet: "120 ft",
    totalAmount: "$3,450.75",
    paymentStatus: "Confirmed - Deposit Paid",
    status: "Scheduled",
  },
];

const UpcomingInstallations = () => {
  const COLUMNS = [
    {
      Header: "Installation Date",
      accessor: "installationDate",
      Cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              <Icon icon="ph:calendar-check" className="inline mr-1" />
              {row?.cell?.value}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Days Ahead",
      accessor: "daysAhead",
      Cell: (row) => {
        return (
          <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-medium">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Quote #",
      accessor: "quoteNumber",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Initial",
      accessor: "initial",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: (row) => {
        return (
          <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px] block">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Linear Feet",
      accessor: "linearFeet",
      Cell: (row) => {
        return <span className="text-sm font-medium">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      Cell: (row) => {
        return (
          <span className="text-sm font-semibold text-green-600">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      Cell: (row) => {
        const isFull = row?.cell?.value.includes("Full Payment");
        return (
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
              isFull
                ? "bg-green-100 text-green-600"
                : "bg-cyan-100 text-cyan-600"
            }`}
          >
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="inline-block bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
              title="View Details"
            >
              <Icon icon="ph:eye" className="text-sm" />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
              title="Edit"
            >
              <Icon icon="ph:pencil-line" className="text-sm" />
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
              title="Cancel"
            >
              <Icon icon="ph:x-circle" className="text-sm" />
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => UpcomingInstallationsData, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5,
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
    gotoPage,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  // Check if there's data
  const hasData = data.length > 0;

  return (
    <div className="my-5">
      <Card noborder className="border-2 border-blue-300 bg-blue-50/30">
        {/* ✅ Header with Job Count Badge */}
        <div className="flex items-center gap-3 mb-6">
          <Icon icon="ph:calendar-dots" className="text-2xl text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Upcoming Installations
          </h2>
          <span className="bg-indigo-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            {data.length} Jobs
          </span>
        </div>

        {/* ✅ Show info message if no data OR table if data exists */}
        {!hasData ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Icon
                icon="ph:info"
                className="text-blue-500 text-xl flex-shrink-0"
              />
              <p className="text-blue-700 text-sm">
                No upcoming installations scheduled at this time.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ✅ Header with Search */}
            <div className="md:flex justify-end items-center mb-6">
              <div>
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
              </div>
            </div>

            {/* ✅ Table */}
            <div className="card">
              <div className="overflow-x-auto rounded-t-lg">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table
                      className="min-w-full divide-y divide-gray-100 table-fixed dark:divide-gray-700"
                      {...getTableProps}
                    >
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps(),
                                )}
                                scope="col"
                                className="table-th last:text-center"
                              >
                                {column.render("Header")}
                                <span>
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? " 🔽"
                                      : " 🔼"
                                    : ""}
                                </span>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody
                        className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700"
                        {...getTableBodyProps}
                      >
                        {page.map((row) => {
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

              {/* ✅ Pagination */}
              <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center px-5 pb-5">
                <div className=" flex items-center space-x-3 rtl:space-x-reverse">
                  <span className=" flex space-x-2  rtl:space-x-reverse items-center">
                    <span className=" text-sm font-medium text-gray-600 dark:text-gray-300">
                      Go
                    </span>
                    <span>
                      <input
                        type="number"
                        className=" text-control py-2"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                          const pageNumber = e.target.value
                            ? Number(e.target.value) - 1
                            : 0;
                          gotoPage(pageNumber);
                        }}
                        style={{ width: "50px" }}
                      />
                    </span>
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Page{" "}
                    <span>
                      {pageIndex + 1} of {pageOptions.length}
                    </span>
                  </span>
                </div>
                <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
                  <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
                    <button
                      className={` ${
                        !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      <Icon icon="heroicons-outline:chevron-left" />
                    </button>
                  </li>
                  {pageOptions.map((page, pageIdx) => (
                    <li key={pageIdx}>
                      <button
                        href="#"
                        aria-current="page"
                        className={` ${
                          pageIdx === pageIndex
                            ? "bg-indigo-500  text-white font-medium "
                            : "bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-900  font-normal  "
                        }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                        onClick={() => gotoPage(pageIdx)}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
                    <button
                      className={` ${
                        !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      <Icon icon="heroicons-outline:chevron-right" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UpcomingInstallations;
