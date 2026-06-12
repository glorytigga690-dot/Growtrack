const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const storagePath = process.env.VERCEL 
  ? '/tmp/database_mongo_mock.json' 
  : path.join(__dirname, '..', '..', 'database_mongo_mock.json');

let mockData = {};
if (fs.existsSync(storagePath)) {
  try {
    mockData = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
  } catch (e) {
    mockData = {};
  }
}

function saveData() {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(mockData, null, 2), 'utf8');
  } catch (e) {}
}

function matchesFilter(doc, filter) {
  for (const key in filter) {
    const val = filter[key];
    const docVal = doc[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      // Operator like $gte, $lte, $lt, $gt
      for (const op in val) {
        let opVal = val[op];
        let docTime = (docVal instanceof Date) ? docVal.getTime() : new Date(docVal).getTime();
        let compareTime = (opVal instanceof Date) ? opVal.getTime() : new Date(opVal).getTime();
        
        if (!isNaN(docTime) && !isNaN(compareTime)) {
          if (op === '$gte' && !(docTime >= compareTime)) return false;
          if (op === '$lte' && !(docTime <= compareTime)) return false;
          if (op === '$gt' && !(docTime > compareTime)) return false;
          if (op === '$lt' && !(docTime < compareTime)) return false;
          if (op === '$ne' && docTime === compareTime) return false;
        } else {
          if (op === '$gte' && !(docVal >= opVal)) return false;
          if (op === '$lte' && !(docVal <= opVal)) return false;
          if (op === '$gt' && !(docVal > opVal)) return false;
          if (op === '$lt' && !(docVal < opVal)) return false;
          if (op === '$ne' && docVal === opVal) return false;
        }
      }
    } else {
      // Exact match
      if (val instanceof Date || (docVal instanceof Date)) {
        let docTime = (docVal instanceof Date) ? docVal.getTime() : new Date(docVal).getTime();
        let compareTime = (val instanceof Date) ? val.getTime() : new Date(val).getTime();
        if (!isNaN(docTime) && !isNaN(compareTime)) {
          if (docTime !== compareTime) return false;
        } else {
          if (docVal !== val) return false;
        }
      } else if (key === '_id' || key === 'habit_id') {
        if (String(docVal) !== String(val)) return false;
      } else {
        if (docVal !== val) return false;
      }
    }
  }
  return true;
}

class MockQuery {
  constructor(promise) {
    this.promise = promise;
  }

  sort(sortObj) {
    this.promise = this.promise.then(docs => {
      return docs.sort((a, b) => {
        for (const key in sortObj) {
          const order = sortObj[key];
          const valA = a[key];
          const valB = b[key];
          if (valA !== valB) {
            if (order === 1 || order === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
          }
        }
        return 0;
      });
    });
    return this;
  }

  limit(limitVal) {
    this.promise = this.promise.then(docs => docs.slice(0, limitVal));
    return this;
  }

  populate(path, select) {
    if (path === 'habit_id') {
      this.promise = this.promise.then(async docs => {
        const { MockModel } = require('./mockModel');
        const habitModel = new MockModel('Habit');
        
        const populatedDocs = [];
        for (const doc of docs) {
          const rawDoc = doc.toObject ? doc.toObject() : doc;
          const habitId = rawDoc.habit_id;
          const habit = await habitModel.findOne({ _id: habitId });
          
          const populatedDoc = {
            ...rawDoc,
            habit_id: habit ? (habit.toObject ? habit.toObject() : habit) : { name: 'Deleted Habit', color: '#ccc', icon: 'check' }
          };
          
          if (doc.toObject) {
            populatedDoc.toObject = () => populatedDoc;
            populatedDoc.toJSON = () => populatedDoc;
          }
          populatedDocs.push(populatedDoc);
        }
        return populatedDocs;
      });
    }
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
}

class MockModel {
  constructor(modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;
    if (!mockData[modelName]) {
      mockData[modelName] = [];
    }
  }

  _getDefaults() {
    const defaults = {};
    if (this.schema && this.schema.paths) {
      for (const key in this.schema.paths) {
        const path = this.schema.paths[key];
        if (path.defaultValue !== undefined) {
          if (key === '_id') continue;
          if (typeof path.defaultValue === 'function') {
            try {
              defaults[key] = path.defaultValue();
            } catch (e) {
              // ignore
            }
          } else {
            defaults[key] = path.defaultValue;
          }
        }
      }
    }
    return defaults;
  }

  find(filter = {}) {
    const docs = mockData[this.modelName].filter(doc => matchesFilter(doc, filter));
    const wrappedDocs = docs.map(doc => this._wrapDoc(doc));
    return new MockQuery(Promise.resolve(wrappedDocs));
  }

  async findOne(filter = {}) {
    const doc = mockData[this.modelName].find(doc => matchesFilter(doc, filter));
    return doc ? this._wrapDoc(doc) : null;
  }

  async create(data) {
    const defaults = this._getDefaults();
    const doc = {
      _id: uuidv4(),
      ...defaults,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockData[this.modelName].push(doc);
    saveData();
    return this._wrapDoc(doc);
  }

  async countDocuments(filter = {}) {
    return mockData[this.modelName].filter(doc => matchesFilter(doc, filter)).length;
  }

  async deleteMany(filter = {}) {
    mockData[this.modelName] = mockData[this.modelName].filter(doc => !matchesFilter(doc, filter));
    saveData();
    return { deletedCount: 1 };
  }

  async deleteOne(filter = {}) {
    const idx = mockData[this.modelName].findIndex(doc => matchesFilter(doc, filter));
    if (idx !== -1) {
      mockData[this.modelName].splice(idx, 1);
      saveData();
    }
    return { deletedCount: 1 };
  }

  async findOneAndUpdate(filter = {}, update = {}, options = {}) {
    let doc = mockData[this.modelName].find(doc => matchesFilter(doc, filter));
    if (!doc && options.upsert) {
      doc = { _id: uuidv4(), created_at: new Date().toISOString() };
      mockData[this.modelName].push(doc);
    }
    if (doc) {
      const fields = update.$set || update;
      Object.assign(doc, fields);
      doc.updated_at = new Date().toISOString();
      saveData();
      return this._wrapDoc(doc);
    }
    return null;
  }

  _wrapDoc(rawDoc) {
    const defaults = this._getDefaults();
    const mergedDoc = { ...defaults, ...rawDoc };
    const modelInstance = { ...mergedDoc };
    modelInstance.toObject = () => mergedDoc;
    modelInstance.toJSON = () => mergedDoc;
    modelInstance.save = async () => {
      const idx = mockData[this.modelName].findIndex(d => d._id === rawDoc._id);
      if (idx !== -1) {
        rawDoc.updated_at = new Date().toISOString();
        Object.assign(rawDoc, mergedDoc);
        mockData[this.modelName][idx] = rawDoc;
        saveData();
      }
      return modelInstance;
    };
    modelInstance.deleteOne = async () => {
      const idx = mockData[this.modelName].findIndex(d => d._id === rawDoc._id);
      if (idx !== -1) {
        mockData[this.modelName].splice(idx, 1);
        saveData();
      }
    };
    return modelInstance;
  }
}

module.exports = { MockModel };
