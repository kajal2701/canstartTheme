import { useState, useMemo, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import clsx from "clsx";
import DataTable from "@/components/ui/DataTable";
import { getUsers } from "@/services/usersService";
import { toast } from "react-toastify";
import { mapUserRole } from "@/utils/mappers";
import LoadingIcon from "@/components/LoadingIcon";

const Users = () => {
  const COLUMNS = [
    {
      Header: "User",
      id: "userName",
      accessor: (row) => row?.user?.name || "",
      Cell: ({ value }) => {
        return (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {value}
            </span>
          </div>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (row) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row?.cell?.value || "-"}
          </span>
        );
      },
    },

    {
      Header: "Role",
      accessor: "role",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <Badge
              label={row?.cell?.value}
              className={clsx(" border rounded-full ", {
                "border-green-500 text-green-500": row?.cell?.value === "Admin",
                "border-indigo-500 text-indigo-500":
                  row?.cell?.value === "Installer",
                "border-fuchsia-500 text-fuchsia-500":
                  row?.cell?.value === "Operations",
                "border-cyan-500 text-cyan-500": row?.cell?.value === "Sales",
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
        const list = await getUsers();
        if (!mounted) return;
        const mapped = Array.isArray(list)
          ? list.map((u, idx) => ({
              id: idx + 1,
              user: {
                avatar: u.avatar ?? "",
                name:
                  [u.fname, u.lname].filter(Boolean).join(" ").trim() || "User",
              },
              email: u.email ?? "",
              role: mapUserRole(u.role),
            }))
          : [];
        setData(mapped);
      } catch (e) {
        setError("Failed to load users");
        toast.error("Failed to load users");
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
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingIcon className="h-12 w-12 text-indigo-500" />
        </div>
      ) : (
        <DataTable
          title="Users List"
          columns={columns}
          data={data}
          loading={loading}
          initialPageSize={10}
        />
      )}
    </>
  );
};

export default Users;
