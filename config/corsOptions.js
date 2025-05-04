// cors - cross-origin-resource-sharing
// cors needs to be applied - but cannot be just open like bellow

const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // ! if origin exists === if request domain is in the allowedOrigins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },

  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
