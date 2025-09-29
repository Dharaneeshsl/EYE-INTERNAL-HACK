import { useEffect, useState } from 'react';
import { listEvents, createEvent, updateEvent, archiveEvent } from '../services/events';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', location: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await listEvents();
      setEvents(res.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!form.name.trim()) return;
    await createEvent({ ...form });
    setShowCreate(false);
    setForm({ name: '', description: '', startDate: '', endDate: '', location: '' });
    await load();
  };

  const onArchive = async (id) => {
    await archiveEvent(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <button onClick={() => setShowCreate(true)} className="bg-black text-white border border-white rounded-xl px-4 py-2 font-semibold hover:bg-white hover:text-black transition-all">Create Event</button>
      </div>

      {showCreate && (
        <div className="bg-black border border-white rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-black border border-white rounded px-3 py-2 text-white" placeholder="Event name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
            <input className="bg-black border border-white rounded px-3 py-2 text-white" placeholder="Location" value={form.location} onChange={e=>setForm(f=>({...f, location:e.target.value}))} />
            <input className="bg-black border border-white rounded px-3 py-2 text-white" type="date" value={form.startDate} onChange={e=>setForm(f=>({...f, startDate:e.target.value}))} />
            <input className="bg-black border border-white rounded px-3 py-2 text-white" type="date" value={form.endDate} onChange={e=>setForm(f=>({...f, endDate:e.target.value}))} />
            <textarea className="md:col-span-2 bg-black border border-white rounded px-3 py-2 text-white" rows="3" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={onCreate} className="bg-black text-white border border-white rounded px-4 py-2 font-semibold hover:bg-white hover:text-black transition-all">Save</button>
            <button onClick={()=>setShowCreate(false)} className="bg-black text-white border border-white rounded px-4 py-2 font-semibold hover:bg-white hover:text-black transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-black border border-white rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left px-6 py-3 text-white">Name</th>
              <th className="text-left px-6 py-3 text-white">Dates</th>
              <th className="text-left px-6 py-3 text-white">Location</th>
              <th className="text-left px-6 py-3 text-white">Status</th>
              <th className="text-left px-6 py-3 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-white">Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-white">No events</td></tr>
            ) : (
              events.map(ev => (
                <tr key={ev._id} className="border-t border-white/20">
                  <td className="px-6 py-3 text-white font-semibold">{ev.name}</td>
                  <td className="px-6 py-3 text-white">{(ev.startDate && ev.endDate) ? `${new Date(ev.startDate).toLocaleDateString()} - ${new Date(ev.endDate).toLocaleDateString()}` : '-'}</td>
                  <td className="px-6 py-3 text-white">{ev.location || '-'}</td>
                  <td className="px-6 py-3 text-white">{ev.isActive ? 'Active' : 'Archived'}</td>
                  <td className="px-6 py-3">
                    <button onClick={()=>{ sessionStorage.setItem('activeEventId', ev._id); window.location.reload(); }} className="bg-black text-white border border-white rounded px-3 py-1 text-xs font-semibold hover:bg-white hover:text-black transition-all mr-2">Set Active</button>
                    {ev.isActive && (
                      <button onClick={()=>onArchive(ev._id)} className="bg-black text-white border border-white rounded px-3 py-1 text-xs font-semibold hover:bg-white hover:text-black transition-all">Archive</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


