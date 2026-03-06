import { useState, useMemo, useEffect, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { getCustomers, deleteCustomer } from "@/services/customersService";
import { toast } from "react-toastify";
import { buildAddressParts, AddressCell } from "@/utils/mappers.jsx";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, customerId: null, customerName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // ── Reusable load function ───────────────────────────────────────
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getCustomers();
      const mapped = Array.isArray(list)
        ? list.map((c, idx) => {
            const parts = buildAddressParts(c);
            return {
              id: c.cust_id ?? idx + 1,
              name: [c.fname, c.lname].filter(Boolean).join(" ").trim() || "Customer",
              email: c.email ?? "",
              phone: c.phone ?? "",
              ...parts,
            };
          })
        : [];
      setData(mapped);
    } catch (e) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);
  // ────────────────────────────────────────────────────────────────

  const handleDeleteClick = (customer) => {
    setDeleteModal({ open: true, customerId: customer.id, customerName: customer.name });
  };

  const handleClose = () => {
    setDeleteModal({ open: false, customerId: null, customerName: "" });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCustomer(deleteModal.customerId);
      if (result.success) {
        toast.success(result.message);
        handleClose();
        await loadCustomers();  // ← refetch list after delete
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to delete customer");
    } finally {
      setIsDeleting(false);
    }
  };

  const COLUMNS = [
    {
      Header: "Sr.",
      accessor: "id",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
      ),
    },
    {
      Header: "Customer Name",
      accessor: "name",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {value || "-"}
        </span>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value || "-"}</span>
      ),
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value || "-"}</span>
      ),
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: AddressCell,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-2 rtl:space-x-reverse justify-center">
          <button className="icon-btn hover:bg-blue-50" type="button" title="Edit"  
          onClick={() => navigate(`/customer/edit_customer/${row.original.id}`)}
          >
            <Icon icon="ph:pencil-line" />
          </button>
          <button
            className="icon-btn hover:bg-red-50"
            type="button"
            title="Delete"
            onClick={() => handleDeleteClick({ id: row.original.id, name: row.original.name })}
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
        title="Customer List"
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={10}
      />
      <ConfirmModal
        activeModal={deleteModal.open}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.customerName}
        isLoading={isDeleting}
      />
    </>
  );
};

export default Customer;