import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useTable, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";

const QuoteTableData = [
  {
    id: 460,
    srNumber: "QTE2600460",
    salesman: "Jigar Bulchandani",
    customerName: "Al Rashid Mosque",
    phone: "6474564226",
    address: "13070 113 St NW, Edmonton, Alberta",
    linearFeet: "246",
    colors: "Brown",
    total: "$5976.18",
    status: "Sent",
    installationSchedule: "Not Scheduled",
    date: "2026-01-22",
  },
  {
    id: 462,
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
    id: 461,
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
    id: 445,
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
    id: 423,
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
    id: 412,
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
    id: 398,
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
    id: 387,
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
    id: 375,
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
    id: 351,
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const uniqueSalesmen = useMemo(() => {
    return [...new Set(QuoteTableData.map((item) => item.salesman))].sort();
  }, []);

  const filteredData = useMemo(() => {
    return QuoteTableData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.srNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSalesman =
        salesmanFilter === "all" || item.salesman === salesmanFilter;
      const matchesDate = dateFilter === "" || item.date === dateFilter;
      return matchesSearch && matchesStatus && matchesSalesman && matchesDate;
    });
  }, [searchQuery, statusFilter, salesmanFilter, dateFilter]);

  const COLUMNS = [
    {
      Header: "Sr.",
      accessor: "srNumber",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-indigo-600 font-medium">{value}</span>
      ),
    },
    {
      Header: "Salesman",
      accessor: "salesman",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {value}
        </span>
      ),
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: ({ cell: { value } }) => (
        <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[180px] block">
          {value}
        </span>
      ),
    },
    {
      Header: "Linear Feet",
      accessor: "linearFeet",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Colors",
      accessor: "colors",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-green-600">{value}</span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell: { value } }) => (
        <span
          className={`inline-block text-xs px-3 py-1 rounded font-medium ${value === "Sent" ? "bg-yellow-400 text-gray-800" : "bg-gray-400 text-white"}`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Installation",
      accessor: "installationSchedule",
      Cell: ({ cell: { value } }) => (
        <span
          className={`inline-block text-xs px-3 py-1 rounded font-medium ${value === "Scheduled" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ cell: { value } }) => {
        const [year, month, day] = value.split("-");
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">{`${day}-${month}-${year}`}</span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell: { value } }) => (
        <div className="flex space-x-2 rtl:space-x-reverse justify-center">
          <button
            className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700"
            type="button"
            title="Edit"
          >
            <Icon icon="ph:pencil-line" />
          </button>

          {/* ✅ VIEW button — navigates to /quote/view_quote_admin/:id */}
          <button
            className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
            type="button"
            title="View"
            onClick={() => navigate(`/quote/view_quote_admin/${value}`)}
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
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, [filteredData]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 10 } },
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
    <Card noborder>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search:
          </label>
          <input
            type="text"
            placeholder="Search by Quote #, Customer Name, Phone, Address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Quotes</option>
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Salesman:
            </label>
            <select
              value={salesmanFilter}
              onChange={(e) => setSalesmanFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Salesmen</option>
              {uniqueSalesmen.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date:
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <Button
              text="Clear All"
              icon="ph:x"
              className="btn-outline-secondary w-full"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSalesmanFilter("all");
                setDateFilter("");
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            text="Export"
            icon="ph:download-simple"
            className="btn-warning"
          />
          <Button
            text="Add Quote"
            icon="ph:plus"
            className="btn-primary"
            onClick={() => navigate("/quote/add")}
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredData.length}</span>{" "}
          of <span className="font-semibold">{QuoteTableData.length}</span>{" "}
          quotes
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto rounded-t-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-gray-100 table-fixed dark:divide-gray-700"
                {...getTableProps()}
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
                  {...getTableBodyProps()}
                >
                  {page.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30"
                        >
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          ))}
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

        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center px-5 pb-5">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="flex space-x-2 rtl:space-x-reverse items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Go
              </span>
              <input
                type="number"
                className="text-control py-2"
                defaultValue={pageIndex + 1}
                onChange={(e) =>
                  gotoPage(e.target.value ? Number(e.target.value) - 1 : 0)
                }
                style={{ width: "50px" }}
              />
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Page {pageIndex + 1} of {pageOptions.length || 1}
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
              <button
                className={
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((pg, pageIdx) => (
              <li key={pageIdx}>
                <button
                  className={`${pageIdx === pageIndex ? "bg-indigo-500 text-white font-medium" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-900 font-normal"} text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {pg + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
              <button
                className={!canNextPage ? "opacity-50 cursor-not-allowed" : ""}
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
  );
};

export default Quote;
