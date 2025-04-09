import dotenv from "dotenv";
import logger from "./config/logger";
import { environment } from "./utils/config";
import server from "./utils/create.server";

dotenv.config();

// Start the server
const PORT = environment.PORT || 3000;

server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
