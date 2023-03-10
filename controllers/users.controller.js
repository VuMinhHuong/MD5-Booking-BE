const db = require("../models/db");

let strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

module.exports.getAll = (req, res) => {
  db.execute("SELECT*FROM users ")
    .then((data) => {
      console.log(data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.getHomePage = (req, res) => {};
module.exports.login = (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    return res.status(500).json({
      message: "Invalid email",
    });
  }
  if (!password) {
    return res.status(500).json({
      message: "Invalid password",
    });
  }

  db.execute("SELECT*FROM users WHERE email=?", [email]).then((data) => {
    let find = data[0][0];
    if (!find) {
      res.status(404).json({
        message: "Email is not exits",
      });
    } else {
      if (!find.password) {
        res.status(404).json({
          message: "Wrong password",
        });
      } else if (find.password !== password) {
        res.status(200).json({
          status: "wrong",
          message: "Wrong passsword",
        });
      } else {
        res.cookie("userId", find.id, { signed: true });
        res.cookie("userEmail", find.email, { signed: true });
        res.cookie("role", find.role, { signed: true });
        res.status(200).json({
          status: "success",
          message: "Login seccessfully",
        });
      }
    }
  });
};
module.exports.createUser = (req, res) => {
  let { email, password, userName, fistName, lastName, avatar } = req.body;
  if (!userName) {
    return res.status(500).json({
      message: "Invalid username enough",
    });
  } else if (!email) {
    return res.status(500).json({
      message: "Invalid email enough",
    });
  } else if (!password) {
    return res.status(500).json({
      message: "Invalid password enough",
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
            return Promise.reject("Email alreadey exits");
          } else {
            return db.execute("INSERT INTO users VALUES(?,?,?,?,?,?,?) ", [
              id,
              email,
              password,
              null,
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
      console.log("day la ??b??j??b??", data[0]);
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
      console.log("day la ??b??j??b??", data[0]);
      res.send(data[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};
//
