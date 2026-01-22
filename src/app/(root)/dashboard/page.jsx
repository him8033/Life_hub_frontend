const DashboardPage = () => {
    return (
        <div>
            <h1>Welcome to LifeHub Dashboard</h1>
            <p>This is your main dashboard. You can add widgets, charts, and other components here.</p>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Quick Stats</h3>
                    <p>Total Users: 1,234</p>
                    <p>Active Projects: 12</p>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3>Recent Activity</h3>
                    <p>No recent activity</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;