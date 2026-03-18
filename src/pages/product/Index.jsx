import { useState, useMemo, useEffect, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import clsx from "clsx";
import DataTable from "@/components/ui/DataTable";
import { mapInventoryType } from "@/utils/mappers";
import { getProducts, deleteProduct } from "@/services/productsService";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, productId: null, productName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

  // ── Reusable load function ───────────────────────────────────────
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getProducts();
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
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  // ────────────────────────────────────────────────────────────────

  const handleDeleteClick = (product) => {
    setDeleteModal({ open: true, productId: product.id, productName: product.title });
  };

  const handleClose = () => {
    setDeleteModal({ open: false, productId: null, productName: "" });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(deleteModal.productId);
      if (result.success) {
        toast.success(result.message);
        handleClose();
        await loadProducts();  // ← refetch after delete
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const COLUMNS = [
    {
      Header: "Product Id",
      accessor: "id",
      Cell: (row) => <span className="font-medium">{row?.cell?.value}</span>,
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: (row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {row?.cell?.value}
        </span>
      ),
    },
    {
      Header: "SKU",
      accessor: "sku",
      Cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row?.cell?.value}
        </span>
      ),
    },
    {
      Header: "Inventory",
      accessor: "inventory",
      Cell: (row) => <span className="text-sm font-medium">{row?.cell?.value}</span>,
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: (row) => (
        <span className="text-sm font-semibold text-green-600">
          {row?.cell?.value}
        </span>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: (row) => (
        <span className="block w-full">
          <Badge
            label={row?.cell?.value}
            className={clsx("border rounded-full", {
              "border-blue-500 text-blue-500": row?.cell?.value === "Controller",
              "border-cyan-500 text-cyan-500": row?.cell?.value === "Channel",
              "border-green-500 text-green-500": row?.cell?.value === "Light",
              "border-purple-500 text-purple-500": row?.cell?.value === "Hub",
            })}
          />
        </span>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-2 rtl:space-x-reverse justify-center">
          <button className="icon-btn hover:bg-blue-50" type="button" title="Edit"
            onClick={() => navigate(`/product/edit_product/${row.original.id}`)}>
            <Icon icon="ph:pencil-line" />
          </button>
          <button
            className="icon-btn hover:bg-red-50"
            type="button"
            title="Delete"
            onClick={() => handleDeleteClick({ id: row.original.id, title: row.original.title })}
          >
            <Icon icon="ph:trash" />
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
      <DataTable
        title="Product List"
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={10}
      />
      <ConfirmModal
        activeModal={deleteModal.open}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.productName}
        isLoading={isDeleting}
      />
    </>
  );
};

export default Product;