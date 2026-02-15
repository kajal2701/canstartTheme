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

// ✅ Dummy Data
const InstallationsTableData = [
  {
    id: 1,
    installationDate: "11 Nov, 2025",
    daysOverdue: "91 days",
    overdueBadge: "danger",
    quoteNumber: "QTE2500348",
    initial: "Kamil patel",
    customerName: "Kargaret Boswell",
    phone: "7805746109",
    address: "8 Lynn Ct #11, St.Albert, Alberta",
    linearFeet: "75 ft",
    totalAmount: "$1,438.00",
    paymentStatus: "Confirmed - Deposit Paid",
  },
  {
    id: 2,
    installationDate: "17 Nov, 2025",
    daysOverdue: "90 days",
    overdueBadge: "warning",
    quoteNumber: "QTE2500386",
    initial: "Ruta Patel",
    customerName: "Nora DeGrasmo",
    phone: "17806025960",
    address: "8/3 Astor Avenue Norwood Park, Alberta, T1B1Y4",
    linearFeet: "94 ft",
    totalAmount: "$2,349.89",
    paymentStatus: "Confirmed - Deposit Paid",
  },
  {
    id: 3,
    installationDate: "04 Dec, 2025",
    daysOverdue: "73 days",
    overdueBadge: "warning",
    quoteNumber: "QTE2500427",
    initial: "Jiger Budhabhatti",
    customerName: "Shelly Nguyen",
    phone: "17806044127",
    address: "Sally Mccrackin Crescent, Edmonton, Alberta, T6W 4W1",
    linearFeet: "260 ft",
    totalAmount: "$6,500.24",
    paymentStatus: "Confirmed - Deposit Paid",
  },
  {
    id: 4,
    installationDate: "15 Dec, 2025",
    daysOverdue: "62 days",
    overdueBadge: "warning",
    quoteNumber: "QTE2500489",
    initial: "Mike Johnson",
    customerName: "Sarah Williams",
    phone: "7805551234",
    address: "123 Main Street, Calgary, Alberta, T2P 1A1",
    linearFeet: "120 ft",
    totalAmount: "$3,200.50",
    paymentStatus: "Confirmed - Deposit Paid",
  },
];

const PastInstallations = () => {
  const COLUMNS = [
    {
      Header: "Installation Date",
      accessor: "installationDate",
      Cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {row?.cell?.value}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Days Overdue",
      accessor: "daysOverdue",
      Cell: (row) => {
        const badge = row?.row?.original?.overdueBadge;
        return (
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-medium ${
              badge === "danger"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
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
        return (
          <span className="inline-block bg-cyan-100 text-cyan-600 text-xs px-3 py-1 rounded-full font-medium">
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
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
            >
              <Icon icon="ph:bell" className="text-sm" />
              Send
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
            >
              <Icon icon="ph:eye" className="text-sm" />
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center justify-center gap-1"
              type="button"
            >
              <Icon icon="ph:trash" className="text-sm" />
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => InstallationsTableData, []);

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

  return (
    <>
      <Card noborder className="border-2 border-red-300 bg-red-50/30">
        {/* ✅ Alert Banner */}
        <div className="flex items-center gap-3 mb-3">
          <Icon icon="ph:warning-circle" className="text-red-500 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Past Installations - Invoice Pending
          </h2>
          <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            4 items
          </span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-red-600 text-xs flex items-center gap-1">
                <Icon icon="ph:info" className="text-sm" />
                <span className="font-medium">Action Required:</span> These
                installations are complete but invoices haven't been sent to
                customers yet.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Header with Search */}
        <div className="md:flex justify-end items-center mb-6">
          {/* <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Show:
            </span>
            <select
              className="text-control py-2 px-3 text-sm"
              defaultValue="25"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              entries
            </span>
          </div> */}
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
                              <td {...cell.getCellProps()} className="table-td">
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
      </Card>
    </>
  );
};

export default PastInstallations;
