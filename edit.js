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

var quill = new Quill("#editor", {
    placeholder: "...",
    theme: "snow",
});

var id = window.location.search.substring(1);
var title;
if (id) {
    let old_data = localStorage.getItem(id);
    title = localStorage.getItem(id + "-title");

    if (old_data === null || title === null) {
        window.location = "/";
    }
    quill.setContents(JSON.parse(old_data));
    window.document.title += " | " + title;
} else {
    window.location = "/";
}

let saveToLocalStorage = () => {
    console.log("save!");
    localStorage.setItem(id, JSON.stringify(quill.getContents()));
};
window.onbeforeunload = saveToLocalStorage;
let onChange = throttle(saveToLocalStorage, 5 * 1000);

quill.on("text-change", onChange);
