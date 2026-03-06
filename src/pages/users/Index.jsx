import { useState, useMemo, useEffect, useCallback } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import clsx from "clsx";
import DataTable from "@/components/ui/DataTable";
import { getUsers, deleteUser } from "@/services/usersService";
import { toast } from "react-toastify";
import { mapUserRole } from "@/utils/mappers";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, userName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // ── Extracted as reusable function ──────────────────────────────
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getUsers();
      const mapped = Array.isArray(list)
        ? list.map((u, idx) => ({
          id: u.user_id ?? idx + 1,
          user: {
            avatar: u.avatar ?? "",
            name: [u.fname, u.lname].filter(Boolean).join(" ").trim() || "User",
          },
          email: u.email ?? "",
          role: mapUserRole(u.role),
        }))
        : [];
      setData(mapped);
    } catch (e) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  // ────────────────────────────────────────────────────────────────

  const handleDeleteClick = (user) => {
    setDeleteModal({ open: true, userId: user.id, userName: user.name });
  };

  const handleClose = () => {
    setDeleteModal({ open: false, userId: null, userName: "" });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUser(deleteModal.userId);
      if (result.success) {
        toast.success(result.message);
        handleClose();
        await loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const COLUMNS = [
    {
      Header: "User",
      id: "userName",
      accessor: (row) => row?.user?.name || "",
      Cell: ({ value }) => (
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
            {value}
          </span>
        </div>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row?.cell?.value || "-"}
        </span>
      ),
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: (row) => (
        <span className="block w-full">
          <Badge
            label={row?.cell?.value}
            className={clsx("border rounded-full", {
              "border-green-500 text-green-500": row?.cell?.value === "Admin",
              "border-indigo-500 text-indigo-500": row?.cell?.value === "Installer",
              "border-fuchsia-500 text-fuchsia-500": row?.cell?.value === "Operations",
              "border-cyan-500 text-cyan-500": row?.cell?.value === "Sales",
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
            onClick={() => navigate(`/users/edit_user/${row.original.id}`)}>
            <Icon icon="ph:pencil-line" />
          </button>
          <button
            className="icon-btn hover:bg-red-50"
            type="button"
            title="Delete"
            onClick={() => handleDeleteClick({ id: row.original.id, name: row.original.user.name })}
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
        title="Users List"
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={10}
      />
      <ConfirmModal
        activeModal={deleteModal.open}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.userName}
        isLoading={isDeleting}
      />
    </>
  );
};

export default Users;