import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");

  const databaseMaxConnectResult = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  })

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionResult.rows[0].server_version,
        max_connections: parseInt(databaseMaxConnectResult.rows[0].max_connections),
        opened_connections: databaseOpenedConnectionsResult.rows[0].count, 
      },
    },
  });
}

export default status;
