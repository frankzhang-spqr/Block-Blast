// Service Worker Registration
export function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", async () => {
            try {
                const registration = await navigator.serviceWorker.register("ServiceWorker.js");
                console.log("ServiceWorker registration successful:", registration);
            } catch (error) {
                console.error("ServiceWorker registration failed:", error);
            }
        });
    }
}

// Screen Orientation Handler
export function setupOrientationHandler() {
    window.addEventListener("orientationchange", () => {
        const orientation = window.orientation;
        
        if (orientation === 90 || orientation === -90) {
            console.warn("Landscape orientation detected");
            
            // Try to lock to portrait orientation
            if (window.screen?.orientation?.lock) {
                window.screen.orientation.lock("portrait-primary")
                    .catch(err => console.error("Failed to lock orientation:", err));
            }
        }
    });
}
