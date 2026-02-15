import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

// ✅ Dummy Data - 10 Records
const QuoteTableData = [
  {
    id: 1,
    srNumber: "QTE2600462",
    salesman: "Jigar Bulchandani",
    customerName: "Bart McAstocker",
    phone: "7809959867",
    address: "1823 56 St SW, Edmonton, Alberta",
    linearFeet: "370",
    colors: "Black",
    total: "$8722.56",
    status: "Sent",
    installationSchedule: "Not Scheduled",
    date: "2026-02-11",
  },
  {
    id: 2,
    srNumber: "QTE2600461",
    salesman: "Jigar Bulchandani",
    customerName: "Jennifer Weimann",
    phone: "7807086263",
    address: "254 West Whi..., Sherwood Park, Alberta",
    linearFeet: "289",
    colors: "Bright White",
    total: "$6618.78",
    status: "Sent",
    installationSchedule: "Not Scheduled",
    date: "2026-01-31",
  },
  {
    id: 3,
    srNumber: "QTE2600445",
    salesman: "Sarah Martinez",
    customerName: "Robert Johnson",
    phone: "7805551234",
    address: "789 Pine Avenue, Calgary, Alberta",
    linearFeet: "425",
    colors: "Red",
    total: "$9850.25",
    status: "Sent",
    installationSchedule: "Scheduled",
    date: "2026-02-15",
  },
  {
    id: 4,
    srNumber: "QTE2600423",
    salesman: "David Chen",
    customerName: "Emily Williams",
    phone: "7809876543",
    address: "321 Maple Drive, Red Deer, Alberta",
    linearFeet: "195",
    colors: "Blue",
    total: "$4725.90",
    status: "Pending",
    installationSchedule: "Not Scheduled",
    date: "2026-01-28",
  },
  {
    id: 5,
    srNumber: "QTE2600412",
    salesman: "Maria Garcia",
    customerName: "Michael Brown",
    phone: "7801112222",
    address: "654 Oak Street, Lethbridge, Alberta",
    linearFeet: "310",
    colors: "Green",
    total: "$7234.50",
    status: "Sent",
    installationSchedule: "Scheduled",
    date: "2026-02-18",
  },
  {
    id: 6,
    srNumber: "QTE2600398",
    salesman: "Kevin Patel",
    customerName: "Lisa Anderson",
    phone: "7803334444",
    address: "147 Birch Road, Medicine Hat, Alberta",
    linearFeet: "220",
    colors: "White",
    total: "$5450.00",
    status: "Sent",
    installationSchedule: "Not Scheduled",
    date: "2026-02-05",
  },
  {
    id: 7,
    srNumber: "QTE2600387",
    salesman: "Amanda Lee",
    customerName: "Christopher Davis",
    phone: "7805556666",
    address: "258 Cedar Lane, Fort McMurray, Alberta",
    linearFeet: "485",
    colors: "Black",
    total: "$11280.75",
    status: "Pending",
    installationSchedule: "Not Scheduled",
    date: "2026-01-22",
  },
  {
    id: 8,
    srNumber: "QTE2600375",
    salesman: "Thomas Wilson",
    customerName: "Jennifer Moore",
    phone: "7807778888",
    address: "369 Elm Court, Grande Prairie, Alberta",
    linearFeet: "340",
    colors: "Bright White",
    total: "$7890.40",
    status: "Sent",
    installationSchedule: "Scheduled",
    date: "2026-02-12",
  },
  {
    id: 9,
    srNumber: "QTE2600363",
    salesman: "Jessica Taylor",
    customerName: "Daniel Wilson",
    phone: "7809990000",
    address: "741 Willow Way, Airdrie, Alberta",
    linearFeet: "275",
    colors: "Red",
    total: "$6325.80",
    status: "Sent",
    installationSchedule: "Not Scheduled",
    date: "2026-02-08",
  },
  {
    id: 10,
    srNumber: "QTE2600351",
    salesman: "Ryan Mitchell",
    customerName: "Sophia Martinez",
    phone: "7801231234",
    address: "852 Spruce Avenue, Camrose, Alberta",
    linearFeet: "405",
    colors: "Blue",
    total: "$9456.30",
    status: "Pending",
    installationSchedule: "Scheduled",
    date: "2026-01-25",
  },
];

const Quote = () => {
  // ✅ Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // ✅ Get unique salesmen for dropdown
  const uniqueSalesmen = useMemo(() => {
    const salesmen = [...new Set(QuoteTableData.map((item) => item.salesman))];
    return salesmen.sort();
  }, []);

  // ✅ Filter data based on all filters
  const filteredData = useMemo(() => {
    return QuoteTableData.filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        item.srNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // Salesman filter
      const matchesSalesman =
        salesmanFilter === "all" || item.salesman === salesmanFilter;

      // Date filter
      const matchesDate = dateFilter === "" || item.date === dateFilter;

      return matchesSearch && matchesStatus && matchesSalesman && matchesDate;
    });
  }, [searchQuery, statusFilter, salesmanFilter, dateFilter]);

  // ✅ Clear all filters
  const handleClearAll = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSalesmanFilter("all");
    setDateFilter("");
  };

  // ✅ Export functionality (placeholder)
  const handleExport = () => {
    console.log("Exporting data...", filteredData);
    alert("Export functionality - Coming soon!");
  };

  // ✅ Add Quote functionality (placeholder)
  const handleAddQuote = () => {
    console.log("Add new quote");
    alert("Add Quote functionality - Coming soon!");
  };

  const COLUMNS = [
    {
      Header: "Sr.",
      accessor: "srNumber",
      Cell: (row) => {
        return (
          <span className="text-sm text-indigo-600 font-medium">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Salesman",
      accessor: "salesman",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
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
          <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px] block">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Linear Feet",
      accessor: "linearFeet",
      Cell: (row) => {
        return (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Colors",
      accessor: "colors",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => {
        return (
          <span className="text-sm font-semibold text-green-600">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => {
        const status = row?.cell?.value;
        return (
          <span
            className={`inline-block text-xs px-3 py-1 rounded font-medium ${
              status === "Sent"
                ? "bg-yellow-400 text-gray-800"
                : "bg-gray-400 text-white"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      Header: "Installation Schedule",
      accessor: "installationSchedule",
      Cell: (row) => {
        const isScheduled = row?.cell?.value === "Scheduled";
        return (
          <span
            className={`inline-block text-xs px-3 py-1 rounded font-medium ${
              isScheduled ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: (row) => {
        const dateValue = row?.cell?.value;
        const [year, month, day] = dateValue.split("-");
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {`${day}-${month}-${year}`}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => {
        return (
          <div className="flex space-x-2 rtl:space-x-reverse justify-center">
            <button
              className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
              title="Edit"
            >
              <Icon icon="ph:pencil-line" />
            </button>
            <button
              className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
              type="button"
              title="View"
            >
              <Icon icon="ph:eye" />
            </button>
            <button
              className="icon-btn hover:bg-green-50 dark:hover:bg-green-900"
              type="button"
              title="Print"
            >
              <Icon icon="ph:printer" />
            </button>
            <button
              className="icon-btn hover:bg-red-50 dark:hover:bg-red-900"
              type="button"
              title="Delete"
            >
              <Icon icon="ph:trash" />
            </button>
            <button
              className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900"
              type="button"
              title="Schedule"
            >
              <Icon icon="ph:calendar-check" />
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, [filteredData]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
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
    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  return (
    <>
      <Card noborder>
        {/* ✅ Filter Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search:
            </label>
            <input
              type="text"
              placeholder="Search by Quote #, Customer Name, Phone, Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Quotes</option>
                <option value="Sent">Sent</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Salesman Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Salesman:
              </label>
              <select
                value={salesmanFilter}
                onChange={(e) => setSalesmanFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Salesmen</option>
                {uniqueSalesmen.map((salesman) => (
                  <option key={salesman} value={salesman}>
                    {salesman}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date:
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <Button
                text="Clear All"
                icon="ph:x"
                className="btn-outline-secondary flex-1"
                onClick={handleClearAll}
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2">
            <Button
              text="Export"
              icon="ph:download-simple"
              className="btn-warning"
              onClick={handleExport}
            />
            <Button
              text="Add Quote"
              icon="ph:plus"
              className="btn-primary"
              onClick={handleAddQuote}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredData.length}</span>{" "}
            of <span className="font-semibold">{QuoteTableData.length}</span>{" "}
            quotes
          </p>
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
                    {page.length > 0 ? (
                      page.map((row) => {
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
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-10 text-gray-500"
                        >
                          No quotes found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ✅ Pagination */}
          <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center px-5 pb-5">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="flex space-x-2 rtl:space-x-reverse items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Go
                </span>
                <span>
                  <input
                    type="number"
                    className="text-control py-2"
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
                  {pageIndex + 1} of {pageOptions.length || 1}
                </span>
              </span>
            </div>
            <ul className="flex items-center space-x-3 rtl:space-x-reverse">
              <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
                <button
                  className={`${
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
                    aria-current="page"
                    className={`${
                      pageIdx === pageIndex
                        ? "bg-indigo-500 text-white font-medium"
                        : "bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-900 font-normal"
                    } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                    onClick={() => gotoPage(pageIdx)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
              <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
                <button
                  className={`${
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

export default Quote;
