import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { getCustomers } from "@/services/customersService";
import { toast } from "react-toastify";

const Customer = () => {
  const COLUMNS = [
    {
      Header: "Sr.",
      accessor: "id",
      Cell: ({ cell: { value } }) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {value}
          </span>
        );
      },
    },
    {
      Header: "Customer Name",
      accessor: "name",
      Cell: ({ cell: { value } }) => {
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {value || "-"}
          </span>
        );
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: ({ cell: { value } }) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {value || "-"}
          </span>
        );
      },
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ cell: { value } }) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {value || "-"}
          </span>
        );
      },
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: ({ row }) => {
        const o = row.original || {};
        const line1 = o.addressLine || o.address || "-";
        const line2 = [o.city, o.state, o.country].filter(Boolean).join(", ");
        return (
          <div className="max-w-[220px]">
            <div className="text-xs text-gray-700 dark:text-gray-300">
              {line1}
            </div>
            {(o.city || o.state || o.country) && (
              <div className="text-xs text-gray-500">{line2}</div>
            )}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "action",
      Cell: () => {
        return (
          <div className="flex space-x-2 rtl:space-x-reverse justify-center">
            <button className="icon-btn" type="button">
              <Icon icon="ph:pencil-line" />
            </button>
            <button className="icon-btn" type="button">
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
        const list = await getCustomers();
        console.log("customer list", list);
        if (!mounted) return;
        const mapped = Array.isArray(list)
          ? list.map((c, idx) => {
              const street =
                c.address ||
                [c.address1, c.address2].filter(Boolean).join(", ");
              const address = [street, c.city, c.state, c.country]
                .filter(Boolean)
                .join(", ");
              return {
                id: c.cust_id ?? c.customer_id ?? c.id ?? idx + 1,
                name:
                  c.name ||
                  c.customer_name ||
                  [c.fname, c.lname].filter(Boolean).join(" ").trim() ||
                  c.email ||
                  "Customer",
                email: c.email ?? "",
                phone: c.phone ?? c.mobile ?? c.contact ?? "",
                address,
                addressLine: street,
                city: c.city ?? "",
                state: c.state ?? "",
                country: c.country ?? "",
                post_code: c.post_code ?? "",
              };
            })
          : [];
        setData(mapped);
      } catch (e) {
        setError("Failed to load customers");
        toast.error("Failed to load customers");
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
        title="Customer List"
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={10}
      />
    </>
  );
};

export default Customer;
