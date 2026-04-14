import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getStatusIcon = (status) => {
  const icons = {
    completed: "✓",
    processing: "⟳",
    failed: "✕",
    uploaded: "↑",
  };
  return icons[status] || "•";
};

function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const loadDocuments = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/documents`, {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load documents.");
      }

      setDocuments(result.data || []);
    } catch (error) {
      toast.error(error.message || "Unable to load documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (documentId) => {
    setDeletingId(documentId);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/${documentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete the document.");
      }

      setDocuments((current) =>
        current.filter((document) => document._id !== documentId)
      );
      toast.success(result.message || "Document deleted successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to delete the document.");
    } finally {
      setDeletingId("");
    }
  };

  const filteredDocuments = documents;

  return (
    <main className="relative min-h-[calc(100vh-82px)] overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100/60">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_36%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_36%)]" />

      <section className="ui-container">
        <div className="mb-10 text-center">
          <h1 className="ui-title">Your Documents</h1>
          <p className="ui-subtitle">
            Browse your uploaded files, check status, and jump into chat.
          </p>
        </div>

        {isLoading ? (
          <div className="ui-card text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
            </div>
            <p className="font-medium text-slate-600">Loading your documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="ui-card text-center">
            <p className="text-4xl">[ ]</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">No documents yet</h3>
            <p className="mt-2 text-slate-600">
              Upload your first document to start using Doc AI.
            </p>
            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="ui-btn-primary mt-6"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((document) => (
              <article
                key={document._id}
                className="ui-card border-[#A8B383] bg-[#C3CC9B] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="line-clamp-2 text-xl font-semibold text-slate-950">
                      {document.fileName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {document.documentType?.toUpperCase() || "DOCUMENT"} -{" "}
                      {formatFileSize(document.fileSize)}
                    </p>
                  </div>
                  <span
                    className={`ui-badge ${
                      document.processingStatus === "completed"
                        ? "ui-badge-completed"
                        : document.processingStatus === "processing"
                        ? "ui-badge-processing"
                        : document.processingStatus === "failed"
                        ? "ui-badge-failed"
                        : "ui-badge-uploaded"
                    }`}
                  >
                    {getStatusIcon(document.processingStatus)} {document.processingStatus}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="ui-card-muted border border-white/80 bg-[#C3CC9B] text-center text-white">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/85">Type</p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {document.documentType?.toUpperCase() || "DOCUMENT"}
                    </p>
                  </div>
                  <div className="ui-card-muted border border-white/80 bg-[#C3CC9B] text-center text-white">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/85">Pages</p>
                    <p className="mt-1 text-base font-semibold text-white">{document.pageCount ?? "-"}</p>
                  </div>
                  <div className="ui-card-muted border border-white/80 bg-[#C3CC9B] text-center text-white">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/85">Chunks</p>
                    <p className="mt-1 text-base font-semibold text-white">{document.chunkCount ?? "-"}</p>
                  </div>
                  <div className="ui-card-muted border border-white/80 bg-[#C3CC9B] text-center text-white">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/85">Uploaded</p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {document.createdAt
                        ? new Date(document.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {document.processingStatus === "completed" ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/chat/${document._id}`)}
                      className="ui-btn-primary"
                    >
                      Chat
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleDelete(document._id)}
                    disabled={deletingId === document._id}
                    className="ui-btn-danger"
                  >
                    {deletingId === document._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DocumentsPage;
