import { Request, Response, NextFunction } from "express";

// Response error helper
import ResponseError from "../../helpers/ResponseError-helper";

// Services
import authService from "./auth-service";
import { usersService } from "../users";

// Interface for the user token payload
interface UserTokenPayload {
    userId: number;
    shopId: number | null;
}

// Class for the auth controller
class AuthController {

    // User signup
    async userSignup(req: Request, res: Response, next: NextFunction) {
        try {
            // Saving the user into db
            const addeduser = await usersService.saveUser({
                firstname: req.body.firstname as string,
                lastname: req.body.lastname as string,
                gender: req.body.gender as string,
                email: req.body.email as string,
                password: req.body.password as string,
            });

            // User token payload
            const userTokenPayload: UserTokenPayload = {
                userId: addeduser.userId,
                shopId: null // User does not own any shop at the time of signup
            }
            // Getting the tokens
            const accessToken = await authService.generateUserToken(userTokenPayload, "access");
            const refreshToken = await authService.generateUserToken(userTokenPayload, "refresh");
            // Storing the refresh token
            await authService.storeRefreshToken(refreshToken);

            const responseData = {
                // Merge of the user's data with an owned shop
                user: {
                    ...addeduser,
                    shop: null // User does not own any shop by the time of signup
                },
                accessToken,
                refreshToken
            };
            // Deleting the password field for security reasons
            delete responseData.user["password"];

            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }

    // User login
    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const authUser = await usersService.findUserByEmailAndPassword(email, password);
            if (!authUser) return next(new ResponseError(400, "The email or password is wrong"));

            // Deleting the password for security purposes
            delete authUser["password"];

            /* The user needs owned shop information after login */
            const userShop = await usersService.getUserShop(authUser.userId);

            // User token payload
            const userTokenPayload: UserTokenPayload = {
                userId: authUser.userId,
                shopId: userShop?.shopId || null
            }
            // Getting the tokens
            const accessToken = await authService.generateUserToken(userTokenPayload, "access");
            const refreshToken = await authService.generateUserToken(userTokenPayload, "refresh");
            // Storing the refresh token
            await authService.storeRefreshToken(refreshToken);

            res.json({
                user: { ...authUser, shop: userShop },
                accessToken,
                refreshToken
            });
        }
        catch (error) {
            next(error);
        }
    }

}

export default new AuthController();