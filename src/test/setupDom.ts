/**
 * jsdom không có `matchMedia`, `ResizeObserver` và `scrollIntoView`, còn antd và
 * TimetableCalendar đều cần các API này khi mount. Polyfill ở đây để mọi
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

/**
 * `scrollIntoView` chỉ chạy khi lưới thời khóa có tiết đang diễn ra, tức phụ
 * thuộc giờ thực tế. Stub rỗng giúp các file kiểm thử không phụ thuộc vào
 * khung giờ đang chạy.
 */
if (typeof Element.prototype.scrollIntoView !== "function") {
    Object.defineProperty(Element.prototype, "scrollIntoView", {
        writable: true,
        configurable: true,
        value: () => undefined,
    });
}