class UnityLoader {
    constructor(config) {
        this.container = document.querySelector("#unity-container");
        this.canvas = document.querySelector("#unity-canvas");
        this.loadingBar = document.querySelector("#unity-loading-bar");
        this.progressBarFull = document.querySelector("#unity-progress-bar-full");
        this.warningBanner = document.querySelector("#unity-warning");
        this.config = config;
    }

    showBanner(msg, type) {
        const updateBannerVisibility = () => {
            this.warningBanner.style.display = this.warningBanner.children.length ? 'block' : 'none';
        };

        const div = document.createElement('div');
        div.innerHTML = msg;
        this.warningBanner.appendChild(div);

        if (type === 'error') {
            div.style = 'background: red; padding: 10px;';
        } else if (type === 'warning') {
            div.style = 'background: yellow; padding: 10px;';
            setTimeout(() => {
                this.warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }

        updateBannerVisibility();
    }

    setupMobileDevice() {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }

    async loadGame() {
        this.setupMobileDevice();
        this.loadingBar.style.display = "block";

        try {
            if (typeof createUnityInstance === 'undefined') {
                const script = document.createElement("script");
                script.src = this.config.loaderUrl;
                await new Promise((resolve, reject) => {
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error("Failed to load Unity loader script"));
                    document.body.appendChild(script);
                });
            }

            const unityInstance = await new Promise((resolve, reject) => {
                try {
                    if (typeof createUnityInstance === 'undefined') {
                        throw new Error("Unity loader not initialized properly");
                    }
                    
                    createUnityInstance(this.canvas, this.config, (progress) => {
                        this.progressBarFull.style.width = `${100 * progress}%`;
                    }).then(instance => {
                        resolve(instance);
                    }).catch(error => {
                        reject(error);
                    });
                } catch (error) {
                    reject(error);
                }
            });

            this.loadingBar.style.display = "none";
            return unityInstance;
        } catch (error) {
            this.showBanner(error.message, 'error');
            throw error;
        }
    }
}

export function createUnityLoader(buildUrl, productInfo) {
    const config = {
        dataUrl: `${buildUrl}/BlockBlast1.1-8.data.unityweb`,
        frameworkUrl: `${buildUrl}/BlockBlast1.1-8.framework.js.unityweb`,
        codeUrl: `${buildUrl}/BlockBlast1.1-8.wasm.unityweb`,
        loaderUrl: `${buildUrl}/BlockBlast1.1-8.loader.js`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: productInfo.company,
        productName: productInfo.name,
        productVersion: productInfo.version,
        showBanner: undefined // Will be set by UnityLoader instance
    };

    const loader = new UnityLoader(config);
    config.showBanner = loader.showBanner.bind(loader);
    
    return loader;
}
