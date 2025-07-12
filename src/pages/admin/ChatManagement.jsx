import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";
import AdminLayout from "../../component/layout/AdminLayout";
import AvatarCard from "../../component/shared/AvatarCard";
import Table from "../../component/shared/Table";
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
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/chats`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const formattedRows = data.chats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((img) => transformImage(img, 50)),
        members: i.members.map((m) => transformImage(m.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50),
        },
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("❌ Failed to fetch chats:", err);
      setError(err.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
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
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
