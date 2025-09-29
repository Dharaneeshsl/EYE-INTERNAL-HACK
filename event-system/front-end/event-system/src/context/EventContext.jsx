import { createContext, useContext, useEffect, useState } from 'react';
import { listEvents } from '../services/events';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState(() => sessionStorage.getItem('activeEventId') || '');

  useEffect(() => {
    (async () => {
      try {
        const res = await listEvents();
        const items = res.data || [];
        setEvents(items);
        if (!activeEventId && items.length > 0) setActiveEventId(items[0]._id);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (activeEventId) sessionStorage.setItem('activeEventId', activeEventId);
  }, [activeEventId]);

  return (
    <EventContext.Provider value={{ events, activeEventId, setActiveEventId }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}


