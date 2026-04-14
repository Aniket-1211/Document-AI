import { useRef } from "react";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function UploadComponent({
  selectedFile,
  setSelectedFile,
  handleFileSelect,
  handleUpload,
  isUploading,
}) {
  const fileInputRef = useRef(null);

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      return;
    }

    await handleUpload(event);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="ui-card w-full max-w-3xl">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-slate-950 sm:text-4xl">
          Upload document
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Add a file and it will start processing automatically.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleUploadSubmit}>
        <label className="block cursor-pointer rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 transition hover:border-sky-300 hover:bg-white">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-3xl font-semibold text-sky-700">
              +
            </div>
            <p className="mt-5 text-xl font-semibold text-slate-900">
              {selectedFile ? selectedFile.name : "Choose a document"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              PDF, DOC, DOCX, TXT · max 10 MB.
            </p>
          </div>
        </label>

        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-slate-50 px-5 py-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-slate-700">
              {selectedFile ? selectedFile.name : "No file selected"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedFile
                ? `${formatFileSize(selectedFile.size)} ready to upload`
                : "Select a file to begin"}
            </p>
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="ui-btn-primary px-6 py-3"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadComponent;
