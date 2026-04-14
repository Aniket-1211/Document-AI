import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UploadComponent from "../components/UploadComponent";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function HomePage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please choose a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);

    setIsUploading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to upload the document.");
      }

      toast.success(result.message || "Document uploaded successfully.");
      setSelectedFile(null);
      navigate("/documents");
    } catch (error) {
      toast.error(error.message || "Unable to upload the document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="ui-page">
      <div className="ui-page-glow" />

      <section className="ui-container flex flex-col items-center">
        <UploadComponent
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleFileSelect={handleFileSelect}
          handleUpload={handleUpload}
          isUploading={isUploading}
        />
      </section>
    </main>
  );
}

export default HomePage;
