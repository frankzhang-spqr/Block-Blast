import { registerServiceWorker, setupOrientationHandler } from './pwa.js';
import { createUnityLoader } from './unityLoader.js';

// Initialize PWA features
registerServiceWorker();
setupOrientationHandler();

// Initialize Unity Game
const productInfo = {
    company: "reun",
    name: "Block Blast Puzzle",
    version: "1.1"
};

const unityLoader = createUnityLoader("Build", productInfo);
unityLoader.loadGame().catch(console.error);
