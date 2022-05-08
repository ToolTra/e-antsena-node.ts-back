import { Router } from "express";

// Users controller
import usersController from "./users-controller";

// Middlewares
import { authRouteUser } from "../../middlewares/routeAuth-middle";

// Router app
const router = Router();


/* ROUTES ********************************************************************/

// Gets users under pagination
router.get("/", usersController.getPaginatedUsers);

// Gets a user
router.get("/:userId", usersController.getUser);

// Edits a user's identity
router.put("/:userId", authRouteUser(), usersController.editUserIdentity);

/*****************************************************************************/


export default router;