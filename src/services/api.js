// src/services/api.js
const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Autenticación
  async login(email, password) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Alertas
  async getAlerts() {
    return this.request('/alerts');
  }

  async createAlert(alertData) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async updateAlert(id, alertData) {
    return this.request(`/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(alertData),
    });
  }

  async deleteAlert(id) {
    return this.request(`/alerts/${id}`, {
      method: 'DELETE',
    });
  }

  // Dispositivos
  async getDevices() {
    return this.request('/devices');
  }

  async createDevice(deviceData) {
    return this.request('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id, deviceData) {
    return this.request(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  // Usuarios
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  // Actividades
  async getActivities() {
    return this.request('/activities');
  }
}

export default new ApiService();