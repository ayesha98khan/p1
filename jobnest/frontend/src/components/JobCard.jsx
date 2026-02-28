export default function JobCard({ job, onApply, canApply }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-soft">
      <div className="p-4 flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={job.company?.companyLogoUrl || "https://placehold.co/80x80"}
          alt=""
        />
        <div className="min-w-0">
          <p className="font-bold truncate">{job.company?.companyName || "Company"}</p>
          <p className="text-xs text-zinc-500 truncate">
            {job.location} • {job.jobType}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-lg font-black">{job.title}</h3>
        <p className="text-sm text-zinc-700 mt-2 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {(job.tags || []).map((t) => (
            <span key={t} className="text-xs font-semibold px-2 py-1 rounded-full bg-zinc-100">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {canApply && (
            <button
              onClick={() => onApply(job._id)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold"
            >
              Apply
            </button>
          )}
          <button className="px-4 py-2 rounded-xl bg-zinc-100 font-semibold">
            Save (later)
          </button>
        </div>
      </div>
    </div>
  );
}