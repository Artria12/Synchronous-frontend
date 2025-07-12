import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "../../component/shared/Table.jsx";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";
import AdminLayout from "../../component/layout/AdminLayout";
import axios from "axios";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/users`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const mappedUsers = data.users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar, 50),
      }));

      setRows(mappedUsers);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useErrors([
    {
      isError: !!error,
      error: error,
    },
  ]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
