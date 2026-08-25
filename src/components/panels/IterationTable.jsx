export default function IterationTable({ history, vertices }) {
  if (!history || history.length === 0) {
    return <div className="iteration-table iteration-table--empty">Aucune iteration a afficher</div>;
  }

  const significant = history.filter((iter, i) => {
    if (i === 0) return true;
    const prev = history[i - 1].values;
    return vertices.some(v => prev[v.id] !== iter.values[v.id]);
  });

  return (
    <div className="iteration-table">
      <table>
        <thead>
          <tr>
            <th>Iteration</th>
            {vertices.map(v => <th key={v.id}>V({v.id})</th>)}
          </tr>
        </thead>
        <tbody>
          {significant.map((iter, i) => (
            <tr key={i}>
              <td>{iter.iter}</td>
              {vertices.map(v => {
                const val = iter.values[v.id];
                const display = val === Infinity ? '+inf' : val === -Infinity ? '-inf' : val.toFixed(2);
                return <td key={v.id}>{display}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}