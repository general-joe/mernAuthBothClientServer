import { userModel } from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user function
export const updateUser = async (req, res) => {
  const { userId } = req.params; // User ID from request parameters
  const { name, email, password } = req.body; // Fields to be updated

  // Ensure at least one field is provided for the update
  if (!name && !email && !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  try {
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
      });
    }

    // Update the fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user function

export const deleteUser = async (req, res) => {
  const { userId } = req.params; // User ID from request parameters

  try {
    // Check if the user exists
    const user = await userModel.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
      });
    }

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
