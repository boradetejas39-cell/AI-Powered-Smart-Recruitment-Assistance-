const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

/**
 * Unified data store that routes through MongoDB when connected,
 * otherwise falls back to an in-memory array.
 */
class MemoryStore {
  constructor() {
    this.users = []; // fallback in-memory store
  }

  /** True when Mongoose has an active connection */
  get isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  /** Lazily require the Mongoose User model (avoids circular deps) */
  get UserModel() {
    return require('../models/User');
  }

  // ── findOne ─────────────────────────────────────────────────────────
  async findOne(query) {
    if (this.isMongoConnected) {
      // +password because schema has select:false
      return await this.UserModel.findOne(query).select('+password').lean();
    }
    return this.users.find(user => {
      if (query.email) return user.email === query.email;
      if (query._id) return user._id === query._id;
      return false;
    }) || null;
  }

  // ── create ──────────────────────────────────────────────────────────
  async create(userData) {
    if (this.isMongoConnected) {
      const user = await this.UserModel.create({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Mongoose pre-save hook hashes it
        role: userData.role || 'hr',
        company: userData.company || '',
        isActive: true
      });
      // Return lean object with password for immediate JWT flows
      return user.toObject();
    }

    // In-memory fallback
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      _id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'hr',
      company: userData.company || '',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.push(newUser);
    return newUser;
  }

  // ── findById ────────────────────────────────────────────────────────
  async findById(id) {
    if (this.isMongoConnected) {
      try {
        return await this.UserModel.findById(id).select('+password').lean();
      } catch {
        return null;
      }
    }
    return this.users.find(user => user._id === id) || null;
  }

  // ── findByIdAndUpdate ───────────────────────────────────────────────
  async findByIdAndUpdate(id, updateData, options = {}) {
    if (this.isMongoConnected) {
      try {
        return await this.UserModel.findByIdAndUpdate(id, updateData, {
          new: options.new || false,
          runValidators: true
        }).lean();
      } catch {
        return null;
      }
    }

    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;
    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    return this.users[userIndex];
  }

  // ── findAll (for admin routes) ──────────────────────────────────────
  async findAll() {
    if (this.isMongoConnected) {
      return await this.UserModel.find().lean();
    }
    return this.users;
  }

  // ── deleteById ──────────────────────────────────────────────────────
  async deleteById(id) {
    if (this.isMongoConnected) {
      return await this.UserModel.findByIdAndDelete(id);
    }
    const idx = this.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    return this.users.splice(idx, 1)[0];
  }

  // ── helper ──────────────────────────────────────────────────────────
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = new MemoryStore();
