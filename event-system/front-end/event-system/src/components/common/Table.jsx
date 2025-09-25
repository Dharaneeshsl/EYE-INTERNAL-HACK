// Table.jsx
export default function Table({ columns, data, actions }) {
  return (
    <table className="w-full border border-gray-800 rounded-2xl overflow-hidden text-white bg-black">
      <thead className="bg-zinc-900">
        <tr>
          {columns.map((col) => (
            <th key={col} className="border-b border-gray-800 px-4 py-2 text-left text-gray-300">{col}</th>
          ))}
          {actions && <th className="border-b border-gray-800 px-4 py-2 text-left text-gray-300">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="odd:bg-zinc-950">
            {columns.map((col) => (
              <td key={col} className="border-b border-gray-800 px-4 py-2">{row[col]}</td>
            ))}
            {actions && <td className="border-b border-gray-800 px-4 py-2">{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
