function throttle(callback, delay) {
    let throttleTimeout = null;
    let storedEvent = null;

    const throttledEventHandler = (event) => {
        if (event) {
            storedEvent = event;
        } else {
            storedEvent = null;
        }

        const shouldHandleEvent = !throttleTimeout;
        if (shouldHandleEvent) {
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;

                if (storedEvent || storedEvent === null) {
                    callback(storedEvent);
                    storedEvent = undefined;
                }
            }, delay);
        }
    };
    return throttledEventHandler;
}
