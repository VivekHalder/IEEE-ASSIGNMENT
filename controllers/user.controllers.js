import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signupUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if ([username, email, password].some((ele) => ele !== "")) {
      throw new ApiError(400, "No fields should be empty.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email address.");
    }

    const existingUser = await User.findOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists.");
    }

    const newUser = await User.create(req.body);

    if (!newUser) {
      throw new ApiError(400, "User could not be created.");
    }

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    return new ApiResponse(201, createdUser, "User created successfully.");
  } catch (error) {
    next(error);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required for login.');
  }
  
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  return new ApiResponse(200, { user }, 'Login successful.');
});

const logoutUser = asyncHandler(async (req, res, next) => {
  return new ApiResponse(200, null, 'Logout successful.');
});

export { signupUser, loginUser, logoutUser };