const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-memory user store for demonstration purposes
class MemoryStore {
  constructor() {
    this.users = [];
    this.initializeDefaultUsers();
  }

  async initializeDefaultUsers() {
    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const hrPassword = await bcrypt.hash('hr123', 12);

    this.users = [
      {
        _id: uuidv4(),
        name: 'Admin User',
        email: 'admin@airecruiter.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      },
      {
        _id: uuidv4(),
        name: 'HR Manager',
        email: 'hr@airecruiter.com',
        password: hrPassword,
        role: 'hr',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      }
    ];
  }

  async findOne(query) {
    return this.users.find(user => {
      if (query.email) {
        return user.email === query.email;
      }
      if (query._id) {
        return user._id === query._id;
      }
      return false;
    }) || null;
  }

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      _id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'hr',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async findById(id) {
    return this.users.find(user => user._id === id) || null;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    
    if (options.new) {
      return this.users[userIndex];
    }
    return this.users[userIndex];
  }

  async save() {
    // In-memory implementation - no actual saving needed
    return this;
  }

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = new MemoryStore();
