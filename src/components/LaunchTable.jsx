import LaunchMap from "./LaunchMap";
import { exportLaunchToPdf } from "../utils/exportPdf";

function LaunchTable({
  launches,
  launchpads,
  onSort,
  sortField,
  sortDirection,
  selectedLaunchId,
  onSelectLaunch,
  selectedLaunchIds,
  onToggleSelectLaunch,
}) {
  const getLaunchpadName = (launchpadId) => {
    const launchpad = launchpads.find(
      (launchpad) => launchpad.id === launchpadId,
    );
    return launchpad ? launchpad.full_name : "Sin ubicación";
  };

  const getStatus = (success) => {
    if (success === null) return "Pendiente";

    return success ? "Exitoso" : "Fallido";
  };

  const getLaunchpad = (launchpadId) => {
    return launchpads.find((launchpad) => launchpad.id === launchpadId);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Seleccionar</th>
          <th onClick={() => onSort("name")}>
            Nombre{" "}
            {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
          </th>
          <th onClick={() => onSort("date_utc")}>
            Fecha{" "}
            {sortField === "date_utc"
              ? sortDirection === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th onClick={() => onSort("success")}>
            Estado{" "}
            {sortField === "success"
              ? sortDirection === "asc"
                ? "↑"
                : "↓"
              : ""}
          </th>
          <th>Ubicación</th>
        </tr>
      </thead>

      <tbody>
        {launches.map((launch) => (
          <>
            <tr
              key={launch.id}
              onClick={() => onSelectLaunch(launch.id)}
              className="clickable-row"
            >
              <td onClick={(event) => event.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedLaunchIds.includes(launch.id)}
                  onChange={() => onToggleSelectLaunch(launch.id)}
                />
              </td>
              <td> {launch.name} </td>
              <td>{new Date(launch.date_utc).toLocaleDateString("es-MX")}</td>
              <td> {getStatus(launch.success)} </td>
              <td> {getLaunchpadName(launch.launchpad)} </td>
            </tr>
            {selectedLaunchId === launch.id && (
              <tr>
                <td colSpan="5">
                  <div className="launch-detail-card">
                    <h3>{launch.name}</h3>

                    {launch.links?.patch?.small && (
                      <img
                        src={launch.links.patch.small}
                        alt={`Logo de ${launch.name}`}
                        className="launch-image"
                      />
                    )}

                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(launch.date_utc).toLocaleString("es-MX")}
                    </p>

                    <p>
                      <strong>Estado:</strong> {getStatus(launch.success)}
                    </p>

                    <p>
                      <strong>Ubicación:</strong>{" "}
                      {getLaunchpadName(launch.launchpad)}
                    </p>

                    <p>
                      <strong>Vuelo número:</strong> {launch.flight_number}
                    </p>

                    <p>
                      <strong>Detalles:</strong>{" "}
                      {launch.details || "Sin detalles disponibles"}
                    </p>

                    <button
                      className="pdf-button"
                      onClick={async () =>
                        await exportLaunchToPdf({
                          launch,
                          launchpad: getLaunchpad(launch.launchpad),
                        })
                      }
                    >
                      Exportar PDF
                    </button>

                    <LaunchMap launchpad={getLaunchpad(launch.launchpad)} />

                    {launch.links?.webcast && (
                      <a href={launch.links.webcast} target="_blank">
                        Ver transmisión
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
}

export default LaunchTable;
