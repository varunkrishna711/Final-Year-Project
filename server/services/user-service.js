// const ApiError = require('../error/ApiError');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const {User, Cart, Address} = require('../db/models/models');
// const { Op } = require("sequelize");

// const generateJwt = (id, email, role) => {
//   return jwt.sign(
//     {id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'}
//   )
// }

// const generateAdminJwt = (id, email, role) => {
//   return jwt.sign(
//     {id, email, role}, process.env.ADMIN_SECRET_KEY, {expiresIn: '24h'}
//   )
// }

// class UserService {
//   async registration(email, password, role) {
//     const userExists = await User.findOne({where: {email}})
//     if (userExists) {
//       throw ApiError.badRequest('User already exists')
//     }
//     const hashPassword = await bcrypt.hash(password, 5)
//     const user = await User.create({email, password: hashPassword, role})
//     const cart = await Cart.create({userId: user.id})
//     const token = generateJwt(user.id, user.email, user.role)

//     return token
//   }

//   async login(email, password) {
//     const user = await User.findOne({where: {email}})
//     if (!user) {
//       throw ApiError.internal('User is not found')
//     }
//     let comparePassword = bcrypt.compareSync(password, user.password)
//     if (!comparePassword) {
//       throw ApiError.internal('Incorrect password')
//     }
//     const token = generateJwt(user.id, user.email, user.role)

//     return token
//   }

//   async adminLogin(email, password) {
//     const user = await User.findOne({
//       where: {
//         [Op.and]: [
//           {email: email},
//           {role: {[Op.or]: ['ADMIN', 'TESTADMIN']}}
//         ]
//       }
//     })
//     if (!user) {
//       throw ApiError.internal('User is not admin')
//     }
//     let comparePassword = bcrypt.compareSync(password, user.password)
//     if (!comparePassword) {
//       throw ApiError.internal('Incorrect password')
//     }
//     const token = generateAdminJwt(user.id, user.email, user.role)

//     return token
//   }

//   async check(userId, userEmail, userRole) {
//     const token = generateJwt(userId, userEmail, userRole)
//     return token
//   }

//   async adminCheck(adminId, adminEmail, adminRole) {
//     const token = generateAdminJwt(adminId, adminEmail, adminRole)
//     return token
//   }

//   async getAll(userId, name, email, limit, offset) {

//     if (!userId && !name && !email) {
//       const users = await User.findAndCountAll({ order: [['id', 'DESC']], limit, offset })
//       return users
//     }

//     let parametersArray = [];

//     if (userId) {
//       parametersArray.push({id: userId})
//     }
//     if (name) {
//       parametersArray.push({firstname: name})
//       parametersArray.push({lastname: name})
//     }
//     if (email) {
//       parametersArray.push({email: email})
//     }

//     const users = await User.findAndCountAll({
//       order: [['id', 'DESC']],
//       where: {
//         [Op.or]: parametersArray
//       }, limit, offset
//     })
//     return users
//   }

//   async getUserInfo(userId) {
//     const user = await User.findOne({where: {id: userId}})
//     return user
//   }

//   async updateUser(userId, email, firstName, lastName) {
//     let valuesToUpdate = {};

//     if (email && email !== 'null' && email !== '') {
//       valuesToUpdate.email = email
//     }

//     if (firstName && firstName !== 'null' && firstName !== '') {
//       valuesToUpdate.firstname = firstName
//     }

//     if (lastName && lastName !== 'null' && lastName !== '') {
//       valuesToUpdate.lastname = lastName
//     }

//     await User.update(
//       valuesToUpdate,
//       {where: {id: userId}}
//     )

//     const updatedUser = await User.findOne({where: {id: userId}})
//     return updatedUser
//   }

//   async updateUserImage(userId, imageurl) {
//     await User.update(
//       {image: imageurl},
//       {where: {id: userId}}
//     )
//     return filename
//   }

//   async deleteUserImage(userId) {
//     await User.update(
//       {image: null},
//       {where: {id: userId}}
//     )
//     return null
//   }

//   async changePassword(userId, currentPassword, newPassword, passwordRepeat) {
//     const user = await User.findOne({where: {id: userId}})

//     let comparePassword = bcrypt.compareSync(currentPassword, user.password)
//     if (!comparePassword) {
//       throw ApiError.internal('Incorrect current password')
//     }
//     if (newPassword !== passwordRepeat) {
//       throw ApiError.internal('Passwords do not match')
//     }

//     const hashPassword = await bcrypt.hash(newPassword, 5)
//     await User.update(
//       {password: hashPassword},
//       {where: {id: userId}}
//     )
//     const updatedUser = await User.findOne({where: {id: userId}})
//     return updatedUser
//   }

//   async createAddress(
//     userId, firstName, lastName, country, addressLineOne, addressLineTwo, city, state, zip
//   ) {
//     const addressExist = await Address.findOne({where: {userId}})
//     if (!addressExist) {
//       const address = await Address.create({
//         userId,
//         firstname: firstName,
//         lastname: lastName,
//         country,
//         addressLineOne,
//         addressLineTwo,
//         city,
//         state,
//         zip
//       })
//       return address
//     }
//     else {
//       await Address.update(
//         {
//           firstname: firstName,
//           lastname: lastName,
//           country,
//           addressLineOne,
//           addressLineTwo,
//           city,
//           state,
//           zip,
//         },
//         {where: {userId}}
//       )
//       const updatedAddress = await Address.findOne({where: {userId}})
//       return updatedAddress;
//     }

//   }

//   async getAddress(userId) {
//     const address = await Address.findOne({where: {userId}})
//     return address
//   }

//   async getUserStatistic(startDate, lastDate) {
//     try {
//       const userStatistic = await User.findAll({
//         where: {
//           createdAt: { [Op.between]: [new Date(startDate), new Date(lastDate)] },
//         },
//         attributes: [
//           'createdAt',
//           [fn('date_trunc', 'day', col('createdAt')), 'registrationDay'],
//           [fn('COUNT', col('id')), 'userCount']
//         ],
//         group: 'createdAt',
//         raw: true,
//         right: false,
//         order: [['createdAt', 'ASC']],
//       })

//       const userCountMap = new Map();
//       userStatistic.forEach((row) => {
//         userCountMap.set(row.registrationDay.toISOString().split('T')[0], row.userCount);
//       });

//       const generateDateArray = (startDay, lastDay) => {
//         const dates = [];
//         const startDate = new Date(startDay);
//         const lastDate = new Date(lastDay);

//         while (startDate <= lastDate) {
//           dates.push(new Date(startDate));
//           startDate.setDate(startDate.getDate() + 1);
//         }

//         return dates;
//       }

//       const dates = generateDateArray(startDate, lastDate)

//       const newUsersByDay = dates.map((date) => ({
//         date: date.toISOString().split('T')[0],
//         total: userCountMap.get(date.toISOString().split('T')[0]) || 0,
//       }));

//       return newUsersByDay;
//     }
//     catch (e) {
//       console.error(e)
//     }
//   }

//   async deleteUser(req, res) {
//     const {id} = req.params
//     const user = await User.findOne({where: {id}})
//     return user
//   }
// }

// module.exports = new UserService();

// ================================================================================================================
// ================================================================================================================
// ================================================= ANOTHER CODE =================================================
// ================================================================================================================
// ================================================================================================================

// const ApiError = require("../error/ApiError");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { User, Cart, Address } = require("../db/models/models");
// const { Op } = require("sequelize");

// const generateJwt = (id, email, role) => {
//     return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
//         expiresIn: "24h",
//     });
// };

// const generateAdminJwt = (id, email, role) => {
//     return jwt.sign({ id, email, role }, process.env.ADMIN_SECRET_KEY, {
//         expiresIn: "24h",
//     });
// };

// class UserService {
//     async registration(email, password, role) {
//         const userExists = await User.findOne({ where: { email } });
//         if (userExists) {
//             throw ApiError.badRequest("User already exists");
//         }
//         const hashPassword = await bcrypt.hash(password, 10); // updated hash function
//         const user = await User.create({ email, password: hashPassword, role });
//         const cart = await Cart.create({ userId: user.id });
//         const token = generateJwt(user.id, user.email, user.role);

//         return token;
//     }

//     async login(email, password) {
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             throw ApiError.internal("User is not found");
//         }
//         let comparePassword = await bcrypt.compare(password, user.password); // updated compare function
//         if (!comparePassword) {
//             throw ApiError.internal("Incorrect password");
//         }
//         const token = generateJwt(user.id, user.email, user.role);

//         return token;
//     }

//     async adminLogin(email, password) {
//         const user = await User.findOne({
//             where: {
//                 [Op.and]: [
//                     { email: email },
//                     { role: { [Op.or]: ["ADMIN", "TESTADMIN"] } },
//                 ],
//             },
//         });
//         if (!user) {
//             throw ApiError.internal("User is not admin");
//         }
//         let comparePassword = await bcrypt.compare(password, user.password); // updated compare function
//         if (!comparePassword) {
//             throw ApiError.internal("Incorrect password");
//         }
//         const token = generateAdminJwt(user.id, user.email, user.role);

//         return token;
//     }

//     async check(userId, userEmail, userRole) {
//         const token = generateJwt(userId, userEmail, userRole);
//         return token;
//     }

//     async adminCheck(adminId, adminEmail, adminRole) {
//         const token = generateAdminJwt(adminId, adminEmail, adminRole);
//         return token;
//     }

//     async getAll(userId, name, email, limit, offset) {
//         if (!userId && !name && !email) {
//             const users = await User.findAndCountAll({
//                 order: [["id", "DESC"]],
//                 limit,
//                 offset,
//             });
//             return users;
//         }

//         let parametersArray = [];

//         if (userId) {
//             parametersArray.push({ id: userId });
//         }
//         if (name) {
//             parametersArray.push({ firstname: name });
//             parametersArray.push({ lastname: name });
//         }
//         if (email) {
//             parametersArray.push({ email: email });
//         }

//         const users = await User.findAndCountAll({
//             order: [["id", "DESC"]],
//             where: {
//                 [Op.or]: parametersArray,
//             },
//             limit,
//             offset,
//         });
//         return users;
//     }

//     async getUserInfo(userId) {
//         const user = await User.findOne({ where: { id: userId } });
//         return user;
//     }

//     async updateUser(userId, email, firstName, lastName) {
//         let valuesToUpdate = {};

//         if (email && email !== "null" && email !== "") {
//             valuesToUpdate.email = email;
//         }

//         if (firstName && firstName !== "null" && firstName !== "") {
//             valuesToUpdate.firstname = firstName;
//         }

//         if (lastName && lastName !== "null" && lastName !== "") {
//             valuesToUpdate.lastname = lastName;
//         }

//         await User.update(valuesToUpdate, { where: { id: userId } });

//         const updatedUser = await User.findOne({ where: { id: userId } });
//         return updatedUser;
//     }

//     async updateUserImage(userId, imageurl) {
//         await User.update({ image: imageurl }, { where: { id: userId } });
//         return filename;
//     }

//     async deleteUserImage(userId) {
//         await User.update({ image: null }, { where: { id: userId } });
//         return null;
//     }

//     async changePassword(userId, currentPassword, newPassword, passwordRepeat) {
//         const user = await User.findOne({ where: { id: userId } });

//         let comparePassword = bcrypt.compareSync(
//             currentPassword,
//             user.password
//         );
//         if (!comparePassword) {
//             throw ApiError.internal("Incorrect current password");
//         }
//         if (newPassword !== passwordRepeat) {
//             throw ApiError.internal("Passwords do not match");
//         }

//         const hashPassword = await bcrypt.hash(newPassword, 5);
//         await User.update(
//             { password: hashPassword },
//             { where: { id: userId } }
//         );
//         const updatedUser = await User.findOne({ where: { id: userId } });
//         return updatedUser;
//     }

//     async createAddress(
//         userId,
//         firstName,
//         lastName,
//         country,
//         addressLineOne,
//         addressLineTwo,
//         city,
//         state,
//         zip
//     ) {
//         const addressExist = await Address.findOne({ where: { userId } });
//         if (!addressExist) {
//             const address = await Address.create({
//                 userId,
//                 firstname: firstName,
//                 lastname: lastName,
//                 country,
//                 addressLineOne,
//                 addressLineTwo,
//                 city,
//                 state,
//                 zip,
//             });
//             return address;
//         } else {
//             await Address.update(
//                 {
//                     firstname: firstName,
//                     lastname: lastName,
//                     country,
//                     addressLineOne,
//                     addressLineTwo,
//                     city,
//                     state,
//                     zip,
//                 },
//                 { where: { userId } }
//             );
//             const updatedAddress = await Address.findOne({ where: { userId } });
//             return updatedAddress;
//         }
//     }

//     async getAddress(userId) {
//         const address = await Address.findOne({ where: { userId } });
//         return address;
//     }

//     async getUserStatistic(startDate, lastDate) {
//         try {
//             const userStatistic = await User.findAll({
//                 where: {
//                     createdAt: {
//                         [Op.between]: [new Date(startDate), new Date(lastDate)],
//                     },
//                 },
//                 attributes: [
//                     "createdAt",
//                     [
//                         fn("date_trunc", "day", col("createdAt")),
//                         "registrationDay",
//                     ],
//                     [fn("COUNT", col("id")), "userCount"],
//                 ],
//                 group: "createdAt",
//                 raw: true,
//                 right: false,
//                 order: [["createdAt", "ASC"]],
//             });

//             const userCountMap = new Map();
//             userStatistic.forEach((row) => {
//                 userCountMap.set(
//                     row.registrationDay.toISOString().split("T")[0],
//                     row.userCount
//                 );
//             });

//             const generateDateArray = (startDay, lastDay) => {
//                 const dates = [];
//                 const startDate = new Date(startDay);
//                 const lastDate = new Date(lastDay);

//                 while (startDate <= lastDate) {
//                     dates.push(new Date(startDate));
//                     startDate.setDate(startDate.getDate() + 1);
//                 }

//                 return dates;
//             };

//             const dates = generateDateArray(startDate, lastDate);

//             const newUsersByDay = dates.map((date) => ({
//                 date: date.toISOString().split("T")[0],
//                 total: userCountMap.get(date.toISOString().split("T")[0]) || 0,
//             }));

//             return newUsersByDay;
//         } catch (e) {
//             console.error(e);
//         }
//     }
//     async deleteUser(req, res) {
//         const { id } = req.params;
//         const user = await User.findOne({ where: { id } });
//         return user;
//     }
// }

// module.exports = new UserService();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Cart, Address } = require("../db/models/models");
const { Types } = require("mongoose");
const calculateDistance = require("../helpers/calculateDistance");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

const generateAdminJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.ADMIN_SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserService {
  async registration(email, password, role, location) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
      role,
      location,
    });
    await Cart.create({ userId: user._id });
    const token = generateJwt(user._id.toString(), user.email, user.role);

    return token;
  }

  async addMany(data) {
    await data.map(async (d) => {
      const userExists = await User.findOne({ email: d.email });
      if (userExists) {
        return;
      }
      const hashPassword = await bcrypt.hash(d.password, 5);
      const user = await User.create({
        email: d.email,
        password: hashPassword,
        role: d.role,
        location: d.location,
        firstname: d.firstname,
        lastname: d.lastname,
      });
    });
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User is not found");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error("Incorrect password");
    }

    const token = generateJwt(user._id.toString(), user.email, user.role);
    return token;
  }

  async adminLogin(email, password) {
    const user = await User.findOne({
      email,
      role: { $in: ["ADMIN", "TESTADMIN"] },
    });

    if (!user) {
      throw new Error("User is not admin");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error("Incorrect password");
    }

    const token = generateAdminJwt(user._id.toString(), user.email, user.role);

    return token;
  }

  async check(userId, userEmail, userRole) {
    const token = generateJwt(userId, userEmail, userRole);
    return token;
  }

  async adminCheck(adminId, adminEmail, adminRole) {
    const token = generateAdminJwt(adminId, adminEmail, adminRole);
    return token;
  }

  async getAll(userId, name, email, limit, offset) {
    if (!userId && !name && !email) {
      const users = await User.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(offset);
      return users;
    }

    const parametersArray = [];

    if (userId) {
      parametersArray.push({ _id: Types.ObjectId(userId) });
    }
    if (name) {
      parametersArray.push({
        $or: [
          { firstname: { $regex: name, $options: "i" } },
          { lastname: { $regex: name, $options: "i" } },
        ],
      });
    }
    if (email) {
      parametersArray.push({ email: { $regex: email, $options: "i" } });
    }

    const users = await User.find({
      $or: parametersArray,
    })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(offset);

    return users;
  }

  async getUserInfo(userId) {
    const user = await User.findById(userId);
    return user;
  }

  async updateUser(userId, email, firstName, lastName) {
    const valuesToUpdate = {};

    if (email && email !== "null" && email !== "") {
      valuesToUpdate.email = email;
    }

    if (firstName && firstName !== "null" && firstName !== "") {
      valuesToUpdate.firstname = firstName;
    }

    if (lastName && lastName !== "null" && lastName !== "") {
      valuesToUpdate.lastname = lastName;
    }

    await User.findByIdAndUpdate(userId, valuesToUpdate);

    const updatedUser = await User.findById(userId);
    return updatedUser;
  }

  async updateUserImage(userId, imageurl) {
    await User.findByIdAndUpdate(userId, { image: imageurl });
    return imageurl;
  }

  async deleteUserImage(userId) {
    await User.findByIdAndUpdate(userId, { image: null });
    return null;
  }

  async changePassword(userId, currentPassword, newPassword, passwordRepeat) {
    const user = await User.findById(userId);

    const comparePassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!comparePassword) {
      throw new Error("Incorrect current password");
    }
    if (newPassword !== passwordRepeat) {
      throw new Error("Passwords do not match");
    }

    const hashPassword = await bcrypt.hash(newPassword, 5);
    await User.findByIdAndUpdate(userId, { password: hashPassword });

    const updatedUser = await User.findById(userId);
    return updatedUser;
  }

  async createAddress(
    userId,
    firstName,
    lastName,
    country,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    zip
  ) {
    const addressExist = await Address.findOne({ userId });
    if (!addressExist) {
      const address = await Address.create({
        userId,
        firstname: firstName,
        lastname: lastName,
        country,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        zip,
      });
      return address;
    } else {
      await Address.findOneAndUpdate(
        { userId },
        {
          firstname: firstName,
          lastname: lastName,
          country,
          addressLineOne,
          addressLineTwo,
          city,
          state,
          zip,
        }
      );
      const updatedAddress = await Address.findOne({ userId });
      return updatedAddress;
    }
  }

  async getAddress(userId) {
    const address = await Address.findOne({ userId });
    return address;
  }

  async getUserStatistic(startDate, lastDate) {
    try {
      const userStatistic = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            userCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const userCountMap = new Map();
      userStatistic.forEach((row) => {
        userCountMap.set(row._id, row.userCount);
      });

      const generateDateArray = (startDay, lastDay) => {
        const dates = [];
        const startDate = new Date(startDay);
        const lastDate = new Date(lastDay);

        while (startDate <= lastDate) {
          dates.push(new Date(startDate));
          startDate.setDate(startDate.getDate() + 1);
        }

        return dates;
      };

      const dates = generateDateArray(startDate, lastDate);

      const newUsersByDay = dates.map((date) => ({
        date: date.toISOString().split("T")[0],
        total: userCountMap.get(date.toISOString().split("T")[0]) || 0,
      }));

      return newUsersByDay;
    } catch (e) {
      console.error(e);
    }
  }

  async getProducersNearby(lat, lgt) {
    const producers = await User.find({ role: "ADMIN" }, {}, { lean: true });
    const sortedListDist = producers
      .map((s) => ({
        ...s,
        distance: calculateDistance(lat, lgt, s.location[0], s.location[1]),
      }))
      .sort((a, b) => a.distance - b.distance);
    return sortedListDist;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    return user;
  }
}

module.exports = new UserService();
