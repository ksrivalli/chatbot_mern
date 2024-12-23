import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
const appRouter = Router();
appRouter.use("/user", userRoutes); //domain/api/vi/user
appRouter.use("/chat", chatRoutes); //domain/api/vi/chat
export default appRouter;
//# sourceMappingURL=index.js.map