// Settings.jsx
export default function Settings() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white border border-black rounded-2xl shadow p-6 mb-8">
        <h2 className="font-bold mb-4">User Profile</h2>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Name" className="border border-black rounded px-4 py-2 focus:outline-none" />
          <input type="email" placeholder="Email" className="border border-black rounded px-4 py-2 focus:outline-none" />
          <input type="password" placeholder="Change Password" className="border border-black rounded px-4 py-2 focus:outline-none" />
        </div>
        <button className="mt-4 bg-black text-white rounded-2xl px-4 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">Save</button>
      </div>
      <div className="bg-white border border-black rounded-2xl shadow p-6">
        <h2 className="font-bold mb-4">App Settings</h2>
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold">Dark Mode</label>
          <input type="checkbox" className="accent-black w-5 h-5" />
        </div>
        <div className="flex items-center gap-4">
          <label className="font-semibold">Notifications</label>
          <input type="checkbox" className="accent-black w-5 h-5" />
        </div>
        <button className="mt-4 bg-black text-white rounded-2xl px-4 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">Save</button>
      </div>
    </div>
  );
}
