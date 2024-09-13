const JWT_SECRET =
  process.env.JWT_SECRET || "totally-safe-complicated-secret-key";

module.exports = { JWT_SECRET };
