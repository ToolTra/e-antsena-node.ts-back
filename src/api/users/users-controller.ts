import { Request, Response, NextFunction } from "express";

// Response error helper
import ResponseError from "../../helpers/ResponseError-helper";
import UserModel from "./user-model";

// Users service
import usersService from "./users-service";

// Class for the users controller
class UsersController {

    // Gets paginated users
    async getPaginatedUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, sort_by, order } = req.query;

            // Options
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const paginatedUsers = await usersService.getPaginatedUsers(page, limit, {
                search: search as string,
                sortBy: sort_by as string,
                order: order as "asc" | "desc"
            });

            res.json(paginatedUsers);
        }
        catch (error) {
            next(error);
        }
    }


    // Gets a user
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;

            const user = await usersService.getUser(userId);

            if (!user)
                // 404 error
                return next(new ResponseError(404, `User having id = ${userId} is not found`));

            res.json(user);
        }
        catch (error) {
            next(error);
        }
    }


    // Edits a user's identity data
    async editUserIdentity(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;

            const editedUser = await usersService.editUser(userId, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
            });

            if (!editedUser)
                return next(new ResponseError(404, `User having id = ${userId} does not exist`));

            res.json(editedUser);
        }
        catch (error) {
            next(error);
        }
    }


    // Edits a user's email
    async editUserEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;

            const editedUser = await usersService.editUser(userId, {
                email: req.body.email
            });

            if (!editedUser)
                return next(new ResponseError(404, `User having id = ${userId} does not exist`));

            res.json(editedUser);
        }
        catch (error) {
            next(error);
        }
    }


    // Edits a user's password
    async editUserPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;

            const editedUser = await usersService.editUser(userId, {
                password: req.body.password
            });

            if (!editedUser)
                return next(new ResponseError(404, `User having id = ${userId} does not exist`));

            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }

}

export default new UsersController();