const memoryStore = require('../utils/memoryStore');

/**
 * User Model - In-memory implementation for demonstration
 * Supports role-based access control for Admin and HR users
 */
class User {
  constructor(data) {
    Object.assign(this, data);
  }

  // Static methods
  static async findOne(query) {
    const userData = await memoryStore.findOne(query);
    return userData ? new User(userData) : null;
  }

  static async create(userData) {
    const createdUserData = await memoryStore.create(userData);
    return new User(createdUserData);
  }

  static async findById(id) {
    const userData = await memoryStore.findById(id);
    return userData ? new User(userData) : null;
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const updatedUserData = await memoryStore.findByIdAndUpdate(id, updateData, options);
    return updatedUserData ? new User(updatedUserData) : null;
  }

  // Instance methods
  async comparePassword(candidatePassword) {
    return await memoryStore.comparePassword(candidatePassword, this.password);
  }

  async updateLastLogin() {
    this.lastLogin = new Date();
    return await memoryStore.findByIdAndUpdate(this._id, { lastLogin: this.lastLogin }, { new: true });
  }

  async save() {
    return await memoryStore.findByIdAndUpdate(this._id, this, { new: true });
  }

  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
}

module.exports = User;
