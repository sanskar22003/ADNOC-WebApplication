import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
  Plus,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assets, uploadAssets } from "@/lib/api";
import { DataTableDemo } from "@/components/DataTable";
import { IconAsset } from "@tabler/icons-react";

const Assets = () => {
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // 🔑 PAGINATION STATE (ADDED — UI UNCHANGED)
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);

  // 🔑 FETCH ASSETS (PAGINATED)
  const { data: assetResponse, isLoading: isTableLoading } = useQuery({
    queryKey: ["assets", pageIndex + 1, pageSize],
    queryFn: assets,
    keepPreviousData: true,
  });

  const assetList = assetResponse?.data || [];
  const totalCount = assetResponse?.total || 0;

  // 🔑 UPLOAD MUTATION (UNCHANGED)
  const mutation = useMutation({
    mutationFn: uploadAssets,
    onSuccess: () => {
      setFile(null);
      setShowUploadModal(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  // 🔑 TABLE COLUMNS (UNCHANGED)
  const columns = [
    {
      accessorKey: "PI Tag Name",
      header: "Tag Name",
      cell: ({ row }) => (
        <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">
          {row.getValue("PI Tag Name")}
        </code>
      ),
    },
    {
      accessorKey: "Description",
      header: "Description",
    },
    {
      accessorKey: "Base Value",
      header: "Base Value",
      cell: ({ row }) => (
        <span className="font-bold">
          {row.getValue("Base Value")}
        </span>
      ),
    },
    {
      accessorKey: "Frequency",
      header: "Frequency",
    },
    {
      accessorKey: "Variance (Noise)",
      header: "Variance",
      cell: ({ row }) => row.getValue("Variance (Noise)"),
    },
  ];

  // 🔑 FILE HANDLERS (UNCHANGED)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      alert("Please select a valid Excel or CSV file");
      event.target.value = null;
      return;
    }

    setFile(selectedFile);
    mutation.reset();
  };

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    mutation.mutate(formData);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setFile(null);
    mutation.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-8 mx-auto space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Asset Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor your industrial PI Tags and sensors.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Total Assets
            </p>
            <p className="text-xl font-black text-slate-700">
              {totalCount}
            </p>
          </div> */}

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} />
            Upload Assets
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <IconAsset size={20} className="text-slate-400" />
          <h2 className="text-xl font-bold">Registered Assets</h2>
        </div>

        {isTableLoading ? (
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
            <Loader2 className="animate-spin text-slate-300" size={40} />
          </div>
        ) : (
          <DataTableDemo
            data={assetList}
            columns={columns}
            isLoading={isTableLoading}
            pagination={{
              pageIndex,
              pageSize,
              totalCount,
              setPageIndex,
              setPageSize,
            }}
          />
        )}
      </div>

      {/* UPLOAD MODAL — UNCHANGED */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-bold">Upload Assets</h3>
                <p className="text-slate-500 text-sm">
                  Import assets from spreadsheet
                </p>
              </div>
              <button onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed rounded-xl p-6"
              >
                {file ? file.name : "Click to select file"}
              </button>

              <button
                onClick={handleUpload}
                disabled={!file || mutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
              >
                {mutation.isPending ? "Uploading..." : "Upload File"}
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
