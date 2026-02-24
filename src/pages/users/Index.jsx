import { useState, useMemo, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import clsx from "clsx";
import DataTable from "@/components/ui/DataTable";
import { getUsers } from "@/services/usersService";
import { toast } from "react-toastify";

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

    // Actions are hidden for now; enable when endpoints exist
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
        const roleLabel = (val) => {
          const v = val != null ? String(val) : "";
          if (v === "1") return "Admin";
          if (v === "2") return "Installer";
          if (v === "3") return "Operations";
          if (v === "4") return "Sales";
          return "User";
        };
        const mapped = Array.isArray(list)
          ? list.map((u, idx) => ({
              id: idx + 1,
              user: {
                avatar: u.avatar ?? "",
                name:
                  [u.fname, u.lname].filter(Boolean).join(" ").trim() ||
                  u.name ||
                  u.fullName ||
                  u.username ||
                  u.email ||
                  "User",
              },
              email: u.email ?? "",
              role: roleLabel(u.role),
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
      <DataTable
        title="Users List"
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={10}
      />
    </>
  );
};

export default Users;
