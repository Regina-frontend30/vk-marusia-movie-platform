import { useEffect, useMemo, useRef, useState } from "react";
import { searchMovies } from "../shared/api/movies";
import type { Movie } from "../shared/types/movie";

type SearchResultsLoaderArgs = {
    searchQuery: string;
    signal: AbortSignal;
    setSearchResults: React.Dispatch<React.SetStateAction<Movie[]>>;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type SearchStateSetters = {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Movie[]>>;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

async function loadSearchResults({
    searchQuery,
    signal,
    setSearchResults,
    setSearchLoading,
}: SearchResultsLoaderArgs) {
    try {
        setSearchResults(await searchMovies(searchQuery, signal));
    } catch {
        if (!signal.aborted) setSearchResults([]);
    } finally {
        if (!signal.aborted) setSearchLoading(false);
    }
}

function useSearchResults(
    trimmedQuery: string,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    useEffect(() => {
        if (!trimmedQuery) return;
        const controller = new AbortController();
        const timeoutId = window.setTimeout(
            () => void loadSearchResults({ searchQuery: trimmedQuery, signal: controller.signal, setSearchResults, setSearchLoading }),
            300
        );
        return () => { controller.abort(); window.clearTimeout(timeoutId); };
    }, [setSearchLoading, trimmedQuery]);
    return { searchResults, setSearchResults };
}

function closeSearchOnOutsideClick({
    searchWrapRef,
    setSearchOpen,
    event,
}: {
    searchWrapRef: React.RefObject<HTMLDivElement | null>;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
    event: MouseEvent;
}) {
    const searchNode = searchWrapRef.current;
    if (!searchNode || searchNode.contains(event.target as Node)) return;
    setSearchOpen(false);
}

function useCloseOnOutsideClick(
    searchWrapRef: React.RefObject<HTMLDivElement | null>,
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) =>
            closeSearchOnOutsideClick({ searchWrapRef, setSearchOpen, event });
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [searchWrapRef, setSearchOpen]);
}

function applySearchValue(args: {
    value: string;
} & SearchStateSetters) {
    args.setSearchQuery(args.value);

    if (!args.value.trim()) {
        args.setSearchResults([]);
        args.setSearchOpen(false);
        args.setSearchLoading(false);
        return;
    }

    args.setSearchLoading(true);
    args.setSearchOpen(true);
}

function createSearchChangeHandler(searchSetters: SearchStateSetters) {
    return function onChangeSearch(value: string) {
        applySearchValue({ value, ...searchSetters });
    };
}

function createSearchFocusHandler(args: {
    searchQuery: string;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return function onFocusSearch() {
        if (args.searchQuery.trim()) args.setSearchOpen(true);
    };
}

function createClearSearchHandler({
    setSearchQuery,
    setSearchResults,
    setSearchOpen,
}: Pick<SearchStateSetters, "setSearchQuery" | "setSearchResults" | "setSearchOpen">) {
    return function clearSearch() {
        setSearchQuery("");
        setSearchResults([]);
        setSearchOpen(false);
    };
}

function useSearchControls(args: {
    searchQuery: string;
} & SearchStateSetters) {
    return {
        onChangeSearch: createSearchChangeHandler(args),
        onFocusSearch: createSearchFocusHandler(args),
        clearSearch: createClearSearchHandler(args),
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
