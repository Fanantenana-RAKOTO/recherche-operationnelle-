export default function ArcList({ edges }) {
  return (
    <div className="arc-list">
      {edges.length === 0 ? (
        <p className="arc-list__empty">Aucun arc pour le moment</p>
      ) : (
        edges.map((edge, i) => (
          <div key={i} className="arc-list__item">
            ({edge.from}) &rarr; ({edge.to}) = {edge.value}
          </div>
        ))
      )}
    </div>
  );
}