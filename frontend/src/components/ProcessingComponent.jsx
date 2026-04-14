import { useEffect, useRef } from "react";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const statusToneClassName = {
  completed: "ui-badge-completed",
  processing: "ui-badge-processing",
  failed: "ui-badge-failed",
  uploaded: "ui-badge-uploaded",
};

function ProcessingComponent({
  documents,
  isLoading,
  loadDocuments,
  deletingId,
  handleDelete,
  navigate,
  onProcessingComplete,
}) {
  const processingRef = useRef(null);

  useEffect(() => {
    if (documents.length > 0 && processingRef.current) {
      processingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [documents.length]);

  // Check if there are any processing documents
  const hasProcessingDocs = documents.some(
    (doc) => doc.processingStatus === "processing"
  );

  // If no processing documents and callback exists, notify parent
  useEffect(() => {
    if (!hasProcessingDocs && documents.length > 0 && onProcessingComplete) {
      onProcessingComplete();
    }
  }, [hasProcessingDocs, documents.length, onProcessingComplete]);

  if (documents.length === 0) {
    return null;
  }

  return (
    <section ref={processingRef} className="mt-12 w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Processing status
          </h2>
        </div>
        <button
          type="button"
          onClick={() => loadDocuments()}
          className="ui-btn-secondary w-fit"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-[1.75rem] bg-slate-50 px-6 py-10 text-center text-slate-500">
          Loading processing information...
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <article
              key={document._id}
              className="rounded-[1.5rem] border border-slate-200/90 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="line-clamp-2 text-xl font-semibold text-slate-950">
                    {document.fileName}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {document.documentType?.toUpperCase() || "Document"} ·{' '}
                    {formatFileSize(document.fileSize)}
                  </p>
                </div>
                <span
                  className={`ui-badge ${
                    statusToneClassName[document.processingStatus] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {document.processingStatus}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Pages
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {document.pageCount ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Chunks
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {document.chunkCount ?? "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 sm:col-span-2 lg:col-span-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Uploaded
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {document.createdAt
                      ? new Date(document.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row">
                <p className="text-sm text-slate-500">
                  {document.processingStatus === "completed"
                    ? "Ready for chat"
                    : "Processing in progress..."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {document.processingStatus === "completed" ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/chat/${document._id}`)}
                      className="ui-btn bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Let&apos;s chat
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
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProcessingComponent;
