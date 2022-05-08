import { checkSchema } from "express-validator";

// Express validation wrapper
import expressValidationWrapper from "../../helpers/expressValidationWrapper-helper";

// User data schema
import userSchema from "../../schemas/user-schema";

// Validates the user's identity data
const validateUserIdentityData = expressValidationWrapper(checkSchema({
    firstname: userSchema.firstname,
    lastname: userSchema.lastname,
    gender: userSchema.gender,
}));

export { validateUserIdentityData };