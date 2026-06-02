import { useEffect, useState } from "react";
import LaunchTable from "./components/LaunchTable";
import Pagination from "./components/Pagination";
import { getLaunches, getLaunchpads } from "./services/spacexApi";
import Filters from "./components/Filters";
import { exportMultipleLaunchesToPdf } from "./utils/exportPdf";

function App() {
  const [launches, setLaunches] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [sortField, setSortField] = useState("date_utc");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedLaunchId, setSelectedLaunchId] = useState(null);

  const [selectedLaunchIds, setSelectedLaunchIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const launchesData = await getLaunches();

        const launchpadsData = await getLaunchpads();

        setLaunches(launchesData);
        setLaunchpads(launchpadsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLaunches = launches.filter((launch) => {
    const launchName = launch.name.toLowerCase();
    const searchName = nameFilter.toLocaleLowerCase();

    const launchDate = launch.date_utc.slice(0, 10);

    const matchesName = launchName.includes(searchName);
    const matchDate = dateFilter ? launchDate === dateFilter : true;

    return matchesName && matchDate;
  });

  const sortedLaunches = [...filteredLaunches].sort((firstValue, lastValue) => {
    let valueFirst = firstValue[sortField];
    let valueLast = lastValue[sortField];

    if (sortField === "date_utc") {
      valueFirst = new Date(valueFirst);
      valueLast = new Date(valueLast);
    }

    if (valueFirst < valueLast) {
      return sortDirection === "asc" ? -1 : 1;
    }

    if (valueFirst > valueLast) {
      return sortDirection === "asc" ? 1 : -1;
    }

    return 0;
  });

  const totalPages = Math.ceil(filteredLaunches.length / itemsPerPage);

  const starIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = starIndex + itemsPerPage;

  const paginatedLaunches = sortedLaunches.slice(starIndex, endIndex);

  const handleClearFilters = () => {
    setNameFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  const handleSelectLaunch = (launchId) => {
    setSelectedLaunchId((currentId) =>
      currentId === launchId ? null : launchId,
    );
  };

  const handleToggleSelectLaunch = (launchId) => {
    setSelectedLaunchIds((currentIds) => {
      if (currentIds.includes(launchId)) {
        return currentIds.filter((id) => id !== launchId);
      }

      return [...currentIds, launchId];
    });
  };

  const selectedLaunches = launches.filter((launch) =>
    selectedLaunchIds.includes(launch.id),
  );

  const handlePreviosPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  if (loading) {
    return <p>Cargando lanzamientos...</p>;
  }

  if (error) {
    return <p>Error: {error} </p>;
  }

  return (
    <main>
      <h1>SpaceX Dashboard</h1>

      <p>Total de lanzamientos: {launches.length}</p>

      <Filters
        nameFilter={nameFilter}
        dateFilter={dateFilter}
        onNameChange={(value) => {
          setNameFilter(value);
          setCurrentPage(1);
        }}
        onDateChange={(value) => {
          setDateFilter(value);
          setCurrentPage(1);
        }}
        onClear={handleClearFilters}
      />

      <button
        className="pdf-button"
        disabled={selectedLaunches.length === 0}
        onClick={() =>
          exportMultipleLaunchesToPdf({
            launches: selectedLaunches,
            launchpads,
          })
        }
      >
        Exportar seleccionados ({selectedLaunches.length})
      </button>

      <LaunchTable
        launches={paginatedLaunches}
        launchpads={launchpads}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        selectedLaunchId={selectedLaunchId}
        onSelectLaunch={handleSelectLaunch}
        selectedLaunchIds={selectedLaunchIds}
        onToggleSelectLaunch={handleToggleSelectLaunch}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviosPages={handlePreviosPage}
        onNextPage={handleNextPage}
      />
    </main>
  );
}

export default App;
