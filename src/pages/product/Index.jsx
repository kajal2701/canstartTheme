import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import clsx from "clsx";
import DataTable from "@/components/ui/DataTable";
import { mapInventoryType } from "@/utils/mappers";
import { getProducts } from "@/services/productsService";
import { formatCurrency } from "@/utils/formatters";

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
                "border-cyan-500 text-cyan-500": row?.cell?.value === "Channel",
                "border-green-500 text-green-500": row?.cell?.value === "Light",
                "border-purple-500 text-purple-500": row?.cell?.value === "Hub",
              })}
            />
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: () => {
        return (
          <div className="flex space-x-2 rtl:space-x-reverse justify-center">
            <button
              className="icon-btn hover:bg-blue-50"
              type="button"
              title="Edit"
            >
              <Icon icon="ph:pencil-line" />
            </button>
            <button
              className="icon-btn hover:bg-red-50"
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const list = await getProducts();
        if (!mounted) return;
        const mapped = Array.isArray(list)
          ? list.map((p, idx) => ({
              id: p.product_id ?? idx + 1,
              title: p.product_title ?? "-",
              sku: p.SKU ?? "-",
              inventory: p.inventory ?? 0,
              price: formatCurrency(p.price),
              type: mapInventoryType(p.type),
            }))
          : [];
        setData(mapped);
      } catch (e) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DataTable
      title="Products List"
      columns={columns}
      data={data}
      loading={loading}
      initialPageSize={10}
    />
  );
};

export default Product;
