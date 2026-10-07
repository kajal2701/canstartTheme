import { useState, useMemo, useEffect, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { getLeads, updateLeadStatus, deleteLead } from "@/services/leadService";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatters";
import { LEAD_STATUS_OPTIONS, LEAD_STATUS_COLORS } from "@/utils/constants";


const ManageLeads = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    leadId: null,
    leadName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusModal, setStatusModal] = useState({
    open: false,
    leadId: null,
    leadName: "",
    newStatus: "",
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getLeads();
      const mapped = Array.isArray(list)
        ? list.map((l) => ({
          id: l.lead_id,
          name: l.name || "-",
          phone: l.phone || "-",
          note: l.note || "-",
          address: l.address || "-",
          status: l.status || "New",
          created_at_formatted: formatDate(l.created_at),
          _raw: l,
        }))
        : [];
      setAllData(mapped);
    } catch (e) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredData(allData);
    } else {
      setFilteredData(allData.filter((l) => l.status === statusFilter));
    }
  }, [statusFilter, allData]);

  const handleDeleteClick = (lead) => {
    setDeleteModal({ open: true, leadId: lead.id, leadName: lead.name });
  };
  const handleCloseDelete = () => {
    setDeleteModal({ open: false, leadId: null, leadName: "" });
  };
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLead(deleteModal.leadId);
      if (result.success) {
        toast.success(result.message);
        handleCloseDelete();
        await loadLeads();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChangeClick = (lead, newStatus) => {
    setStatusModal({
      open: true,
      leadId: lead.id,
      leadName: lead.name,
      newStatus,
    });
  };

  const handleCloseStatus = () => {
    setStatusModal({ open: false, leadId: null, leadName: "", newStatus: "" });
  };

  const handleConfirmStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateLeadStatus({
        lead_id: statusModal.leadId,
        status: statusModal.newStatus,
      });
      if (result.success) {
        toast.success(result.message);
        await loadLeads();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
      handleCloseStatus();
    }
  };

  const handleAddCustomer = (lead) => {
    navigate("/customer/add", {
      state: {
        leadData: {
          lead_id: lead.id,
          name: lead.name !== "-" ? lead.name : "",
          phone: lead.phone !== "-" ? lead.phone : "",
          address: lead.address !== "-" ? lead.address : "",
        },
      },
    });
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
      Header: "Name",
      accessor: "name",
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
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      ),
    },
    {
      Header: "Note",
      accessor: "note",
      Cell: ({ cell: { value } }) => (
        <span
          className="text-sm text-gray-600 dark:text-gray-400 block max-w-[200px] truncate"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: ({ cell: { value } }) => (
        <span
          className="text-sm text-gray-600 dark:text-gray-400 block max-w-[180px] truncate"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Created",
      accessor: "created_at_formatted",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {value}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => (
        <select
          className={`text-xs font-semibold px-2 py-1 rounded-full outline-none ${LEAD_STATUS_COLORS[row.original.status] || "bg-gray-100 text-gray-600"
            }`}
          value={row.original.status}
          onChange={(e) => handleStatusChangeClick(row.original, e.target.value)}
        >
          {LEAD_STATUS_OPTIONS.filter((o) => o.value !== "All").map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-gray-800">
              {opt.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex space-x-1 rtl:space-x-reverse justify-center flex-wrap gap-1">
            <button
              className="icon-btn hover:bg-green-50"
              type="button"
              title="Add Customer"
              onClick={() => handleAddCustomer(lead)}
            >
              <Icon icon="ph:user-plus" />
            </button>

            <button
              className="icon-btn hover:bg-red-50"
              type="button"
              title="Delete"
              onClick={() => handleDeleteClick(lead)}
            >
              <Icon icon="ph:trash" />
            </button>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  const statusFilterDropdown = (
    <select
      className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      {LEAD_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <DataTable
        title="Lead / Enquiry List"
        columns={columns}
        data={filteredData}
        loading={loading}
        initialPageSize={10}
        rightHeaderContent={statusFilterDropdown}
      />

      <ConfirmModal
        activeModal={deleteModal.open}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.leadName}
        isLoading={isDeleting}
      />

      <ConfirmModal
        activeModal={statusModal.open}
        onClose={handleCloseStatus}
        onConfirm={handleConfirmStatus}
        itemName={statusModal.leadName}
        isLoading={isUpdatingStatus}
        title="Change Status Confirmation"
        actionText={`change the status to '${statusModal.newStatus}' for`}
        confirmBtnText="Confirm"
        confirmBtnLoadingText="Saving..."
        confirmBtnClass="btn-primary"
      />
    </>
  );
};

export default ManageLeads;
