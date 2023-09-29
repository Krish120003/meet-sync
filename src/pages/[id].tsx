import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

const NumToMonth = (num: number) => {
  return {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  }[num];
};

// create a next page
export default function EventPage() {
  const router = useRouter();

  const { data, isLoading, isSuccess } = api.event.getEvent.useQuery(
    router.asPath.replace("/", ""),
    {
      retry: false,
    },
  );

  console.log(data, isLoading, isSuccess);

  if (isLoading) return <div>Loading...</div>;
  if (!isSuccess)
    return (
      <div>
        Something went wrong. Please try again and make sure you have the
        correct link.
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <div className="flex items-center justify-center gap-4">
        <div className="">Login Side</div>
        <div className="">
          Availability
          <div className="flex ">
            {data.dates.map((date, index) => (
              <div
                key={JSON.stringify(date)}
                className={cn(
                  "bg-secondary px-4",
                  index !== data.dates.length - 1 && "border-primary border-r",
                )}
              >
                {NumToMonth(date.getUTCMonth())} {date.getUTCDate()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
