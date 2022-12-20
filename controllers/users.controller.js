const db = require("../models/db");

let strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

module.exports.getAll = (req, res) => {
  db.execute("SELECT*FROM users ")
    .then((data) => {
      // console.log(data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.getHomePage = (req, res) => {};
module.exports.login = (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      message: "Invalid email or password",
    });
  }
  db.execute("SELECT*FROM users WHERE email=?", [email]).then((data) => {
    let find = data[0][0];
    if (!find) {
      res.status(404).json({
        message: "user is not exits",
      });
    } else {
      if (!find.password) {
        res.status(404).json({
          message: "wrong password",
        });
      } else if (find.password !== password) {
        res.status(200).json({
          status: "wrong",
          message: "sai passs",
        });
      } else {
        res.cookie("userId", find.id, { signed: true });
        res.cookie("userEmail", find.email, { signed: true });
        res.cookie("role", find.role, { signed: true });
        res.status(200).json({
          status: "success",
          message: "login seccessfully",
        });
      }
    }
  });
};
module.exports.createUser = (req, res) => {
  let { email, password, userName, lastName, avatar } = req.body;
  if (!email && !password && !userName) {
    return res.status(500).json({
      message: "Email end password , userName cannot be empty!",
    });
  } else if (!email && password && userName) {
    return res.status(500).json({
      message: "Email cannot be empty!",
    });
  } else if (email && !password && userName) {
    return res.status(500).json({
      message: "Password cannot be empty!",
    });
  } else if (email && password && !userName) {
    return res.status(500).json({
      message: "Username cannot be empty!",
    });
  } else if (!email && password && !userName) {
    return res.status(500).json({
      message: "Username end Email cannot be empty!",
    });
  } else if (email && !password && !userName) {
    return res.status(500).json({
      message: "Username end Password cannot be empty!",
    });
  } else if (!email && !password && userName) {
    return res.status(500).json({
      message: "Email end Password cannot be empty!",
    });
  } else {
    if (!strongRegex.test(password)) {
      return res.status(500).json({
        message: "Password is not strong enough",
      });
    } else {
      let id = Math.floor(Math.random() * 10000000);
      db.execute("SELECT*FROM users WHERE email=?", [email])
        .then((data) => {
          let [rows] = data;
          if (rows.length > 0) {
            return res.status(500).json({
              message: "user alreadey exits",
            });
          } else {
            return db.execute("INSERT INTO users VALUES(?,?,?,?,?,?,?) ", [
              id,
              email,
              password,
              userName,
              null,
              null,
              1,
            ]);
          }
        })
        .then((data) => {
          return res.status(200).json({
            message: "creat one successfully",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            err: err,
          });
        });
    }
  }
};

module.exports.updatePass = (req, res) => {
  //   console.log("update");
  let { id } = req.params;
  // console.log(req.body);
  let { password } = req.body;
  db.execute("UPDATE users SET password=? WHERE id=?", [password, id])
    .then((data) => {
      // console.log(data);
      res.status(200).json({
        message: "update one successfully",
      });
    })
    .catch((err) => console.log(err));
};

module.exports.resetPassword = (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.status(500).json({
      message: "Invalid email",
    });
  }
  db.execute("SELECT*FROM users WHERE email=?", [email]).then((data) => {
    let find = data[0][0];
    if (!find) {
      res.status(404).json({
        message: "Email is not exits",
      });
    } else {
      console.log("hien thi ra trang reset password");
      res.status(200).json({
        status: "success",
        message: "Email is exits",
      });
    }
  });
};
module.exports.newPassword = (req, res) => {
  console.log("newpassword");
};
module.exports.updateUser = (req, res) => {
  //   console.log("update");
  let { id } = req.params;
  let { password, fistName, lastName, avatar } = req.body;
  db.execute(
    "UPDATE users SET password=?,fiStName=?,lastName=?,avatar=? WHERE id=?",
    [password, fistName, lastName, avatar, id]
  )
    .then((data) => {
      //   console.log(data);
      res.status(200).json({
        message: "update one successfully",
      });
    })
    .catch((err) => console.log(err));
};
module.exports.getPosts = (req, res) => {
  db.execute(`SELECT *FROM house`)
    .then((data) => {
      console.log("day la ", data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getAllPosts = (req, res) => {
  db.execute(
    `SELECT a.*, b.*, c.*,d.*,e.*
FROM
hotel_booking.media AS a,
hotel_booking.house AS b,
hotel_booking.tinhnang AS c,
hotel_booking.users AS d  ,
hotel_booking.diadiem AS e
WHERE ( b.id_media= a.id)
AND (b.id_tinhnang = c.id)
AND (b.id_user = d.id)
AND (b.id_diadiem=e.id);`
  )
    .then((data) => {
      console.log("day la ábđjábá", data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.getDetail = (req, res) => {
  db.execute(
    `SELECT a.*, b.*, c.*,d.*,e.*,f.*
FROM
hotel_booking.media AS a,
hotel_booking.house AS b,
hotel_booking.tinhnang AS c,
hotel_booking.users AS d  ,
hotel_booking.diadiem AS e,
hotel_booking.yeuthich AS f
WHERE ( b.id_media= a.id)
AND (b.id_tinhnang = c.id)
AND (b.id_user = d.id)
AND (b.id_diadiem=e.id)
AND (b.id=f.id_house);`
  )
    .then((data) => {
      console.log("day la ábđjábá", data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};
//
