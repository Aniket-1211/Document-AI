import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUpPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Please fill in name, email, and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiResponse = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const response = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(response.message || "Unable to create your account.");
      }

      // Explicitly log in after signup to guarantee auth cookie + user session.
      const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginResult.message ||
            "Account created, but auto-login failed. Please sign in."
        );
      }

      if (loginResult?.data) {
        localStorage.setItem("docAIUser", JSON.stringify(loginResult.data));
        window.dispatchEvent(new Event("auth-change"));
      }

      toast.success(response.message || "Account created successfully.");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/upload");
    } catch (error) {
      toast.error(error.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="ui-page">
      <div className="ui-page-glow" />

      <section className="ui-container grid min-h-[calc(100vh-82px)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <h1 className="mt-6 max-w-xl font-serif text-5xl leading-tight text-slate-950 sm:text-6xl">
            Create your workspace and turn static files into searchable answers.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Build a personal document assistant with grounded responses, source visibility, and a cleaner way to explore long files.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Organize", value: "Keep files tidy" },
              { label: "Search", value: "Ask in plain English" },
              { label: "Verify", value: "Review source excerpts" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-slate-900/5 blur-2xl" />
          <div className="ui-card relative">
            <div className="mb-8">
              <h2 className="font-serif text-3xl text-slate-950 text-center">
                Create account
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ui-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="ui-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="ui-input"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="ui-btn-primary w-full rounded-2xl py-3.5"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-slate-950 underline decoration-amber-400 decoration-2 underline-offset-4"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;
