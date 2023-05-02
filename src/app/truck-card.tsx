import clsx from "clsx";
import { Truck } from "~/swr/use-fetch-trucks";

export const TruckCard = ({ truck }: { truck: Truck }) => {
  return (
    <article className="flex items-start flex-col gap-2">
      <h2 className="text-2xl">{truck.name}</h2>
      <div className="flex flex-row gap-4 items-center">
        <span className="text-sm bg-stone-300 px-2 py-1 font-medium rounded-md">
          {truck.positionLabel}
        </span>
        <span
          className={clsx(
            "px-2 py-1 rounded-md text-sm font-medium",
            truck.status === "idle" && "bg-stone-200",
            truck.status === "onroute" && "bg-emerald-500 text-white"
          )}
        >
          {truck.status}
        </span>
      </div>
      <div className="divide-x divide-stone-300">
        <span className="pr-2 py-1">
          <span className="font-semibold">Lat:</span>{" "}
          {truck.position.lat.toFixed(2)}
        </span>
        <span className="pl-2 py-1">
          <span className="font-semibold">Lng:</span>{" "}
          {truck.position.lng.toFixed(2)}
        </span>
      </div>
    </article>
  );
};
