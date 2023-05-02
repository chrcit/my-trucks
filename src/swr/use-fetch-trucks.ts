import { z } from "zod";
import useSWR from "swr";

export type Truck = z.infer<typeof truckValidator>;

const truckValidator = z.object({
  id: z.number(),
  name: z.string(),
  position: z.array(z.number(), z.number()).transform((val) => ({
    lat: val[0],
    lng: val[1],
  })),
  positionLabel: z.string(),
  status: z.enum(["idle", "onroute"]),
});

const truckResponseValidator = z.array(truckValidator);

async function fetchTrucks() {
  const data = await fetch("https://node-challenge.functn.workers.dev/").then(
    (res) => res.json()
  );

  return truckResponseValidator.parse(data);
}

export const useFetchTrucks = () => {
  const { data, error, isLoading } = useSWR("trucks", fetchTrucks);

  return {
    trucks: data,
    isLoading,
    error,
  };
};
