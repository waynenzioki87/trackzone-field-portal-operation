function DashboardCard({ title, value, color }) {
  return (
    <div
      className="card shadow-sm border-0"
      style={{
        borderLeft: `5px solid ${color}`,
        borderRadius: "12px",
      }}
    >
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>

        <h2
          className="fw-bold"
          style={{ color }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}

export default DashboardCard;