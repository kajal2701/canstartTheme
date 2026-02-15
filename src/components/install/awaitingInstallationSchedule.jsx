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

// ✅ Dummy Data for Awaiting Installation Schedule
const AwaitingInstallationData = [
  {
    id: 1,
    quoteNumber: "QTE2500448",
    initial: "Jigar Bulchandani",
    customerName: "Will Rahall",
    phone: "17802711174",
    address: "12410 17a Ave SW Edmonton, Alberta",
    linearFeet: "151 ft",
    totalAmount: "$3,832.75",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 2,
    quoteNumber: "QTE2500445",
    initial: "Jigar Bulchandani",
    customerName: "Will Rahall",
    phone: "17802711174",
    address: "23 53305 Range Road 273 Spruce",
    linearFeet: "241 ft",
    totalAmount: "$5,953.33",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 3,
    quoteNumber: "QTE2500512",
    initial: "Sarah Martinez",
    customerName: "John Peterson",
    phone: "17805551234",
    address: "456 Maple Drive, Calgary, Alberta",
    linearFeet: "180 ft",
    totalAmount: "$4,250.00",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 4,
    quoteNumber: "QTE2500523",
    initial: "David Chen",
    customerName: "Emily Johnson",
    phone: "17809876543",
    address: "789 Oak Avenue, Red Deer, Alberta",
    linearFeet: "95 ft",
    totalAmount: "$2,890.50",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 5,
    quoteNumber: "QTE2500534",
    initial: "Maria Garcia",
    customerName: "Robert Williams",
    phone: "17801112222",
    address: "321 Pine Street, Lethbridge, Alberta",
    linearFeet: "210 ft",
    totalAmount: "$5,125.80",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 6,
    quoteNumber: "QTE2500545",
    initial: "Kevin Patel",
    customerName: "Lisa Anderson",
    phone: "17803334444",
    address: "654 Birch Road, Medicine Hat, Alberta",
    linearFeet: "132 ft",
    totalAmount: "$3,456.90",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 7,
    quoteNumber: "QTE2500556",
    initial: "Amanda Lee",
    customerName: "Michael Brown",
    phone: "17805556666",
    address: "987 Cedar Lane, Fort McMurray, Alberta",
    linearFeet: "275 ft",
    totalAmount: "$6,789.25",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 8,
    quoteNumber: "QTE2500567",
    initial: "Thomas Wilson",
    customerName: "Jennifer Davis",
    phone: "17807778888",
    address: "147 Elm Court, Grande Prairie, Alberta",
    linearFeet: "165 ft",
    totalAmount: "$4,012.40",
    paymentStatus: "Invoice Sent",
  },
  {
    id: 9,
    quoteNumber: "QTE2500578",
    initial: "Jessica Taylor",
    customerName: "Christopher Moore",
    phone: "17809990000",
    address: "258 Willow Way, Airdrie, Alberta",
    linearFeet: "198 ft",
    totalAmount: "$4,850.60",
    paymentStatus: "Invoice Sent",
  },
];

const AwaitingInstallationSchedule = () => {
  const COLUMNS = [
    {
      Header: "Quote #",
      accessor: "quoteNumber",
      Cell: (row) => {
        return (
          <span className="text-sm text-indigo-600 font-medium">
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
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
          <span className="inline-block bg-blue-500 text-white text-xs px-4 py-1.5 rounded font-medium">
            {row?.cell?.value}
          </span>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => AwaitingInstallationData, []);

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
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card noborder className="border-2 border-yellow-300 bg-yellow-50/30">
        {/* ✅ Header with Job Count Badge */}
        <div className="flex items-center gap-3 mb-6">
          <Icon icon="ph:clock" className="text-2xl text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Awaiting Installation Schedule
          </h2>
          <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            {data.length} Jobs
          </span>
        </div>

        {/* ✅ Header with Search */}
        <div className="md:flex justify-end items-center mb-6">
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
                            className="table-th"
                          >
                            <div className="flex items-center gap-1">
                              {column.render("Header")}
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <Icon
                                      icon="ph:caret-down"
                                      className="text-sm"
                                    />
                                  ) : (
                                    <Icon
                                      icon="ph:caret-up"
                                      className="text-sm"
                                    />
                                  )
                                ) : (
                                  <Icon
                                    icon="ph:caret-up-down"
                                    className="text-sm opacity-30"
                                  />
                                )}
                              </span>
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
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="hover:bg-yellow-50 dark:hover:bg-gray-700 hover:bg-opacity-50"
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

export default AwaitingInstallationSchedule;
