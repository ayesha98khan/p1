import { useEffect, useMemo, useState } from "react";
import IGShell from "../components/IGShell";
import MotionPage from "../components/MotionPage";
import StoryBar from "../components/StoryBar";
import JobCard from "../components/JobCard";
import { api, user } from "../lib/api";
import { Link } from "react-router-dom";

export default function Feed() {
  const me = user();
  const [stories, setStories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState("");

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [tag, setTag] = useState("");

  const tagOptions = useMemo(() => ["Internship", "Frontend", "Backend", "Design", "Remote"], []);

  useEffect(() => {
    (async () => {
      const s = await api("/api/stories", { auth: false });
      setStories(s);

      const query = new URLSearchParams({ q, location, type, tag }).toString();
      const j = await api(`/api/jobs?${query}`, { auth: false });
      setJobs(j);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function searchNow() {
    try {
      setMsg("");
      const query = new URLSearchParams({ q, location, type, tag }).toString();
      const j = await api(`/api/jobs?${query}`, { auth: false });
      setJobs(j);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function apply(jobId) {
    try {
      setMsg("");
      const fullName = prompt("Enter your full name");
      if (!fullName) return;

      await api("/api/applications", {
        method: "POST",
        body: { jobId, fullName, resumeUrl: me?.resumeUrl || "" },
      });

      setMsg("Applied ✅ Open Tracker to see status");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <IGShell>
      <MotionPage>
        <div className="space-y-5">
          <StoryBar stories={stories} />

          <div
            className="border rounded-3xl p-4 md:p-5 shadow-sm"
            style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-2xl font-black">Discover Jobs</h2>
                <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                  Search like a feed. Apply like a tap.
                </p>
              </div>

              {me?.role === "student" && (
                <Link
                  to="/applications"
                  className="px-4 py-2 rounded-full font-bold border"
                  style={{ borderColor: "rgb(var(--border))" }}
                >
                  Open Tracker →
                </Link>
              )}
            </div>

            <div className="mt-4 grid md:grid-cols-4 gap-3">
              <input
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Search title…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <input
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                placeholder="Location…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <select
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Any type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
              <select
                className="border rounded-2xl p-3 bg-transparent"
                style={{ borderColor: "rgb(var(--border))" }}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">Any tag</option>
                {tagOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={searchNow}
                className="px-5 py-2.5 rounded-2xl text-white font-extrabold"
                style={{ background: "rgb(var(--brand))" }}
              >
                Search
              </button>

              <button
                onClick={() => {
                  setQ(""); setLocation(""); setType(""); setTag("");
                  setTimeout(() => searchNow(), 0);
                }}
                className="px-4 py-2.5 rounded-2xl font-bold border"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                Reset
              </button>

              {msg && <p className="text-sm ml-auto" style={{ color: "rgb(var(--muted))" }}>{msg}</p>}
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((j) => (
              <JobCard key={j._id} job={j} canApply={me?.role === "student"} onApply={apply} />
            ))}

            {jobs.length === 0 && (
              <div
                className="border rounded-3xl p-10 text-center"
                style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
              >
                <p className="text-2xl font-black">No jobs found</p>
                <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                  Try changing filters or ask recruiters to post.
                </p>
              </div>
            )}
          </div>
        </div>
      </MotionPage>
    </IGShell>
  );
}