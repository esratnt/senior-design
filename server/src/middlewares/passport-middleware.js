const passport = require("passport");
const { Strategy } = require("passport-jwt");
const { SECRET } = require("../constants");
const db = require("../db");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const { rows } = await db.query(
        "SELECT hr_id, name , surname ,email , hours FROM user_hr WHERE hr_id = $1",
        [id]
      );

      if (!rows.length) {
        throw new Error("401 not authorized");
      }

      let user = {
        id: rows[0].hr_id,
        name: rows[0].name,
        surname: rows[0].surname,
        email: rows[0].email,
        hours: rows[0].hours,
      };

      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);
