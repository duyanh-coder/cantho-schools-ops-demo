/**
 * jsdom không có `matchMedia` và `ResizeObserver`, còn antd và
 * TimetableCalendar đều cần hai API này khi mount. Polyfill ở đây để mọi
 * file kiểm thử render dùng chung.
 */

class ResizeObserverStub {
    observe() {
        return undefined;
    }

    unobserve() {
        return undefined;
    }

    disconnect() {
        return undefined;
    }
}

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    }),
});

Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserverStub,
});

Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    value: ResizeObserverStub,
});