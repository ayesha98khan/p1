import { useState } from "react";
import IGShell from "../components/IGShell";
import { api, uploadFile, user } from "../lib/api";

export default function RecruiterHub() {
  const me = user();
  const [msg, setMsg] = useState("");

  const [job, setJob] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    tags: [],
  });

  const [storyFile, setStoryFile] = useState(null);
  const [caption, setCaption] = useState("");

  async function createJob() {
    try {
      if (me?.role !== "recruiter") return setMsg("Recruiters only.");
      setMsg("");
      await api("/api/jobs", { method: "POST", body: job });
      setMsg("Job posted ✅");
      setJob({ title: "", location: "", jobType: "Full-time", salary: "", description: "", tags: [] });
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function postStory() {
    try {
      if (me?.role !== "recruiter") return setMsg("Recruiters only.");
      if (!storyFile) return setMsg("Pick an image for story.");
      setMsg("Uploading story...");
      const mediaUrl = await uploadFile("/api/upload/image", storyFile);
      await api("/api/stories", { method: "POST", body: { mediaUrl, caption } });
      setMsg("Story posted ✅ (visible in feed stories)");
      setStoryFile(null);
      setCaption("");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <IGShell>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-2xl p-5 shadow-soft">
          <h2 className="text-xl font-black">Upload Job</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full border rounded-xl p-3" placeholder="Job Title" value={job.title} onChange={(e)=>setJob({...job,title:e.target.value})}/>
            <input className="w-full border rounded-xl p-3" placeholder="Location" value={job.location} onChange={(e)=>setJob({...job,location:e.target.value})}/>
            <select className="w-full border rounded-xl p-3" value={job.jobType} onChange={(e)=>setJob({...job,jobType:e.target.value})}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Remote</option>
            </select>
            <input className="w-full border rounded-xl p-3" placeholder="Salary (optional)" value={job.salary} onChange={(e)=>setJob({...job,salary:e.target.value})}/>
            <textarea className="w-full border rounded-xl p-3 min-h-[120px]" placeholder="Description" value={job.description} onChange={(e)=>setJob({...job,description:e.target.value})}/>
            <input
              className="w-full border rounded-xl p-3"
              placeholder="Tags (comma separated)"
              value={(job.tags||[]).join(", ")}
              onChange={(e)=>setJob({...job, tags: e.target.value.split(",").map(t=>t.trim()).filter(Boolean)})}
            />
            <button onClick={createJob} className="w-full py-3 rounded-xl bg-blue-600 text-white font-extrabold">
              Post Job
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-soft">
          <h2 className="text-xl font-black">Post Story (24h)</h2>
          <div className="mt-4 space-y-3">
            <input type="file" accept="image/*" onChange={(e)=>setStoryFile(e.target.files?.[0] || null)} />
            <input className="w-full border rounded-xl p-3" placeholder="Caption (optional)" value={caption} onChange={(e)=>setCaption(e.target.value)} />
            <button onClick={postStory} className="w-full py-3 rounded-xl bg-zinc-900 text-white font-extrabold">
              Post Story
            </button>
            {msg && <p className="text-sm mt-3">{msg}</p>}
          </div>
        </div>
      </div>
    </IGShell>
  );
}