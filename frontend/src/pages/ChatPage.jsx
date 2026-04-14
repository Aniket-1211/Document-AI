import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ChatPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [documentList, setDocumentList] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isAsking, setIsAsking] = useState(false);
  const [document, setDocument] = useState(null);

  const loadDocumentList = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/documents`, {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load documents.");
      }

      setDocumentList(
        (result.data || []).filter((item) => item.processingStatus === "completed")
      );
    } catch (error) {
      toast.error(error.message || "Unable to load documents.");
    }
  };

  const loadDocument = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/documents/${documentId}`, {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load document.");
      }

      setDocument(result.data);
    } catch (error) {
      toast.error(error.message || "Unable to load document.");
    }
  };

  const loadChatHistory = async () => {
    setIsChatLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/${documentId}/chats`, {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load chat history.");
      }

      setChatHistory(result.data || []);
    } catch (error) {
      toast.error(error.message || "Unable to load chat history.");
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      loadDocument();
      loadChatHistory();
    } else {
      loadDocumentList();
    }
  }, [documentId]);

  const handleAskQuestion = async (event) => {
    event.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    setIsAsking(true);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/${documentId}/ask`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to ask question.");
      }

      const newChat = {
        _id: result.data?.chatId || `${Date.now()}`,
        question: question.trim(),
        answer: result.data?.answer || "",
        sources: result.data?.sources || [],
        createdAt: new Date().toISOString(),
      };

      setChatHistory((current) => [...current, newChat]);
      setQuestion("");
    } catch (error) {
      toast.error(error.message || "Unable to ask question.");
    } finally {
      setIsAsking(false);
    }
  };

  if (!documentId) {
    return (
      <main className="relative min-h-[calc(100vh-82px)] overflow-hidden bg-slate-950">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%)]" />
        <section className="ui-container flex min-h-[calc(100vh-82px)] items-center justify-center">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
            <h1 className="mb-3 font-serif text-4xl text-white">Pick a document first</h1>
            <p className="mb-8 text-base text-slate-300">
              You need to select a document from your library to start chatting.
            </p>
            <button
              type="button"
              onClick={() => navigate("/documents")}
              className="ui-btn-primary"
            >
              Go to Documents
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-82px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%)]" />

      <section className="ui-container flex max-w-4xl flex-col">
        <div className="mb-8 text-center">
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Chat with {document?.fileName || "Document"}
          </h1>
          {document && (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
              {document.documentType?.toUpperCase()} - {document.pageCount ?? "-"} pages
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="rounded-[1.25rem] bg-slate-800/70 p-4 sm:p-5">
            {isChatLoading ? (
              <div className="rounded-2xl bg-slate-900/70 px-4 py-8 text-center text-slate-300">
                Loading chat history...
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/70 px-4 py-8 text-center">
                <p className="text-lg font-semibold text-slate-100">
                  Start the conversation
                </p>
                <p className="mt-2 text-slate-400">
                  Ask anything grounded in this document and the answer will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <article
                    key={chat._id}
                    className="rounded-[1.25rem] border border-slate-700/70 bg-slate-900/80 p-5 shadow-sm"
                  >
                    <div className="rounded-2xl bg-sky-950/40 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                        Question
                      </p>
                      <p className="mt-2 text-slate-100">{chat.question}</p>
                    </div>

                    <div className="mt-3 rounded-2xl bg-emerald-950/30 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        Answer
                      </p>
                      <div className="mt-2 leading-7 text-slate-200">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                            code: ({ node, ...props }) => <code className="rounded bg-slate-900 px-2 py-1 text-sm text-sky-100" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="mb-2 text-lg font-bold text-white" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="mb-2 text-base font-bold text-white" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="mb-1 text-sm font-bold text-white" {...props} />,
                          }}
                        >
                          {chat.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <form className="mt-6" onSubmit={handleAskQuestion}>
            <label className="block">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Ask a question
              </span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about the document..."
                rows={4}
                className="w-full rounded-[1.5rem] border border-slate-700/50 bg-slate-900/60 px-5 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/20"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Answers are generated from the uploaded document context.
              </p>
              <button
                type="submit"
                disabled={isAsking}
                className="ui-btn-primary"
              >
                {isAsking ? "Asking..." : "Send question"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
