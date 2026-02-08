/**
 * Performance Optimization Utilities
 * Debouncing, throttling, memoization, and lazy loading helpers
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

/**
 * Debounce Hook
 * Delays execution until user stops typing/interacting
 * Perfect for search inputs
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Debounced Callback Hook
 * Debounces a callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

/**
 * Throttle Hook
 * Limits execution to once per specified time period
 * Perfect for scroll/resize events
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(Date.now());

    useEffect(() => {
        if (Date.now() >= lastExecuted.current + interval) {
            lastExecuted.current = Date.now();
            setThrottledValue(value);
        } else {
            const timerId = setTimeout(() => {
                lastExecuted.current = Date.now();
                setThrottledValue(value);
            }, interval);

            return () => clearTimeout(timerId);
        }
    }, [value, interval]);

    return throttledValue;
}

/**
 * Intersection Observer Hook
 * Lazy load images and components when they enter viewport
 */
export function useIntersectionObserver(
    ref: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
): boolean {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    return isIntersecting;
}

/**
 * Lazy Load Component Hook
 * Only render component when it's visible
 */
export function useLazyLoad(threshold: number = 0.1) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isVisible = useIntersectionObserver(ref as React.RefObject<Element>, { threshold });
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (isVisible && !hasLoaded) {
            setHasLoaded(true);
        }
    }, [isVisible, hasLoaded]);

    return { ref, shouldLoad: hasLoaded };
}

/**
 * Media Query Hook
 * Responsive design helper
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

/**
 * Responsive Breakpoints
 */
export function useBreakpoint() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px)');

    return { isMobile, isTablet, isDesktop };
}

/**
 * Local Storage Hook with SSR support
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

/**
 * Previous Value Hook
 * Track previous value of a state
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

/**
 * Window Size Hook
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

/**
 * Copy to Clipboard Hook
 */
export function useCopyToClipboard() {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copy = async (text: string) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            return true;
        } catch (error) {
            console.warn('Copy failed', error);
            setCopiedText(null);
            return false;
        }
    };

    return { copiedText, copy };
}

/**
 * Async State Hook
 * Handle loading, error, and data states
 */
export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error as Error);
            setStatus('error');
            throw error;
        }
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error, isLoading: status === 'pending' };
}

/**
 * Optimistic Update Helper
 * For instant UI updates before server confirmation
 */
export function useOptimisticUpdate<T>(
    initialData: T,
    updateFn: (data: T) => Promise<T>
) {
    const [data, setData] = useState<T>(initialData);
    const [isOptimistic, setIsOptimistic] = useState(false);

    const update = async (optimisticData: T) => {
        const previousData = data;

        // Immediately update UI
        setData(optimisticData);
        setIsOptimistic(true);

        try {
            // Send to server
            const result = await updateFn(optimisticData);
            setData(result);
            setIsOptimistic(false);
            return result;
        } catch (error) {
            // Rollback on error
            setData(previousData);
            setIsOptimistic(false);
            throw error;
        }
    };

    return { data, update, isOptimistic };
}

/**
 * Memoized Computation Hook
 * Heavy computations with dependency tracking
 */
export function useMemoizedComputation<T>(
    computeFn: () => T,
    deps: React.DependencyList
): T {
    return useMemo(computeFn, deps);
}
