import { Router } from "express";
import UserService from "../services/UserService.js";
import NumberMiddleware from "../middlewares/number.middleware.js";
import UserMiddleware from "../middlewares/user.middleware.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", async (req, res) => {
  const response = await UserService.createUser(req);
  res.status(response.code).json(response.message);
});

router.post('/bulkCreate', [AuthMiddleware.validateToken], async (req, res) => {
  const users = req.body;
  if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Request body must be an array of users' });
  }
  const response = await UserService.bulkCreate(users);
  res.status(response.code).json(response.message);
});

router.get("/getAllUsers", [AuthMiddleware.validateToken], async (req, res) => {
  const response = await UserService.getAllUsers();
  res.status(response.code).json(response.message);
  }
);

router.get('/findUsers', [AuthMiddleware.validateToken], async (req, res) => {
  const { deleted, name, loginBefore, loginAfter } = req.query;
  const response = await UserService.findUsers({ deleted, name, loginBefore, loginAfter });
  res.status(response.code).json(response.message);
});

router.get(
  "/:id",
  [
    NumberMiddleware.isNumber,
    UserMiddleware.isValidUserById,
    AuthMiddleware.validateToken,
    UserMiddleware.hasPermissions,
  ],
  async (req, res) => {
    const response = await UserService.getUserById(req.params.id);
    res.status(response.code).json(response.message);
  }
);

router.put(
  "/:id",
  [
    NumberMiddleware.isNumber,
    UserMiddleware.isValidUserById,
    AuthMiddleware.validateToken,
    UserMiddleware.hasPermissions,
  ],
  async (req, res) => {
    const response = await UserService.updateUser(req);
    res.status(response.code).json(response.message);
  }
);

router.delete(
  "/:id",
  [
    NumberMiddleware.isNumber,
    UserMiddleware.isValidUserById,
    AuthMiddleware.validateToken,
    UserMiddleware.hasPermissions,
  ],
  async (req, res) => {
    const response = await UserService.deleteUser(req.params.id);
    res.status(response.code).json(response.message);
  }
);

export default router;
