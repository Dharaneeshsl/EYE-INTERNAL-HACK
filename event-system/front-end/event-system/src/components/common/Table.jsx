// Table.jsx
export default function Table({ columns, data, actions }) {
  return (
    <table className="w-full border border-black rounded-2xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="border-b border-black px-4 py-2 text-left">{col}</th>
          ))}
          {actions && <th className="border-b border-black px-4 py-2 text-left">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="odd:bg-gray-50">
            {columns.map((col) => (
              <td key={col} className="border-b border-black px-4 py-2">{row[col]}</td>
            ))}
            {actions && <td className="border-b border-black px-4 py-2">{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
