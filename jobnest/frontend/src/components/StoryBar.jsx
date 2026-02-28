export default function StoryBar({ stories = [] }) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-soft">
      <div className="flex gap-4 overflow-x-auto">
        {stories.length === 0 && <p className="text-sm text-zinc-500">No stories yet.</p>}

        {stories.map((s) => (
          <div key={s.id} className="min-w-[90px]">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500">
              <img
                className="w-full h-full rounded-full object-cover border-2 border-white"
                src={s.recruiter?.companyLogoUrl || "https://placehold.co/80x80"}
                alt=""
              />
            </div>
            <p className="text-xs mt-2 font-semibold truncate">
              {s.recruiter?.companyName || "Recruiter"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}