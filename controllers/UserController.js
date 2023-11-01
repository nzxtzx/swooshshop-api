import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const editOne = async (req, res) => {
  try {
    const editedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
      },
      { new: true }
    );

    if (!editedUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json(editedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать профиль",
    });
  }
};

export const getEditingUser = async (req, res) => {
  try {
    const user = req.params.id;
    const editingUser = await UserModel.findById(user);

    if (!editingUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const isValidPass = await bcrypt.compare(oldPassword, editingUser.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Старый пароль неверен",
      });
    }

    await UserModel.findByIdAndUpdate(user, { passwordHash: await bcrypt.hash(newPassword, 10) });

    res.json({
      message: "Пароль успешно обновлен",
      editingUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить пароль",
    });
  }
};

export const getUserAdress = async (req, res) => {
  try {
    const editingUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          address: {
            country: req.body.country,
            city: req.body.city,
            street: req.body.street,
            postalCode: req.body.postalCode,
            houseNumber: req.body.houseNumber,
          },
        },
      },
      { new: true }
    );

    if (!editingUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json(editingUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить адрес",
    });
  }
};

export const getEditedAddress = async (req, res) => {
  try {
    const editedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        address: {
          country: req.body.country,
          city: req.body.city,
          street: req.body.street,
          postalCode: req.body.postalCode,
          houseNumber: req.body.houseNumber,
        },
      },
      { new: true }
    );

    if (!editedUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json(editedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать адресс",
    });
  }
};

export const getDeleteUserAddress = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { $unset: { address: 1 } }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить адрес",
    });
  }
};
