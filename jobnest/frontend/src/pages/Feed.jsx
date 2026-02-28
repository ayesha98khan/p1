import { useEffect, useMemo, useState } from "react";
import IGShell from "../components/IGShell";
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

  async function load() {
    const s = await api("/api/stories", { auth: false });
    setStories(s);

    const query = new URLSearchParams({ q, location, type, tag }).toString();
    const j = await api(`/api/jobs?${query}`, { auth: false });
    setJobs(j);
  }

  useEffect(() => { load(); }, []);

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

      setMsg("Applied ✅ Check Application Tracker");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <IGShell>
      <StoryBar stories={stories} />

      <div className="mt-4 bg-white border rounded-2xl p-4 shadow-soft">
        <div className="grid md:grid-cols-4 gap-3">
          <input className="border rounded-xl p-3" placeholder="Search job title…" value={q} onChange={(e)=>setQ(e.target.value)} />
          <input className="border rounded-xl p-3" placeholder="Location…" value={location} onChange={(e)=>setLocation(e.target.value)} />

          <select className="border rounded-xl p-3" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="">Any type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          <select className="border rounded-xl p-3" value={tag} onChange={(e)=>setTag(e.target.value)}>
            <option value="">Any tag</option>
            {tagOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button onClick={searchNow} className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold">
            Search / Filter
          </button>

          {me?.role === "student" && (
            <Link to="/applications" className="text-blue-600 font-semibold">
              Open Tracker →
            </Link>
          )}
        </div>

        {msg && <p className="text-sm mt-3">{msg}</p>}
      </div>

      <div className="mt-4 space-y-4">
        {jobs.map((j) => (
          <JobCard
            key={j._id}
            job={j}
            canApply={me?.role === "student"}
            onApply={apply}
          />
        ))}
        {jobs.length === 0 && <p className="text-zinc-500">No jobs found.</p>}
      </div>
    </IGShell>
  );
}