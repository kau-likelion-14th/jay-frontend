function StatCard({ stats }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{stats.icon}</span>
        <span>{stats.title}</span>
      </div>
      <p className="stat-value">{stats.statistics.value} {stats.statistics.unit}</p>
    </div>
  );
}

export default StatCard;