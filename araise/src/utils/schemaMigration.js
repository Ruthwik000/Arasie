/**
 * Schema Migration Utility
 * Converts old flat schema to new structured schema (v2.0.0)
 */

export function migrateToNewSchema(oldData, userId, email, displayName) {
  const today = new Date().toISOString().slice(0, 10);
  
  // Helper to filter today's data only
  const filterTodayOnly = (array, dateField = 'time') => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => {
      const itemDate = item.date || (item[dateField] ? new Date(item[dateField]).toISOString().slice(0, 10) : null);
      return itemDate === today;
    });
  };

  // Calculate allGoalsMet
  const focusGoalMet = (oldData.focusProgress || 0) >= 100;
  const allGoalsMet = 
    (oldData.waterGoalMet || false) &&
    (oldData.dietGoalMet || false) &&
    (oldData.workoutCompleted || false) &&
    focusGoalMet;

  return {
    // Root identity fields
    userId: userId,
    email: email || oldData.email || '',
    displayName: displayName || oldData.displayName || oldData.name || '',
    createdAt: oldData.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    
    // Profile
    profile: {
      level: oldData.level || 1,
      xp: oldData.xp || 0,
      streakDays: oldData.streakDays || oldData.streakCount || 0,
      lastActiveDate: oldData.lastActiveDate || null,
      lastStreakDate: oldData.lastStreakDate || null
    },
    
    // Goals
    goals: {
      water: {
        target: oldData.waterGoal || 3000,
        unit: 'ml'
      },
      calories: {
        target: oldData.dailyCalorieGoal || 2000,
        unit: 'kcal'
      },
      focus: {
        target: oldData.dailyFocusGoal || 60,
        unit: 'minutes'
      },
      workout: {
        target: 1,
        unit: 'sessions'
      }
    },
    
    // Today
    today: {
      date: today,
      lastReset: oldData.lastReset || new Date().toISOString(),
      progress: {
        water: oldData.waterProgress || 0,
        calories: oldData.dietCalories || 0,
        focus: oldData.focusProgress || 0,
        mentalHealth: oldData.mentalHealthProgress || 0
      },
      goalsCompleted: {
        water: oldData.waterGoalMet || false,
        calories: oldData.dietGoalMet || false,
        focus: focusGoalMet,
        workout: oldData.workoutCompleted || false,
        allGoalsMet: allGoalsMet
      }
    },
    
    // Activities (today only)
    activities: {
      water: filterTodayOnly(oldData.waterLogs || []),
      meals: filterTodayOnly(oldData.meals || []),
      workouts: filterTodayOnly(oldData.workoutHistory || [], 'date'),
      focus: filterTodayOnly(oldData.focusLogs || []),
      mentalHealth: filterTodayOnly(oldData.mentalHealthLogs || [])
    },
    
    // Tasks
    tasks: {
      focus: oldData.focusTasks || []
    },
    
    // Custom
    custom: {
      workouts: oldData.customWorkouts || [],
      journal: oldData.journalEntries || []
    },
    
    // History (migrate from dailyArchives)
    history: migrateHistoricalData(oldData.dailyArchives || {}),
    
    // Current workout progress (preserve as-is)
    currentWorkoutProgress: oldData.currentWorkoutProgress || null,
    
    // Metadata
    metadata: {
      schemaVersion: '2.0.0',
      lastMigration: new Date().toISOString(),
      dataRetentionDays: 365
    }
  };
}

function migrateHistoricalData(dailyArchives) {
  const history = {};
  
  for (const [date, archive] of Object.entries(dailyArchives)) {
    const focusGoalMet = (archive.progress?.focusProgress || 0) >= 60;
    const allGoalsMet =
      (archive.progress?.waterGoalMet || false) &&
      (archive.progress?.dietGoalMet || false) &&
      (archive.progress?.workoutCompleted || false) &&
      focusGoalMet;
      
    history[date] = {
      date: date,
      archivedAt: archive.archived || new Date().toISOString(),
      progress: {
        water: archive.progress?.waterProgress || 0,
        calories: archive.progress?.dietCalories || 0,
        focus: archive.progress?.focusProgress || 0,
        mentalHealth: archive.progress?.mentalHealthProgress || 0
      },
      goalsCompleted: {
        water: archive.progress?.waterGoalMet || false,
        calories: archive.progress?.dietGoalMet || false,
        focus: focusGoalMet,
        workout: archive.progress?.workoutCompleted || false,
        allGoalsMet: allGoalsMet
      },
      activities: {
        water: archive.activities?.water || [],
        meals: archive.activities?.meals || [],
        workouts: archive.activities?.workouts || [],
        focus: archive.activities?.focus || [],
        mentalHealth: archive.activities?.mentalWellness || []
      }
    };
  }
  
  return history;
}

// Convert new schema back to old format for backward compatibility
export function convertToOldSchema(newData) {
  return {
    // Profile fields
    level: newData.profile?.level || 1,
    xp: newData.profile?.xp || 0,
    streakDays: newData.profile?.streakDays || 0,
    streakCount: newData.profile?.streakDays || 0, // Duplicate for compatibility
    lastActiveDate: newData.profile?.lastActiveDate || null,
    lastStreakDate: newData.profile?.lastStreakDate || null,
    calendar: [], // Deprecated, use history instead
    
    // Goals
    waterGoal: newData.goals?.water?.target || 3000,
    dailyCalorieGoal: newData.goals?.calories?.target || 2000,
    dailyFocusGoal: newData.goals?.focus?.target || 60,
    
    // Today's progress
    waterProgress: newData.today?.progress?.water || 0,
    dietCalories: newData.today?.progress?.calories || 0,
    focusProgress: newData.today?.progress?.focus || 0,
    mentalHealthProgress: newData.today?.progress?.mentalHealth || 0,
    lastReset: newData.today?.lastReset || null,
    
    // Goal completion
    waterGoalMet: newData.today?.goalsCompleted?.water || false,
    dietGoalMet: newData.today?.goalsCompleted?.calories || false,
    workoutCompleted: newData.today?.goalsCompleted?.workout || false,
    
    // Activities
    waterLogs: newData.activities?.water || [],
    meals: newData.activities?.meals || [],
    workoutHistory: newData.activities?.workouts || [],
    focusLogs: newData.activities?.focus || [],
    mentalHealthLogs: newData.activities?.mentalHealth || [],
    
    // Tasks and custom
    focusTasks: newData.tasks?.focus || [],
    customWorkouts: newData.custom?.workouts || [],
    journalEntries: newData.custom?.journal || [],
    
    // Historical data
    dailyArchives: newData.history || {},
    
    // Current workout
    currentWorkoutProgress: newData.currentWorkoutProgress || null
  };
}
