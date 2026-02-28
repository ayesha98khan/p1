import { useEffect, useState } from "react";
import IGShell from "../components/IGShell";
import { api, uploadFile, user as getUser } from "../lib/api";

export default function Profile() {
  const [me, setMe] = useState(getUser());
  const [msg, setMsg] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    (async () => {
      const fresh = await api("/api/users/me");
      localStorage.setItem("user", JSON.stringify(fresh));
      setMe(fresh);
    })();
  }, []);

  async function save() {
    try {
      setMsg("");
      const updated = await api("/api/users/me", { method: "PUT", body: me });
      localStorage.setItem("user", JSON.stringify(updated));
      setMe(updated);
      setMsg("Saved ✅");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function uploadResume() {
    try {
      if (!resumeFile) return;
      setMsg("Uploading resume...");
      const url = await uploadFile("/api/upload/resume", resumeFile);
      setMe((m) => ({ ...m, resumeUrl: url }));
      setMsg("Resume uploaded ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function uploadLogo() {
    try {
      if (!logoFile) return;
      setMsg("Uploading logo...");
      const url = await uploadFile("/api/upload/image", logoFile);
      setMe((m) => ({ ...m, companyLogoUrl: url }));
      setMsg("Logo uploaded ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function addPhoto() {
    try {
      if (!photoFile) return;
      setMsg("Uploading photo...");
      const url = await uploadFile("/api/upload/image", photoFile);
      setMe((m) => ({ ...m, companyPhotos: [...(m.companyPhotos || []), url] }));
      setMsg("Photo added ✅ (click Save)");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <IGShell>
      <div className="bg-white border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <img
            className="w-20 h-20 rounded-full object-cover border"
            src={me.role === "recruiter" ? (me.companyLogoUrl || "https://placehold.co/120x120") : "https://placehold.co/120x120"}
            alt=""
          />
          <div className="min-w-0">
            <h2 className="text-2xl font-black truncate">
              {me.role === "recruiter" ? (me.companyName || me.name) : me.name}
            </h2>
            <p className="text-sm text-zinc-500">{me.email} • {me.role}</p>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input className="w-full border rounded-xl p-3 mt-1" value={me.name || ""} onChange={(e)=>setMe({...me,name:e.target.value})}/>
          </div>

          {me.role === "recruiter" && (
            <div>
              <label className="text-sm font-semibold">Company Name</label>
              <input className="w-full border rounded-xl p-3 mt-1" value={me.companyName || ""} onChange={(e)=>setMe({...me,companyName:e.target.value})}/>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="text-sm font-semibold">{me.role==="recruiter" ? "Company Bio" : "Bio"}</label>
            <textarea
              className="w-full border rounded-xl p-3 mt-1 min-h-[100px]"
              value={me.role==="recruiter" ? (me.companyBio||"") : (me.bio||"")}
              onChange={(e)=> me.role==="recruiter" ? setMe({...me,companyBio:e.target.value}) : setMe({...me,bio:e.target.value})}
            />
          </div>

          {me.role === "student" && (
            <>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Skills (comma separated)</label>
                <input
                  className="w-full border rounded-xl p-3 mt-1"
                  value={(me.skills || []).join(", ")}
                  onChange={(e)=>setMe({...me,skills: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Resume Upload</label>
                <div className="flex gap-2 mt-1 items-center">
                  <input type="file" onChange={(e)=>setResumeFile(e.target.files?.[0] || null)} />
                  <button className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold" onClick={uploadResume}>
                    Upload
                  </button>
                </div>
                {me.resumeUrl && <p className="text-sm mt-2 text-green-700 font-semibold">Resume linked ✅</p>}
              </div>
            </>
          )}

          {me.role === "recruiter" && (
            <>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Company Logo Upload</label>
                <div className="flex gap-2 mt-1 items-center">
                  <input type="file" accept="image/*" onChange={(e)=>setLogoFile(e.target.files?.[0] || null)} />
                  <button className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold" onClick={uploadLogo}>
                    Upload
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Company Feed Photos (Instagram grid)</label>
                <div className="flex gap-2 mt-1 items-center">
                  <input type="file" accept="image/*" onChange={(e)=>setPhotoFile(e.target.files?.[0] || null)} />
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold" onClick={addPhoto}>
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                  {(me.companyPhotos || []).map((p) => (
                    <img key={p} className="aspect-square object-cover rounded-xl border" src={p} alt="" />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={save} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold">
            Save Profile
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </div>
    </IGShell>
  );
}