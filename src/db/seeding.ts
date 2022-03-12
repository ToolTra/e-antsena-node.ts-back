// All models and mock data
import { UserModel, usersMock } from "../api/users";
import { ShopModel, shopsMock } from "../api/shops";
import { ShopRatingModel, shopRatingsMock } from "../api/shop_ratings";

// Seeds all tables with mock data
const seedTables = async () => {
    await UserModel.bulkCreate(usersMock);
    await ShopModel.bulkCreate(shopsMock);
    await ShopRatingModel.bulkCreate(shopRatingsMock);
}

export default seedTables;