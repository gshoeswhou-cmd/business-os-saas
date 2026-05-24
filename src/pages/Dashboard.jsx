import StatCard from '../components/StatCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { activeBusiness } = useAuth()
  return (
    <div>
      <div className="page-heading">
        <span className="brand-pill">Dashboard</span>
        <h1>{activeBusiness?.business_name}</h1>
        <p>This is the first dashboard shell. Next we will connect orders, sales, inventory, expenses, and reports.</p>
      </div>
      <div className="stats-grid">
        <StatCard label="Today Sales" value="₱0" hint="Connect orders next" />
        <StatCard label="Orders" value="0" hint="No records yet" />
        <StatCard label="Expenses" value="₱0" hint="Track spending" />
        <StatCard label="Net Profit" value="₱0" hint="Sales - costs" />
      </div>
      <section className="panel">
        <h2>Active template</h2>
        <pre>{JSON.stringify(activeBusiness, null, 2)}</pre>
      </section>
    </div>
  )
}
