import handle from "./requestHandlers.js";
import start from "./server.js";
import route from "./router.js";

start(route, handle);
