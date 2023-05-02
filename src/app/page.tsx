"use client";

import clsx from "clsx";
import { LoadingSpiner } from "./ui/loading-spinner";
import { useFetchTrucks } from "~/swr/use-fetch-trucks";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TruckCard } from "./truck-card";
import dynamic from "next/dynamic";

const ClientOnlyTruckMap = dynamic(
  () => import("./truck-map").then((mod) => mod.TruckMap),
  { ssr: false, loading: () => <LoadingSpiner size={30} /> }
);

export default function Home() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTruckId, setActiveTruckId] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { trucks, error, isLoading } = useFetchTrucks();

  const [statusOptions, locationOptions] = useMemo(() => {
    if (!trucks) return [[], []];

    const statusOptions = Array.from(
      new Set(trucks.map((truck) => truck.status))
    );
    const locationOptions = Array.from(
      new Set(trucks.map((truck) => truck.positionLabel))
    );

    return [statusOptions, locationOptions];
  }, [trucks]);

  const filteredTrucks = useMemo(() => {
    return trucks?.filter((truck) => {
      const statusMatch =
        statusFilter === "all" || truck.status === statusFilter;
      const locationMatch =
        locationFilter === "all" || truck.positionLabel === locationFilter;

      const lowerCasedSearchFilter = searchFilter.toLocaleLowerCase();
      const searchMatch =
        searchFilter === "" ||
        truck.name.toLocaleLowerCase().includes(lowerCasedSearchFilter) ||
        truck.positionLabel
          .toLocaleLowerCase()
          .includes(lowerCasedSearchFilter);

      return statusMatch && locationMatch && searchMatch;
    });
  }, [trucks, statusFilter, locationFilter, searchFilter]);

  console.log(activeTruckId);

  return (
    <div className="flex flex-col gap-10">
      <header
        className="flex flex-col gap-5 justify-between md:flex-row items-center"
        aria-label="Search and Filters"
      >
        <div className="flex flex-col gap-5 w-full md:flex-row">
          <label className="flex flex-col gap-1" htmlFor="search">
            <span className="text-sm underline">Search:</span>
            <input
              id="search"
              type="search"
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
              placeholder="Search by name or location"
              className="py-2 px-4 border border-stone-200 rounded-md max-w-full w-full md:w-[300px]"
            />
          </label>

          <label className="flex flex-col gap-1" htmlFor="status">
            <span className="text-sm underline">Status:</span>
            <div className="relative">
              <select
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                }}
                name="status"
                className="py-2 px-4 w-full md:w-[150px] border border-stone-200 rounded-md appearance-none"
              >
                <option value="all">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </label>

          <label className="flex flex-col gap-1" htmlFor="location">
            <span className="text-sm underline">Location:</span>
            <div className="relative">
              <select
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                }}
                className="py-2 px-4 w-full md:w-[150px] border border-stone-200 rounded-md appearance-none"
                name="location"
              >
                <option value="all">All</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </label>
        </div>

        <button
          className="py-2 px-4 w-full md:w-fit border border-stone-200 active:scale-95 no-touch:hover:bg-stone-200 transition-all rounded-md"
          onClick={(e) => {
            setShowMap((prev) => !prev);
          }}
        >
          {showMap ? <span>Hide&nbsp;Map</span> : <span>Show&nbsp;Map</span>}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        <div
          className={clsx(
            showMap ? "w-full lg:w-1/3 order-2 lg:order-1" : "w-full"
          )}
        >
          {isLoading ||
          error ||
          !filteredTrucks ||
          filteredTrucks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              {isLoading && <LoadingSpiner size={50} />}
              {error && (
                <p className="text-red-500 text-lg font-semibold">
                  An error occured while fetching trucks <br />
                  Error: {error}
                </p>
              )}
              {!isLoading &&
                !error &&
                filteredTrucks?.length === 0 &&
                "No trucks found"}
            </div>
          ) : (
            <ul
              aria-label="Trucks List"
              className={clsx(
                showMap
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex flex-col gap-7"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredTrucks?.map((truck) => (
                  <motion.li
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.3 },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                      transition: { duration: 0 },
                    }}
                    className={clsx(
                      "rounded-md shadow-md border border-stone-100 shadow-stone-200 p-5",
                      activeTruckId === truck.id && "bg-stone-100"
                    )}
                    key={truck.id}
                  >
                    <button
                      className="appearance-none w-full h-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMap(true);
                        setActiveTruckId((prev) =>
                          truck.id === prev ? null : truck.id
                        );
                      }}
                    >
                      <TruckCard truck={truck} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {showMap && (
          <section
            aria-label="Map"
            className="h-[300px] md:h-[700px] max-h-screen w-full lg:w-2/3 order-1 lg:order-2 overflow-clip bg-stone-100 shadow-md shaodw-stone-200 sticky top-0 z-50 items-center justify-center flex"
          >
            <ClientOnlyTruckMap
              activeTruckId={activeTruckId}
              onMarkerClick={(truckId) => {
                setActiveTruckId((prev) => (truckId === prev ? null : truckId));
              }}
              onPopupClose={(truckId) => {
                console.log("popup close", truckId);
                setActiveTruckId((prev) => (truckId === prev ? null : prev));
              }}
              trucks={filteredTrucks ?? []}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export const config = {
  runtime: "edge",
};
