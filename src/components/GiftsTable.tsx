import { useEffect, useState } from "react";
import type { Gift, GiftProps } from "@models/type";
import { InfoAccordion } from "./InfoAccordion";
import { Banner } from "./Banner";
import { ASSIGNEES } from "@consts";

interface GiftTableProps extends GiftProps {}

const GiftsTable = ({ admin }: GiftTableProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [originalGifts, setOriginalGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [updatedGifts, setUpdatedGifts] = useState<{ [id: number]: Gift }>({});
  const [filterQuery, setFilterQuery] = useState<string>("");
  const cols = ["Id", "Name", "Bought", "Assignee", "URL", "Notes"];

  const deleteGiftHandler = async (giftId: number) => {
    // TODO: Refactor this to remove the unnecessary response body
    const parsedGiftId = giftId.toString();
    try {
      await fetch(`/api/gifts/delete-gift/${parsedGiftId}`, {
        method: "DELETE",
        body: new URLSearchParams(parsedGiftId),
      });
      setAlertMessage(`Gift Id: ${giftId} successfully deleted.`);
    } catch (error) {
      console.log("Error deleting gift");
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterQuery(event.target.value);
  };

  // Filtered users based on search query
  const filteredGifts = gifts.filter(
    (gift) =>
      filterQuery === "" ||
      gift.assignee.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  const updateGift = (id: number, field: keyof Gift, value: string) => {
    setGifts((prev) =>
      prev.map((gift) => {
        if (gift.id === id) {
          const updatedGift = { ...gift, [field]: value };

          // Save the full updated gift in updatedGifts hashmap
          setUpdatedGifts((prevUpdates) => {
            const origGift = originalGifts.find((g) => g.id === id);
            if (!origGift) return prevUpdates;

            const isDifferent =
              JSON.stringify(origGift) !== JSON.stringify(updatedGift);

            if (isDifferent) {
              return { ...prevUpdates, [id]: updatedGift };
            } else {
              // remove if user reverted change
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [id]: _, ...rest } = prevUpdates;
              return rest;
            }
          });
          return updatedGift;
        }
        return gift;
      }),
    );
  };

  const handleSubmit = async () => {
    if (
      sessionStartTime &&
      Date.now() - sessionStartTime > 3 * 60 * 60 * 1000
    ) {
      setAlertMessage(
        "session expired, you must refresh the page and reapply your changes.",
      );
      return;
    }
    const updatesArray = Object.values(updatedGifts);
    if (updatesArray.length === 0) return;

    try {
      const response = await fetch("/api/gifts/batch-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatesArray),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setUpdatedGifts({});
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  useEffect(() => {
    fetch("/api/gifts/data")
      .then((response) => response.json())
      .then((data) => {
        setGifts(data.body); // Set the fetched data to state
        setOriginalGifts(data.body);
        setLoading(false); // Set loading to false after data is fetched
        setSessionStartTime(Date.now());
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto px-12 -mt-8">
      {alertMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Alert! </strong>
          <span className="block sm:inline">{alertMessage}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setAlertMessage(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      <div className="flex items-center justify-end gap-3 mb-4">
        <label
          htmlFor="assignee-filter"
          className="font-medium text-stone-700 dark:text-stone-300"
        >
          Filter by Assignee:
        </label>
        <select
          id="assignee-filter"
          name="assignee-filter"
          onChange={(e) => handleFilterChange(e)}
          className="border border-black/15 dark:border-stone-600 rounded-md dark:bg-stone-700 py-1 px-2 transition"
        >
          <option value="">All</option>
          {ASSIGNEES.map((val) => (
            <option key={`filter-${val}`} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
      <Banner isVisible={Object.keys(updatedGifts).length > 0} />
      <table className="table">
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col} className="text-lg">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterQuery.length > 0
            ? filteredGifts.map((gift) => (
                <tr key={gift.id}>
                  <td className="px-4 py-2">{gift.id}</td>
                  <td className="px-4 py-2">{gift.name}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      id={`bought-${gift.id}`}
                      name="bought"
                      checked={gift.bought === "Yes"}
                      onChange={(e) =>
                        updateGift(
                          gift.id,
                          "bought",
                          e.target.checked ? "Yes" : "No",
                        )
                      }
                      className="w-5 h-5 accent-stone-700"
                    />
                  </td>
                  <td>
                    <select
                      className="border border-black/15 dark:border-stone-600 rounded-lg dark:bg-stone-700 py-1 px-2"
                      defaultValue={gift.assignee}
                      name="assignee"
                      onChange={(e) =>
                        updateGift(gift.id, "assignee", e.target.value)
                      }
                    >
                      {ASSIGNEES.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="max-w-sm overflow-hidden truncate">
                    <a
                      href={gift.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {gift.link}
                    </a>
                  </td>
                  <td>{gift.notes}</td>
                  {admin ? (
                    <button
                      className="flex py-4 pr-2"
                      id={`delete-gift-${gift.id}`}
                      onClick={() => deleteGiftHandler(gift.id)}
                    >
                      [X]
                    </button>
                  ) : null}
                </tr>
              ))
            : gifts.map((gift) => (
                <tr
                  key={gift.id}
                  className={
                    updatedGifts[gift.id]
                      ? "dark:bg-stone-600 bg-stone-200"
                      : ""
                  }
                >
                  <td>{gift.id}</td>
                  <td>{gift.name}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      id={`bought-${gift.id}`}
                      name="bought"
                      checked={gift.bought === "Yes"}
                      onChange={(e) =>
                        updateGift(
                          gift.id,
                          "bought",
                          e.target.checked ? "Yes" : "No",
                        )
                      }
                      className="w-5 h-5 accent-stone-700"
                    />
                  </td>
                  <td>
                    <select
                      className="border border-black/15 dark:border-stone-600 rounded-lg dark:bg-stone-700 py-1 px-2"
                      defaultValue={gift.assignee}
                      name="assignee"
                      onChange={(e) =>
                        updateGift(gift.id, "assignee", e.target.value)
                      }
                    >
                      {ASSIGNEES.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="max-w-sm overflow-hidden truncate">
                    <a
                      href={gift.link}
                      className=""
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {gift.link}
                    </a>
                  </td>
                  <td>{gift.notes}</td>
                  {admin ? (
                    <td>
                      <button
                        className="flex py-4 pr-2"
                        id={`delete-gift-${gift.id}`}
                        onClick={() => deleteGiftHandler(gift.id)}
                      >
                        [X]
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
        </tbody>
      </table>
      {Object.keys(updatedGifts).length > 0 && (
        <div className="flex justify-end">
          <button
            id="submit-btn"
            className="mt-8 relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            onClick={handleSubmit}
          >
            {Object.keys(updatedGifts).length === 1
              ? `Update ${Object.keys(updatedGifts).length} Record`
              : `Update ${Object.keys(updatedGifts).length} Records`}
          </button>
        </div>
      )}
      <InfoAccordion />
    </div>
  );
};

export default GiftsTable;
