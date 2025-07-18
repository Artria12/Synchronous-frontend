import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";
import { fileFormat, transformImage } from "../../lib/features";
import AdminLayout from "../../component/layout/AdminLayout";
import RenderAttachment from "../../component/shared/RenderAttachment";
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
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i, idx) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box key={idx}>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/admin/messages`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const formatted = data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50),
        },
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      }));

      setRows(formatted);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
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
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
