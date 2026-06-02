import { useEffect, useMemo, useRef, useState } from "react";
import { searchMovies } from "../shared/api/movies";
import type { Movie } from "../shared/types/movie";



export function useMovieSearchDropdown() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);

    const searchWrapRef = useRef<HTMLDivElement | null>(null);

    const trimmedQuery = searchQuery.trim();

    const visibleResults = useMemo(() => {
        return searchResults.slice(0, 5);
    }, [searchResults]);

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
    }, [trimmedQuery]);

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
    }, []);

    function onChangeSearch(value: string) {
        setSearchQuery(value);

        if (!value.trim()) {
            setSearchResults([]);
            setSearchOpen(false);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        setSearchOpen(true);
    }

    function onFocusSearch() {
        if (searchQuery.trim()) {
            setSearchOpen(true);
        }
    }

    function clearSearch() {
        setSearchQuery("");
        setSearchResults([]);
        setSearchOpen(false);
    }

    function closeDropdown() {
        setSearchOpen(false);
    }

    return {
        searchQuery,
        searchLoading,
        searchWrapRef,
        visibleResults,
        searchOpen,
        onChangeSearch,
        onFocusSearch,
        clearSearch,
        closeDropdown,
    };
}