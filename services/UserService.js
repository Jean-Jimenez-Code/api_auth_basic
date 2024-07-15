import db from "../dist/db/models/index.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

const createUser = async (req) => {
  const { name, email, password, password_second, cellphone } = req.body;
  if (password !== password_second) {
    return {
      code: 400,
      message: "Passwords do not match",
    };
  }
  const user = await db.User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    return {
      code: 400,
      message: "User already exists",
    };
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.User.create({
    name,
    email,
    password: encryptedPassword,
    cellphone,
    status: true,
  });
  return {
    code: 200,
    message: "User created successfully with ID: " + newUser.id,
  };
};

const bulkCreate = async (users) => {
  let a = 0;
  let failureCount = 0;
  let errors = [];

  for (const user of users) {
    const { name, email, password, password_second, cellphone } = user;
    
    if (!name || !email || !password || !password_second || !cellphone) {
      failureCount++;
      errors.push({ email, error: "All fields (name, email, password, password_second, cellphone) are required" });
      continue;
    }
    
    if (password !== password_second) {
      console.log(`Passwords do not match for user: ${email}`);
      failureCount++;
      errors.push({ email, error: "Passwords do not match" });
      continue;
    }
    
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      failureCount++;
      errors.push({ email, error: "User already exists" });
      continue;
    }
    
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);
      await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true,
      });
      a++;
    } catch (error) {
      failureCount++;
      errors.push({ email, error: error.message });
    }
  }

  return {
    code: 200,
    message: {
      a,
      failureCount,
      errors,
    },
  };
};

const getUserById = async (id) => {
  return {
    code: 200,
    message: await db.User.findOne({
      where: {
        id: id,
        status: true,
      },
    }),
  };
};

const getAllUsers = async () => {
  return {
    code: 200,
    message: await db.User.findAll({
      where: {
        status: true,
      },
    }),
  };
};

// http://localhost:3000/api/v1/users/findUsers?deleted=true
// http://localhost:3000/api/v1/users/findUsers?deleted=false
// http://localhost:3000/api/v1/users/findUsers?name=karen
// http://localhost:3000/api/v1/users/findUsers?loginBefore=2024-07-10T20:32:49.802Z
// http://localhost:3000/api/v1/users/findUsers?loginAfter=2024-06-10T20:32:49.802Z

const findUsers = async ({ deleted, name, loginBefore, loginAfter }) => {
  const where = {};
  const sessionQuery = {};

  if (deleted !== undefined) {
    where.status = deleted === 'true' ? false : true;
  }

  if (name) {
    where.name = {
      [db.Sequelize.Op.like]: `%${name}%`
    };
  }

  if (loginBefore) {
    sessionQuery.createdAt = {
      ...sessionQuery.createdAt,
      [db.Sequelize.Op.lte]: new Date(loginBefore)
    };
  }

  if (loginAfter) {
    sessionQuery.createdAt = {
      ...sessionQuery.createdAt,
      [db.Sequelize.Op.gte]: new Date(loginAfter)
    };
  }

  const includeSession = {
    model: db.Session,
    where: sessionQuery
  };

  if (loginBefore || loginAfter) {
    includeSession.required = true;
  } else {
    includeSession.required = false;
  }

  const users = await db.User.findAll({
    where,
    include: [includeSession]
  });

  return {
    code: 200,
    message: users
  };
};

const updateUser = async (req) => {
  const user = db.User.findOne({
    where: {
      id: req.params.id,
      status: true,
    },
  });
  const payload = {};
  payload.name = req.body.name ?? user.name;
  payload.password = req.body.password
    ? await bcrypt.hash(req.body.password, 10)
    : user.password;
  payload.cellphone = req.body.cellphone ?? user.cellphone;
  await db.User.update(payload, {
    where: {
      id: req.params.id,
    },
  });
  return {
    code: 200,
    message: "User updated successfully",
  };
};

const deleteUser = async (id) => {
  /* await db.User.destroy({
        where: {
            id: id
        }
    }); */
  const user = db.User.findOne({
    where: {
      id: id,
      status: true,
    },
  });
  await db.User.update(
    {
      status: false,
    },
    {
      where: {
        id: id,
      },
    }
  );
  return {
    code: 200,
    message: "User deleted successfully",
  };
};

export default {
  createUser,
  bulkCreate,
  getUserById,
  getAllUsers,
  findUsers,
  updateUser,
  deleteUser,
};
