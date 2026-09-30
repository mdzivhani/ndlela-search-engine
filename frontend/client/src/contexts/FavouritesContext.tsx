import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "../utils/apiClient";
interface FavouritesContextType {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  count: number;
}
const Context = createContext<FavouritesContextType | undefined>(undefined);
const key = "ndlela_favourites_ids";
function guestIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
export function FavouritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth(),
    [ids, setIds] = useState<string[]>(guestIds),
    [error, setError] = useState("");
  const currentUser = useRef(user?.id);
  currentUser.current = user?.id;
  useEffect(() => {
    let active = true;
    setError("");
    if (!user) {
      setIds(guestIds());
      return;
    }
    const sync = async () => {
      try {
        const guest = guestIds();
        await Promise.all(
          guest.map((id) => apiClient.put("/favourites/" + id, {})),
        );
        const saved = await apiClient.get<string[]>("/favourites");
        if (active) {
          setIds(saved);
          localStorage.removeItem(key);
        }
      } catch {
        if (active) setError("Could not sync saved places. Please try again.");
      }
    };
    sync();
    return () => {
      active = false;
    };
  }, [user?.id]);
  const change = (id: string, add: boolean) => {
    const updated = add
      ? Array.from(new Set([...ids, id]))
      : ids.filter((v) => v !== id);
    if (!user) {
      setIds(updated);
      localStorage.setItem(key, JSON.stringify(updated));
      return;
    }
    const owner = user.id;
    const request = add
      ? apiClient.put("/favourites/" + id, {})
      : apiClient.delete("/favourites/" + id);
    request
      .then(() => {
        if (currentUser.current === owner) {
          setIds((previous) =>
            add
              ? Array.from(new Set([...previous, id]))
              : previous.filter((v) => v !== id),
          );
          setError("");
        }
      })
      .catch(() => setError("Could not save this change. Please try again."));
  };
  return (
    <Context.Provider
      value={{
        ids,
        add: (id) => change(id, true),
        remove: (id) => change(id, false),
        has: (id) => ids.includes(id),
        count: ids.length,
      }}
    >
      {error && (
        <div className="notice" role="alert">
          {error}
          <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}
      {children}
    </Context.Provider>
  );
}
export function useFavourites() {
  const value = useContext(Context);
  if (!value)
    throw new Error("useFavourites must be used within a FavouritesProvider");
  return value;
}
