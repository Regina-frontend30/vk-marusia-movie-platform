import { useEffect, useMemo, useRef, useState } from "react";
import { searchMovies } from "../shared/api/movies";
import type { Movie } from "../shared/types/movie";

function useSearchResults(
    trimmedQuery: string,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    useEffect(() => {
        if (!trimmedQuery) {
            setSearchResults([]);
            return;
        }

        const controller = new AbortController();

        const timeoutId = window.setTimeout(async () => {
            try {
                const movies = await searchMovies(
                    trimmedQuery,
                    controller.signal
                );

                setSearchResults(movies);
            } catch {
                if (!controller.signal.aborted) {
                    setSearchResults([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [setSearchLoading, trimmedQuery]);

    return { searchResults, setSearchResults };
}

function useCloseOnOutsideClick(
    searchWrapRef: React.RefObject<HTMLDivElement | null>,
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const node = searchWrapRef.current;

            if (!node) return;

            if (node.contains(event.target as Node)) return;

            setSearchOpen(false);
        }

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener(
                "click",
                handleClickOutside
            );
        };
    }, [searchWrapRef, setSearchOpen]);
}

function useSearchControls(args: {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Movie[]>>;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    function onChangeSearch(value: string) {
        args.setSearchQuery(value);

        if (!value.trim()) {
            args.setSearchResults([]);
            args.setSearchOpen(false);
            args.setSearchLoading(false);
            return;
        }

        args.setSearchLoading(true);
        args.setSearchOpen(true);
    }

    function onFocusSearch() {
        if (args.searchQuery.trim()) {
            args.setSearchOpen(true);
        }
    }

    function clearSearch() {
        args.setSearchQuery("");
        args.setSearchResults([]);
        args.setSearchOpen(false);
    }

    return {
        onChangeSearch,
        onFocusSearch,
        clearSearch,
    };
}


export function useMovieSearchDropdown() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchWrapRef = useRef<HTMLDivElement | null>(null);
    const trimmedQuery = searchQuery.trim();
    const { searchResults, setSearchResults } = useSearchResults(
        trimmedQuery,
        setSearchLoading
    );
    const searchControls = useSearchControls({ searchQuery, setSearchQuery, setSearchResults, setSearchOpen, setSearchLoading });
    const visibleResults = useMemo(() => searchResults.slice(0, 5), [searchResults]);
    useCloseOnOutsideClick(searchWrapRef, setSearchOpen);
    return { searchQuery, searchLoading, searchWrapRef, visibleResults, searchOpen, ...searchControls, closeDropdown: () => setSearchOpen(false) };
}
