const mongoose = require('mongoose');
const { MockModel } = require('./mockModel');

function getModel(name, schema) {
  let realModel = null;
  let mockModel = null;

  return new Proxy({}, {
    get(target, prop) {
      // Check if mongoose is connected
      const isConnected = mongoose.connection && mongoose.connection.readyState === 1;
      
      if (isConnected) {
        if (!realModel) {
          try {
            realModel = mongoose.model(name, schema);
          } catch (e) {
            realModel = mongoose.model(name);
          }
        }
        const val = realModel[prop];
        return typeof val === 'function' ? val.bind(realModel) : val;
      } else {
        if (!mockModel) {
          mockModel = new MockModel(name);
        }
        const val = mockModel[prop];
        return typeof val === 'function' ? val.bind(mockModel) : val;
      }
    }
  });
}

module.exports = { getModel };
