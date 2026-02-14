import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import clsx from "clsx";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";

// ✅ Dummy Product Data
const ProductTableData = [
  {
    id: 1,
    title: "450W",
    sku: "1",
    inventory: 280,
    price: "$45.00",
    type: "Controller",
    createdAt: "2024-05-06 18:33:23",
  },
  {
    id: 2,
    title: "Boost Box",
    sku: "BST1",
    inventory: 200,
    price: "$89.99",
    type: "Controller",
    createdAt: "2024-05-06 18:33:23",
  },
  {
    id: 3,
    title: "450W",
    sku: "Hh",
    inventory: 280,
    price: "$45.00",
    type: "Controller",
    createdAt: "2024-05-06 18:33:23",
  },
  {
    id: 9,
    title: "Boox Box",
    sku: "Boost",
    inventory: 220,
    price: "$95.50",
    type: "Controller",
    createdAt: "2025-09-25 19:17:30",
  },
  {
    id: 10,
    title: "450W with 10%",
    sku: "45010",
    inventory: 250,
    price: "$49.50",
    type: "Controller",
    createdAt: "2025-10-15 05:18:23",
  },
  {
    id: 11,
    title: "450w with 10%",
    sku: "45010b",
    inventory: 250,
    price: "$49.50",
    type: "Controller",
    createdAt: "2025-10-15 05:19:39",
  },
  {
    id: 12,
    title: "RGB LED Strip",
    sku: "RGB100",
    inventory: 150,
    price: "$29.99",
    type: "Light",
    createdAt: "2025-11-20 10:45:12",
  },
  {
    id: 13,
    title: "Smart Hub Pro",
    sku: "HUB01",
    inventory: 85,
    price: "$129.00",
    type: "Hub",
    createdAt: "2025-12-01 14:22:55",
  },
];

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, checked, onChange, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        checked={checked}
        onChange={onChange}
        className="table-checkbox"
      />
    );
  },
);

const Product = () => {
  const COLUMNS = [
    {
      Header: "Product Id",
      accessor: "id",
      Cell: (row) => {
        return <span className="font-medium">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "SKU",
      accessor: "sku",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Inventory",
      accessor: "inventory",
      Cell: (row) => {
        return <span className="text-sm font-medium">{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: (row) => {
        return (
          <span className="text-sm font-semibold text-green-600">
            {row?.cell?.value}
          </span>
        );
      },
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <Badge
              label={row?.cell?.value}
              className={clsx("border rounded-full", {
                "border-blue-500 text-blue-500":
                  row?.cell?.value === "Controller",
                "border-green-500 text-green-500": row?.cell?.value === "Light",
                "border-purple-500 text-purple-500": row?.cell?.value === "Hub",
              })}
            />
          </span>
        );
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: (row) => {
        return (
          <span className="text-xs text-gray-500 dark:text-gray-400">
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
          <div className="flex space-x-2 rtl:space-x-reverse justify-center">
            <button
              className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
              title="View"
            >
              <Icon icon="ph:eye" />
            </button>
            <button
              className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
              type="button"
              title="Edit"
            >
              <Icon icon="ph:pencil-line" />
            </button>
            <button
              className="icon-btn hover:bg-red-50 dark:hover:bg-red-900"
              type="button"
              title="Delete"
            >
              <Icon icon="ph:trash" />
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => ProductTableData, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
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
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Products List</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
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

          {/* Pagination */}
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
                  {pageIndex + 1} of {pageOptions.length}
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

export default Product;
