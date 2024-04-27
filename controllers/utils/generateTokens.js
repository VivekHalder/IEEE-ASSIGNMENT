import { User } from "../../models/users.models.js";

export const generateTokens = async (user) => {
  try {
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      throw new ApiError(404, "User not found.");
    }

    const accessToken = this.generateAccessToken();
    const refreshToken = this.generateRefreshToken();

    existingUser.refreshtoken = refreshToken;
    existingUser.save();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(`Error occured while generating the tokens.`);
    next(error);
  }
};
