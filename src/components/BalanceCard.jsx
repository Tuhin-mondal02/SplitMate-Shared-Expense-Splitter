export default function BalanceCard({
  title,
  amount = 0,
  color,
  icon: Icon,
  description
}) {
  return (
    <div className="balance-card">

      <div className="card-top">
        <p>{title}</p>

        <div
          className="card-icon"
          style={{
            color: color,
            backgroundColor: `${color}15`
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>

      <h2 style={{ color }}>
        ₹{amount.toLocaleString("en-IN")}
      </h2>

      <small>{description}</small>

    </div>
  );
}