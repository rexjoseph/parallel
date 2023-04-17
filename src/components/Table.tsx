"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import {
  DataGrid,
  GridColumnHeaderParams,
  type GridColDef,
} from "@mui/x-data-grid";
import { ApiRequest } from "@prisma/client";
import { useTheme } from "next-themes";
import { FC } from "react";

const columnsDraft: GridColDef[] = [
  {
    field: "col1",
    headerName: "API key used",
    width: 400,
    renderHeader(params) {
      return (
        <strong className="font-semibold">{params.colDef.headerName}</strong>
      );
    },
  },
  { field: "col2", headerName: "Path", width: 250 },
  { field: "col3", headerName: "Timestamp", width: 250 },
  { field: "col4", headerName: "Duration", width: 150 },
  { field: "col5", headerName: "Status", width: 150 },
];

const columns = columnsDraft.map((col) => {
  if (col.field === "col1") {
    return col;
  }
  return {
    ...col,
    renderHeader(params: GridColumnHeaderParams<any, any, any>) {
      return (
        <strong className="font-semibold">{params.colDef.headerName}</strong>
      );
    },
  };
});

type ModifiedRequestType<K extends keyof ApiRequest> = Omit<ApiRequest, K> & {
  timestamp: string;
};
interface TableProps {
  userRequests: ModifiedRequestType<"timestamp">[];
}

const Table: FC<TableProps> = ({ userRequests }) => {
  const { theme: applicationTheme } = useTheme();
  const theme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });
  const rows = userRequests.map((request) => ({
    id: request.id,
    col1: request.usedApiKey,
    col2: request.path,
    col3: `${request.timestamp} ago`,
    col4: `${(request.duration / 1000).toFixed(1)}s`,
    col5: request.status,
  })).reverse();
  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        style={{
          backgroundColor: applicationTheme === "light" ? "white" : "#000",
          fontSize: "14px",
          fontFamily: "inherit"
        }}
        pageSizeOptions={[15]}
        disableRowSelectionOnClick
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        columns={columns}
        rows={rows}
      />
    </ThemeProvider>
  );
};

export default Table;
