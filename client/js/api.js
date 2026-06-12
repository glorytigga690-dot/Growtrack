/**
 * GrowTrack — Local Storage Mock API Client
 * Replaces backend API with local storage to work fully client-side on Vercel.
 */

const getDb = (table) => storageGet('mock_db_' + table) || [];
const setDb = (table, data) => storageSet('mock_db_' + table, data);

const api = {
  async request(endpoint, options = {}) {
    console.log(`Mock API Call: ${options.method || 'GET'} ${endpoint}`);
    const token = storageGet('access_token');
    const user = storageGet('user');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 200));

    // Must be logged in for most endpoints
    if (!endpoint.startsWith('/auth') && !token) {
      throw { success: false, message: 'Unauthorized', status: 401 };
    }

    const body = options.body ? JSON.parse(options.body) : {};

    try {
      // ━━━ HABITS ━━━
      if (endpoint === '/habits') {
        let habits = getDb('habits').filter(h => h.userId === user.id);
        if (options.method === 'GET') return { success: true, data: habits };
        if (options.method === 'POST') {
          const newHabit = { id: Date.now().toString(), userId: user.id, ...body, streak: 0, completions: [] };
          setDb('habits', [...getDb('habits'), newHabit]);
          return { success: true, data: newHabit };
        }
      }
      if (endpoint.startsWith('/habits/')) {
        const parts = endpoint.split('/');
        const id = parts[2];
        const action = parts[3];
        let habits = getDb('habits');
        let habitIndex = habits.findIndex(h => h.id === id && h.userId === user.id);
        
        if (habitIndex === -1) throw { status: 404, message: 'Not found' };
        
        if (action === 'complete' && options.method === 'POST') {
          const today = new Date().toISOString().split('T')[0];
          if (!habits[habitIndex].completions.includes(today)) {
             habits[habitIndex].completions.push(today);
             habits[habitIndex].streak = (habits[habitIndex].streak || 0) + 1;
             setDb('habits', habits);
          }
          return { success: true, data: habits[habitIndex] };
        }
        
        if (options.method === 'PUT') {
           habits[habitIndex] = { ...habits[habitIndex], ...body };
           setDb('habits', habits);
           return { success: true, data: habits[habitIndex] };
        }
        if (options.method === 'DELETE') {
           habits.splice(habitIndex, 1);
           setDb('habits', habits);
           return { success: true, message: 'Deleted' };
        }
      }

      // ━━━ GOALS ━━━
      if (endpoint === '/goals') {
        let goals = getDb('goals').filter(g => g.userId === user.id);
        if (options.method === 'GET') return { success: true, data: goals };
        if (options.method === 'POST') {
          const newGoal = { id: Date.now().toString(), userId: user.id, ...body, progress: 0 };
          setDb('goals', [...getDb('goals'), newGoal]);
          return { success: true, data: newGoal };
        }
      }
      if (endpoint.startsWith('/goals/')) {
        const id = endpoint.split('/')[2];
        let goals = getDb('goals');
        let goalIndex = goals.findIndex(g => g.id === id && g.userId === user.id);
        if (goalIndex === -1) throw { status: 404, message: 'Not found' };
        
        if (options.method === 'PUT') {
           goals[goalIndex] = { ...goals[goalIndex], ...body };
           setDb('goals', goals);
           return { success: true, data: goals[goalIndex] };
        }
        if (options.method === 'DELETE') {
           goals.splice(goalIndex, 1);
           setDb('goals', goals);
           return { success: true, message: 'Deleted' };
        }
      }

      // ━━━ MOOD ━━━
      if (endpoint === '/moods') {
        let moods = getDb('moods').filter(m => m.userId === user.id);
        if (options.method === 'GET') return { success: true, data: moods };
        if (options.method === 'POST') {
          const newMood = { id: Date.now().toString(), userId: user.id, ...body, date: new Date().toISOString() };
          setDb('moods', [...getDb('moods'), newMood]);
          return { success: true, data: newMood };
        }
      }
      
      // ━━━ DASHBOARD STATS ━━━
      if (endpoint === '/analytics/dashboard') {
        let habits = getDb('habits').filter(h => h.userId === user.id);
        let goals = getDb('goals').filter(g => g.userId === user.id);
        let activeHabits = habits.length;
        let activeGoals = goals.filter(g => g.status !== 'completed').length;
        
        return { 
          success: true, 
          data: {
            activeHabits,
            activeGoals,
            overallProgress: 50,
            streak: 0
          }
        };
      }
      
      // Fallback
      return { success: true, data: [] };
    } catch (error) {
      if (error.status) throw error;
      throw { success: false, message: 'Internal mock error', status: 500 };
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
