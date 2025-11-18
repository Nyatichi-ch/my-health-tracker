import React from 'react';

const RecentEntriesTable = ({ entries }) => {
  return (
    <table className="table table-sm align-middle">
      <thead className="table-light">
        <tr>
          <th>Date & Time</th><th>Water</th><th>Exercise</th><th>Sugar</th>
        </tr>
      </thead>
      
      <tbody className="bg-white divide-y divide-gray-200">
        { entries.length > 0 ? (
          entries.map(entry => (
            <tr key={entry._id}>
              <td className="px-4 py-2 text-sm text-gray-600">
                {new Date(entry.createdAt).toLocaleString()}</td>
              <td>{entry.water}</td>
              <td>{entry.exercise}</td>
              <td>{entry.sugar}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="4" className="text-muted">No data yet.</td></tr>
        ) }
      </tbody>
    </table>
  );
};

export default RecentEntriesTable;
