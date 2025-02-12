

const tokenBlacklist = new Map();

module.exports = {
  addToken: (token) => {
    // Store token with expiration time (24 hours in milliseconds)
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    tokenBlacklist.set(token, expirationTime);
  },

  isTokenBlacklisted: (token) => {
    const expirationTime = tokenBlacklist.get(token);

    // If token is expired, remove it from the blacklist
    if (expirationTime && Date.now() > expirationTime) {
      tokenBlacklist.delete(token);
      return false; // Treat as if it's not blacklisted since it's expired
    }

    return tokenBlacklist.has(token);
  },

  // Optional: Regularly clean up expired tokens to free up memory
  cleanupExpiredTokens: () => {
    const now = Date.now();
    for (const [token, expirationTime] of tokenBlacklist.entries()) {
      if (expirationTime <= now) {
        tokenBlacklist.delete(token);
      }
    }
  },
};

// Optional: Schedule the cleanup of expired tokens at regular intervals
setInterval(() => {
  module.exports.cleanupExpiredTokens();
}, 60 * 60 * 1000); // Run cleanup every hour
