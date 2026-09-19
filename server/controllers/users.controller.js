const users = require("../models/userSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = asyncWrapper(async (req, res) => {
  name = req.body.name;
  email = req.body.email;
  password = req.body.password;
  phone = req.body.phone;
  role = req.body.role || "user";

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await users.create({
    name: name,
    email: email,
    password: hashedPassword,
    phone: phone,
    role: role,
    avatar: req.file?.path,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: newUser,
  });
});

const login = asyncWrapper(async (req, res) => {
  email = req.body.email;
  password = req.body.password;

  const user = await users.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User does not exist",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({
      success: false,
      error: "Wrong password",
    });
  }

  const token = await jwt.sign(
    {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || DEFAULT_AVATAR,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});

const edit = asyncWrapper(async (req, res) => {
  const { userId, name, phone, email, password, role } = req.body;
  const update = {
    name,
    phone,
    email,
    role,
  };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    update.password = hashedPassword;
  }
  if (req.file) {
    update.avatar = req.file.path;
  }

  const editedUser = await users.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "User edited successfully",
    user: editedUser,
  });
});

const getUserById = asyncWrapper(async (req, res) => {
  const user = await users.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

const removeUser = asyncWrapper(async (req, res) => {
  const removedUser = await users.findByIdAndDelete(req.params.id);

  if (!removedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const Alluser = asyncWrapper(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 20;
  const search = req.query.search?.trim() || "";
  const query = {};
  // const allUsers = await users.find();

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [allUsers, totalUsers] = await Promise.all([
    users
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit),
    users.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    allUsers,
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  });
});

const getUserLocation = asyncWrapper(async (req, res) => {
  const user = await users.findById(req.params.userId).select("myAddresses");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    locations: user.myAddresses,
  });
});

const addLocation = asyncWrapper(async (req, res) => {
  const { street, city, region, userId } = req.body;
  await users.findByIdAndUpdate(
    userId,
    {
      $push: {
        myAddresses: {
          street,
          city,
          region,
        },
      },
    },
    { new: true },
  );

  return res.status(200).json({
    success: true,
  });
});

const removeLocation = asyncWrapper(async (req, res) => {
  const { userId, addressId } = req.params;
  await users.findByIdAndUpdate(
    userId,
    {
      $pull: {
        myAddresses: {
          _id: addressId,
        },
      },
    },
    { new: true },
  );

  return res.status(200).json({
    success: true,
  });
});

module.exports = {
  register,
  login,
  edit,
  getUserById,
  removeUser,
  Alluser,
  getUserLocation,
  addLocation,
  removeLocation,
};
