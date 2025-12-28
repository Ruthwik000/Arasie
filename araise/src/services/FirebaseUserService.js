import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export class FirebaseUserService {
  constructor(userId) {
    this.userId = userId;
    this.userRef = doc(db, 'users', userId);
    // Expose Firebase functions for direct access
    this.updateDoc = updateDoc;
    this.serverTimestamp = serverTimestamp;
  }

  // Load user progress from Firestore (NEW SCHEMA)
  async loadUserProgress() {
    try {
      const userDoc = await getDoc(this.userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Return new schema format directly
        return this.ensureSchemaStructure(data);
      }
      return this.getDefaultProgress();
    } catch (error) {
      console.error('Error loading user progress:', error);
      return this.getDefaultProgress();
    }
  }

  // Ensure data has complete new schema structure
  ensureSchemaStructure(data) {
    const today = new Date().toISOString().slice(0, 10);
    
    return {
      // User identity
      userId: data.userId || this.userId,
      email: data.email || null,
      displayName: data.displayName || null,
      createdAt: data.createdAt || new Date().toISOString(),
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      
      // Profile & Gamification
      profile: {
        level: data.profile?.level || 1,
        xp: data.profile?.xp || 0,
        streakDays: data.profile?.streakDays || 0,
        lastActiveDate: data.profile?.lastActiveDate || null,
        lastStreakDate: data.profile?.lastStreakDate || null
      },
      
      // Goals
      goals: {
        water: data.goals?.water || { target: 3000, unit: 'ml' },
        calories: data.goals?.calories || { target: 2000, unit: 'kcal' },
        focus: data.goals?.focus || { target: 60, unit: 'minutes' },
        workout: data.goals?.workout || { target: 1, unit: 'sessions' }
      },
      
      // Today's Progress
      today: {
        date: data.today?.date || today,
        lastReset: data.today?.lastReset || null,
        progress: {
          water: data.today?.progress?.water || 0,
          calories: data.today?.progress?.calories || 0,
          focus: data.today?.progress?.focus || 0,
          mentalHealth: data.today?.progress?.mentalHealth || 0
        },
        goalsCompleted: {
          water: data.today?.goalsCompleted?.water || false,
          calories: data.today?.goalsCompleted?.calories || false,
          focus: data.today?.goalsCompleted?.focus || false,
          workout: data.today?.goalsCompleted?.workout || false,
          allGoalsMet: data.today?.goalsCompleted?.allGoalsMet || false
        }
      },
      
      // Activities
      activities: {
        water: data.activities?.water || [],
        meals: data.activities?.meals || [],
        workouts: data.activities?.workouts || [],
        focus: data.activities?.focus || [],
        mentalHealth: data.activities?.mentalHealth || []
      },
      
      // Tasks
      tasks: {
        focus: data.tasks?.focus || []
      },
      
      // Custom Content
      custom: {
        workouts: data.custom?.workouts || [],
        journal: data.custom?.journal || []
      },
      
      // Historical Data
      history: data.history || {},
      
      // Metadata
      metadata: data.metadata || {
        schemaVersion: '2.0',
        lastMigration: null,
        dataRetentionDays: 365
      },
      
      // Calendar for streak tracking
      calendar: data.calendar || []
    };
  }

  // Get default progress structure (NEW SCHEMA)
  getDefaultProgress() {
    const today = new Date().toISOString().slice(0, 10);
    
    return {
      // User identity
      userId: this.userId,
      email: null,
      displayName: null,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      
      // Profile & Gamification
      profile: {
        level: 1,
        xp: 0,
        streakDays: 0,
        lastActiveDate: null,
        lastStreakDate: null
      },
      
      // Goals
      goals: {
        water: { target: 3000, unit: 'ml' },
        calories: { target: 2000, unit: 'kcal' },
        focus: { target: 60, unit: 'minutes' },
        workout: { target: 1, unit: 'sessions' }
      },
      
      // Today's Progress
      today: {
        date: today,
        lastReset: null,
        progress: {
          water: 0,
          calories: 0,
          focus: 0,
          mentalHealth: 0
        },
        goalsCompleted: {
          water: false,
          calories: false,
          focus: false,
          workout: false,
          allGoalsMet: false
        }
      },
      
      // Activities
      activities: {
        water: [],
        meals: [],
        workouts: [],
        focus: [],
        mentalHealth: []
      },
      
      // Tasks
      tasks: {
        focus: []
      },
      
      // Custom Content
      custom: {
        workouts: [],
        journal: []
      },
      
      // Historical Data
      history: {},
      
      // Metadata
      metadata: {
        schemaVersion: '2.0',
        lastMigration: new Date().toISOString(),
        dataRetentionDays: 365
      },
      
      // Calendar for streak tracking
      calendar: []
    };
  }

  // Save complete user progress to Firestore
  async saveUserProgress(progressData) {
    try {
      await updateDoc(this.userRef, {
        ...progressData,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  // Update water goal (NEW SCHEMA)
  async updateWaterGoal(newGoal) {
    try {
      await updateDoc(this.userRef, {
        'goals.water.target': newGoal,
        'goals.water.unit': 'ml',
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating water goal:', error);
      throw error;
    }
  }

  // Update focus goal (NEW SCHEMA)
  async updateFocusGoal(newGoal) {
    try {
      await updateDoc(this.userRef, {
        'goals.focus.target': newGoal,
        'goals.focus.unit': 'minutes',
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating focus goal:', error);
      throw error;
    }
  }

  // Update calorie goal (NEW SCHEMA)
  async updateCalorieGoal(newGoal) {
    try {
      await updateDoc(this.userRef, {
        'goals.calories.target': newGoal,
        'goals.calories.unit': 'kcal',
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating calorie goal:', error);
      throw error;
    }
  }

  // Update workout goal (NEW SCHEMA)
  async updateWorkoutGoal(newGoal) {
    try {
      await updateDoc(this.userRef, {
        'goals.workout.target': newGoal,
        'goals.workout.unit': 'sessions',
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating workout goal:', error);
      throw error;
    }
  }

  // Log water intake (NEW SCHEMA)
  async logWater(amount, currentProgress, waterGoal, currentLogs) {
    const newProgress = currentProgress + amount;
    const waterGoalMet = newProgress >= waterGoal;
    const newLog = {
      id: Date.now(),
      amount,
      time: new Date().toISOString()
    };

    const updates = {
      'today.progress.water': newProgress,
      'today.goalsCompleted.water': waterGoalMet,
      'activities.water': [...currentLogs, newLog],
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newProgress, waterGoalMet, newLog };
  }

  // Log meal (NEW SCHEMA)
  async logMeal(meal, currentMeals, currentCalories) {
    const newMeal = {
      id: Date.now(),
      ...meal,
      time: new Date().toISOString()
    };
    const newCalories = currentCalories + meal.calories;
    const dietGoalMet = currentMeals.length + 1 >= 3; // 3 meals minimum

    const updates = {
      'today.progress.calories': newCalories,
      'today.goalsCompleted.calories': dietGoalMet,
      'activities.meals': [...currentMeals, newMeal],
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newMeal, newCalories, dietGoalMet };
  }

  // Save workout progress (in-progress session) to Firestore
  async saveWorkoutProgress(workoutSessionData) {
    if (!workoutSessionData || !workoutSessionData.exercises) {
      console.warn('saveWorkoutProgress: No workout data to save');
      return;
    }

    // Save the current workout session progress to a separate field
    const progressData = {
      id: workoutSessionData.id,
      planName: workoutSessionData.planName,
      planId: workoutSessionData.planId,
      dayId: workoutSessionData.dayId,
      type: workoutSessionData.type,
      startTime: workoutSessionData.startTime,
      currentExercise: workoutSessionData.currentExercise,
      exercises: workoutSessionData.exercises.map(ex => ({
        exerciseName: ex.exerciseName,
        sets: ex.sets,
        reps: ex.reps,
        completed: ex.completed || false,
        completedSets: ex.completedSets || 0,
        setProgress: ex.setProgress || {}
      })),
      lastUpdated: new Date().toISOString()
    };

    // Save to a separate field for in-progress workouts
    const updates = {
      currentWorkoutProgress: progressData,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
  }

  // Load workout progress (in-progress session) from Firestore
  async loadWorkoutProgress(planId, dayId = null) {
    try {
      const userDoc = await getDoc(this.userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const progress = data.currentWorkoutProgress;
        
        // Check if the saved progress matches the requested workout
        if (progress && progress.planId === planId) {
          if (dayId && progress.dayId !== dayId) {
            return null;
          }
          return progress;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading workout progress:', error);
      return null;
    }
  }

  // Clear workout progress after completion
  async clearWorkoutProgress() {
    const updates = {
      currentWorkoutProgress: null,
      lastUpdated: serverTimestamp()
    };
    await updateDoc(this.userRef, updates);
  }

  // Save workout session with real exercise data (NEW SCHEMA)
  async saveWorkoutSession(workoutSessionData, currentHistory) {
    if (!workoutSessionData || !workoutSessionData.exercises || workoutSessionData.exercises.length === 0) {
      return { newHistory: currentHistory };
    }

    const today = new Date().toISOString().slice(0, 10);

    // Calculate totals for summary
    const totalSets = workoutSessionData.exercises.reduce((sum, ex) => 
      sum + (parseInt(ex.sets) || parseInt(ex.totalSets) || 1), 0
    );
    const completedSets = workoutSessionData.exercises.reduce((sum, ex) => 
      sum + (ex.completedSets || 0), 0
    );
    const totalExercises = workoutSessionData.exercises.length;
    const completedExercises = workoutSessionData.exercises.filter(ex => ex.completed).length;

    // Create workout object with complete schema
    const workout = {
      id: workoutSessionData.id || Date.now(),
      planName: workoutSessionData.planName || "Workout Session",
      planId: workoutSessionData.planId,
      dayId: workoutSessionData.dayId,
      category: workoutSessionData.category || workoutSessionData.type,
      type: workoutSessionData.type || "custom",
      status: workoutSessionData.status || "completed",
      startTime: workoutSessionData.startTime,
      endTime: workoutSessionData.endTime,
      duration: workoutSessionData.duration || 30,
      
      // Exercise data with proper structure
      exercises: workoutSessionData.exercises.map(exercise => ({
        name: exercise.exerciseName || exercise.name || "Exercise",
        exerciseName: exercise.exerciseName || exercise.name || "Exercise",
        sets: parseInt(exercise.sets) || parseInt(exercise.totalSets) || 1,  // Target sets
        reps: exercise.reps || 12,  // Target reps (can be string like "8-12")
        weight: exercise.weight || 0,
        completed: exercise.completed || false,
        completedSets: exercise.completedSets || 0,
        setProgress: exercise.setProgress || {},
        poseAnalyzer: exercise.poseAnalyzer || exercise.pose_analyzer || { used: false },
        // Preserve additional exercise data
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscles: exercise.secondaryMuscles,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        description: exercise.description,
        video: exercise.video
      })),
      
      // Summary with accurate progress calculation
      summary: {
        totalExercises: totalExercises,
        completedExercises: completedExercises,
        totalSets: totalSets,
        completedSets: completedSets,
        completionPercentage: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
      }
    };

    // Add optional fields only if they have values
    if (workoutSessionData.totalVolume) workout.totalVolume = workoutSessionData.totalVolume;
    if (workoutSessionData.totalDistance) workout.totalDistance = workoutSessionData.totalDistance;
    if (workoutSessionData.totalCalories) workout.totalCalories = workoutSessionData.totalCalories;
    if (workoutSessionData.avgHeartRate) workout.avgHeartRate = workoutSessionData.avgHeartRate;

    const newHistory = [...currentHistory, workout];

    const updates = {
      'today.goalsCompleted.workout': true,
      'activities.workouts': newHistory,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newHistory };
  }

  // Clean up duplicate workouts and fix data structure
  async cleanupWorkoutHistory(currentHistory) {
    // Remove duplicates and fix old data format
    const cleanedHistory = [];
    const seenWorkouts = new Set();

    for (const workout of currentHistory) {
      // Create a unique key for the workout
      const workoutKey = `${workout.date}_${workout.planName || workout.name}_${workout.planId || workout.splitId}`;
      
      // Skip if we've already seen this workout
      if (seenWorkouts.has(workoutKey)) {
        continue;
      }
      
      // Fix old data format
      const cleanedWorkout = {
        id: workout.id || Date.now(),
        type: workout.type || "split",
        planName: workout.planName || workout.name || `${workout.splitId} - ${workout.dayId}`,
        planId: workout.planId || workout.splitId,
        dayId: workout.dayId,
        date: workout.date,
        duration: workout.duration || 30,
        exercises: Array.isArray(workout.exercises) ? workout.exercises : [],
        completed: true
      };

      // Only add if it has valid data
      if (cleanedWorkout.date && cleanedWorkout.planName) {
        cleanedHistory.push(cleanedWorkout);
        seenWorkouts.add(workoutKey);
      }
    }

    // Update Firebase with cleaned data (NEW SCHEMA ONLY)
    const updates = {
      'activities.workouts': cleanedHistory,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { cleanedHistory };
  }

  // Save cardio workout (NEW SCHEMA)
  async saveCardioWorkout(cardioData, currentHistory) {
    const exercises = (cardioData.exercises || [{
      name: cardioData.exerciseType || "Cardio",
      duration: cardioData.duration,
      distance: cardioData.distance,
      speed: cardioData.speed,
      calories: cardioData.calories
    }]).map(ex => ({
      ...ex,
      sets: 1,  // Cardio counts as 1 set
      completed: true,
      completedSets: 1,
      setProgress: { "0": { completed: true, actualReps: null } }
    }));

    const workout = {
      id: Date.now(),
      planName: cardioData.name || "Cardio Session",
      type: "cardio",
      category: "cardio",
      status: "completed",
      startTime: cardioData.startTime || new Date().toISOString(),
      endTime: cardioData.endTime || new Date().toISOString(),
      duration: cardioData.duration || 30,
      
      exercises: exercises,
      
      summary: {
        totalExercises: exercises.length,
        completedExercises: exercises.length,
        totalSets: exercises.length,
        completedSets: exercises.length
      },
      
      totalDistance: cardioData.distance,
      totalCalories: cardioData.calories,
      avgHeartRate: cardioData.heartRate
    };

    const newHistory = [...currentHistory, workout];

    const updates = {
      'today.goalsCompleted.workout': true,
      'activities.workouts': newHistory,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newHistory };
  }

  // Add streak (NEW SCHEMA)
  async addStreak(date, currentStreak, currentCalendar, currentLevel) {
    const newStreak = currentStreak + 1;
    const newCalendar = [...currentCalendar, { date, completed: true }];

    // Level up every 30 streak days
    const newLevel = newStreak % 30 === 0 ? currentLevel + 1 : currentLevel;

    const updates = {
      'profile.streakDays': newStreak,
      'profile.level': newLevel,
      'profile.lastActiveDate': date,
      'profile.lastStreakDate': date,
      calendar: newCalendar, // Keep calendar for backward compatibility
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newStreak, newCalendar, newLevel };
  }

  // Reset streak to 0 (NEW SCHEMA)
  async resetStreak() {
    const updates = {
      'profile.streakDays': 0,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { streakDays: 0 };
  }

  // Archive current day data before reset
  async archiveDayData(date, data) {
    try {
      // Get existing daily archives
      const dailyArchives = data.dailyArchives || {};
      
      // Archive current day's data
      const dayArchive = {
        date,
        archived: new Date().toISOString(),
        activities: {
          water: (data.waterLogs || []).filter(log => {
            if (!log.time) return false;
            try {
              return new Date(log.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          meals: (data.meals || []).filter(meal => {
            if (!meal.time) return false;
            try {
              return new Date(meal.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          workouts: (data.workoutHistory || []).filter(workout => workout.date === date),
          focus: (data.focusTasks || []).filter(task => task.date === date),
          mentalWellness: (data.mentalHealthLogs || []).filter(log => {
            if (!log.time) return false;
            try {
              return new Date(log.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          })
        },
        progress: {
          waterProgress: data.waterProgress || 0,
          dietCalories: data.dietCalories || 0,
          focusProgress: data.focusProgress || 0,
          mentalHealthProgress: data.mentalHealthProgress || 0,
          workoutCompleted: data.workoutCompleted || false,
          waterGoalMet: data.waterGoalMet || false,
          dietGoalMet: data.dietGoalMet || false
        }
      };

      // Only archive if there's actual data
      const hasData = dayArchive.activities.water.length > 0 ||
                     dayArchive.activities.meals.length > 0 ||
                     dayArchive.activities.workouts.length > 0 ||
                     dayArchive.activities.focus.length > 0 ||
                     dayArchive.activities.mentalWellness.length > 0;

      if (hasData) {
        dailyArchives[date] = dayArchive;
        return dailyArchives;
      }

      return dailyArchives;
    } catch (error) {
      console.error('Error archiving day data:', error);
      return data.dailyArchives || {};
    }
  }

  // Reset daily progress with proper archiving (NEW SCHEMA)
  async resetDaily() {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    try {
      const userDoc = await getDoc(this.userRef);
      if (!userDoc.exists()) return false;

      const data = userDoc.data();

      // Check if we already reset today
      const lastReset = data.today?.lastReset || data.lastReset;
      if (lastReset === today) return false;

      // Archive yesterday's data before resetting
      await this.archiveToHistory(yesterdayStr, data);

      // Clear current day data using new schema
      const updates = {
        'today.date': today,
        'today.lastReset': today,
        'today.progress.water': 0,
        'today.progress.calories': 0,
        'today.progress.mentalHealth': 0,
        'today.progress.focus': 0,
        'today.goalsCompleted.water': false,
        'today.goalsCompleted.calories': false,
        'today.goalsCompleted.workout': false,
        'today.goalsCompleted.allGoalsMet': false,
        
        // Clear current day arrays
        'activities.water': [],
        'activities.meals': [],
        'activities.mentalHealth': [],
        'activities.focus': [],
        
        // Keep focus tasks for today
        'tasks.focus': (data.tasks?.focus || []).filter(task => task.date === today),
        
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);
      return true;
    } catch (error) {
      console.error('Error resetting daily progress:', error);
      return false;
    }
  }

  // Archive day data to history (NEW SCHEMA)
  async archiveToHistory(date, data) {
    try {
      const userDoc = await getDoc(this.userRef);
      if (!userDoc.exists()) return;

      // Create historical entry from new schema
      const historyEntry = {
        date: date,
        archivedAt: new Date().toISOString(),
        progress: {
          water: data.today?.progress?.water || 0,
          calories: data.today?.progress?.calories || 0,
          focus: data.today?.progress?.focus || 0,
          mentalHealth: data.today?.progress?.mentalHealth || 0
        },
        goalsCompleted: {
          water: data.today?.goalsCompleted?.water || false,
          calories: data.today?.goalsCompleted?.calories || false,
          workout: data.today?.goalsCompleted?.workout || false,
          focus: data.today?.goalsCompleted?.focus || false,
          allGoalsMet: data.today?.goalsCompleted?.allGoalsMet || false
        },
        activities: {
          water: (data.activities?.water || []).filter(log => {
            if (!log.time) return false;
            try {
              return new Date(log.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          meals: (data.activities?.meals || []).filter(meal => {
            if (!meal.time) return false;
            try {
              return new Date(meal.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          workouts: (data.activities?.workouts || []).filter(workout => {
            if (!workout.startTime) return false;
            try {
              return new Date(workout.startTime).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          focus: (data.activities?.focus || []).filter(log => {
            if (!log.time) return false;
            try {
              return new Date(log.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          }),
          mentalHealth: (data.activities?.mentalHealth || []).filter(log => {
            if (!log.time) return false;
            try {
              return new Date(log.time).toISOString().slice(0, 10) === date;
            } catch { return false; }
          })
        }
      };

      // Only archive if there's actual data
      const hasData = historyEntry.activities.water.length > 0 ||
                     historyEntry.activities.meals.length > 0 ||
                     historyEntry.activities.workouts.length > 0 ||
                     historyEntry.activities.focus.length > 0 ||
                     historyEntry.activities.mentalHealth.length > 0;

      if (hasData) {
        await updateDoc(this.userRef, {
          [`history.${date}`]: historyEntry,
          lastUpdated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error archiving to history:', error);
    }
  }

  // Custom Workout Methods

  // Save a new custom workout (NEW SCHEMA)
  async saveCustomWorkout(workoutData, currentWorkouts) {
    const newWorkout = {
      id: Date.now(),
      ...workoutData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedWorkouts = [...currentWorkouts, newWorkout];

    const updates = {
      'custom.workouts': updatedWorkouts,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { newWorkout, updatedWorkouts };
  }

  // Update an existing custom workout (NEW SCHEMA)
  async updateCustomWorkout(workoutId, workoutData, currentWorkouts) {
    const updatedWorkouts = currentWorkouts.map(workout =>
      workout.id === workoutId
        ? { ...workout, ...workoutData, lastModified: new Date().toISOString() }
        : workout
    );

    const updates = {
      'custom.workouts': updatedWorkouts,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedWorkouts };
  }

  // Delete a custom workout (NEW SCHEMA)
  async deleteCustomWorkout(workoutId, currentWorkouts) {
    const updatedWorkouts = currentWorkouts.filter(workout => workout.id !== workoutId);

    const updates = {
      'custom.workouts': updatedWorkouts,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedWorkouts };
  }

  // Get all custom workouts (NEW SCHEMA)
  async getCustomWorkouts() {
    try {
      const userDoc = await getDoc(this.userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.custom?.workouts || [];
      }
      return [];
    } catch (error) {
      console.error('Error loading custom workouts:', error);
      return [];
    }
  }



  // Focus Methods

  // Log focus session (NEW SCHEMA) - FIXED VERSION
  async logFocusSession(duration, task, completed, currentLogs) {
    console.log('[FirebaseUserService] logFocusSession called with:', { 
      duration, 
      task, 
      completed, 
      currentLogsCount: currentLogs?.length || 0 
    });
    
    // Validate inputs
    if (!duration || duration <= 0) {
      console.error('[FirebaseUserService] Invalid duration:', duration);
      return { newLog: null };
    }
    
    if (!task || typeof task !== 'string') {
      console.error('[FirebaseUserService] Invalid task name:', task);
      return { newLog: null };
    }
    
    const newLog = {
      id: Date.now(),
      taskName: task,
      duration: Number(duration),
      completed: Boolean(completed),
      time: new Date().toISOString()
    };

    console.log('[FirebaseUserService] Creating newLog:', newLog);

    // Ensure currentLogs is an array
    const safeCurrentLogs = Array.isArray(currentLogs) ? currentLogs : [];
    
    const updates = {
      'activities.focus': [...safeCurrentLogs, newLog],
      lastUpdated: serverTimestamp()
    };

    console.log('[FirebaseUserService] Saving to Firebase with updates:', {
      'activities.focus': `Array with ${safeCurrentLogs.length + 1} items`,
      lastUpdated: 'serverTimestamp()'
    });
    
    try {
      await updateDoc(this.userRef, updates);
      console.log('[FirebaseUserService] ✅ Successfully saved focus session to Firebase');
      console.log('[FirebaseUserService] New activities.focus array length:', safeCurrentLogs.length + 1);
      return { newLog };
    } catch (error) {
      console.error('[FirebaseUserService] ❌ Error saving focus session:', error);
      console.error('[FirebaseUserService] Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Update focus progress (NEW SCHEMA)
  async updateFocusProgress(totalMinutes, focusGoal) {
    try {
      const newProgress = Math.min((totalMinutes / focusGoal) * 100, 100);
      const focusGoalMet = totalMinutes >= focusGoal;

      const updates = {
        'today.progress.focus': newProgress,
        'today.goalsCompleted.focus': focusGoalMet,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);
      return { newProgress, focusGoalMet };
    } catch (error) {
      console.error('Error updating focus progress:', error);
      throw error;
    }
  }

  // Update allGoalsMet status (NEW SCHEMA)
  async updateAllGoalsMet(allGoalsMet) {
    try {
      const updates = {
        'today.goalsCompleted.allGoalsMet': allGoalsMet,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);
      return { allGoalsMet };
    } catch (error) {
      console.error('Error updating allGoalsMet:', error);
      throw error;
    }
  }

  // Save focus task (NEW SCHEMA)
  async saveFocusTask(taskData, currentTasks) {
    console.log('[FirebaseUserService] saveFocusTask called');
    console.log('[FirebaseUserService] taskData:', taskData);
    console.log('[FirebaseUserService] currentTasks count:', currentTasks.length);
    
    const startDate = taskData.date || new Date().toISOString().slice(0, 10);
    const tasksToCreate = [];

    // Create the main task for the selected date
    const mainTask = {
      id: Date.now(),
      ...taskData,
      status: 'upcoming',
      completed: 0,
      date: startDate,
      createdAt: new Date().toISOString(),
      isRepeating: taskData.repeat !== 'none',
      originalTaskId: null // This is the original task
    };

    console.log('[FirebaseUserService] mainTask created:', mainTask);
    tasksToCreate.push(mainTask);

    // Handle repeat functionality
    if (taskData.repeat === 'daily' || taskData.repeat === 'weekly') {
      console.log('[FirebaseUserService] Creating repeated tasks for:', taskData.repeat);
      const startDateObj = new Date(startDate);
      const endDate = taskData.repeatUntil ? new Date(taskData.repeatUntil) : null;
      const increment = taskData.repeat === 'daily' ? 1 : 7; // 1 day or 7 days
      let currentDate = new Date(startDateObj);
      currentDate.setDate(currentDate.getDate() + increment); // Start from next occurrence
      
      let dayCounter = 1;
      
      // Create repeated tasks until end date or reasonable limit
      while ((!endDate || currentDate <= endDate) && dayCounter <= 365) { // Max 1 year
        const futureDateStr = currentDate.toISOString().slice(0, 10);
        
        // Check if task already exists for this date
        const existingTask = currentTasks.find(task =>
          task.name === taskData.name &&
          task.date === futureDateStr &&
          task.originalTaskId === mainTask.id
        );

        if (!existingTask) {
          tasksToCreate.push({
            id: Date.now() + dayCounter, // Ensure unique IDs
            ...taskData,
            status: 'upcoming',
            completed: 0,
            date: futureDateStr,
            createdAt: new Date().toISOString(),
            isRepeating: true,
            originalTaskId: mainTask.id
          });
        }
        
        // Move to next occurrence
        currentDate.setDate(currentDate.getDate() + increment);
        dayCounter++;
      }
      console.log('[FirebaseUserService] Created', tasksToCreate.length, 'tasks total (including repeats)');
    }

    const updatedTasks = [...currentTasks, ...tasksToCreate];
    console.log('[FirebaseUserService] updatedTasks count:', updatedTasks.length);

    // Save to new schema location only
    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    console.log('[FirebaseUserService] Saving to Firestore with updates:', Object.keys(updates));
    try {
      await updateDoc(this.userRef, updates);
      console.log('[FirebaseUserService] ✅ Save successful! Saved', updatedTasks.length, 'tasks');
      return { newTask: mainTask, updatedTasks };
    } catch (error) {
      console.error('[FirebaseUserService] ❌ Save failed with error:', error);
      console.error('[FirebaseUserService] Error code:', error.code);
      console.error('[FirebaseUserService] Error message:', error.message);
      throw error;
    }
  }

  // Update an existing focus task (NEW SCHEMA)
  async updateFocusTask(taskId, updatedTaskData, currentTasks) {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...updatedTaskData,
          id: taskId, // Preserve the original ID
          createdAt: task.createdAt || task.created, // Preserve creation date
          lastModified: new Date().toISOString()
        };
      }
      return task;
    });

    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedTasks };
  }

  // Update focus task progress (NEW SCHEMA)
  async updateFocusTaskProgress(taskId, minutesCompleted, currentTasks) {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = task.completed + minutesCompleted;
        const newStatus = newCompleted >= task.planned ? 'completed' : 'in-progress';
        return {
          ...task,
          completed: Math.min(newCompleted, task.planned),
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return task;
    });

    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedTasks };
  }

  // Delete focus task (NEW SCHEMA)
  async deleteFocusTask(taskId, currentTasks) {
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);

    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedTasks };
  }

  // Delete entire series of repeated tasks (NEW SCHEMA)
  async deleteFocusTaskSeries(taskId, currentTasks) {
    const taskToDelete = currentTasks.find(task => task.id === taskId);
    if (!taskToDelete) {
      throw new Error('Task not found');
    }

    // Find the original task ID (either this task or its parent)
    const originalTaskId = taskToDelete.originalTaskId || taskId;

    // Delete all tasks in the series (original + all repeats)
    const updatedTasks = currentTasks.filter(task => 
      task.id !== originalTaskId && task.originalTaskId !== originalTaskId
    );

    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedTasks };
  }

  // Add reflection to focus task (NEW SCHEMA)
  async addFocusTaskReflection(taskId, reflection, currentTasks) {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completionDescription: reflection.trim(),
          lastUpdated: new Date().toISOString()
        };
      }
      return task;
    });

    const updates = {
      'tasks.focus': updatedTasks,
      lastUpdated: serverTimestamp()
    };

    await updateDoc(this.userRef, updates);
    return { updatedTasks };
  }

  // Get focus tasks
  async getFocusTasks() {
    try {
      const userDoc = await getDoc(this.userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Support both old and new schema for reading
        const tasks = data.tasks?.focus || data.focusTasks || [];

        // Check and create missing repeated tasks
        const updatedTasks = await this.checkAndCreateRepeatedTasks(tasks);

        // If new tasks were created, save them (NEW SCHEMA ONLY)
        if (updatedTasks.length > tasks.length) {
          await updateDoc(this.userRef, {
            'tasks.focus': updatedTasks,
            lastUpdated: serverTimestamp()
          });
        }

        return updatedTasks;
      }
      return [];
    } catch (error) {
      console.error('Error loading focus tasks:', error);
      return [];
    }
  }

  // Check and create missing repeated tasks
  async checkAndCreateRepeatedTasks(currentTasks) {
    const today = new Date().toISOString().slice(0, 10);
    const tasksToAdd = [];

    // Find all original repeating tasks
    const originalRepeatingTasks = currentTasks.filter(task =>
      task.isRepeating && task.originalTaskId === null
    );

    for (const originalTask of originalRepeatingTasks) {
      if (originalTask.repeat === 'daily') {
        // Check if we need to create today's task
        const todayTaskExists = currentTasks.some(task =>
          task.originalTaskId === originalTask.id && task.date === today
        );

        if (!todayTaskExists && originalTask.date !== today) {
          tasksToAdd.push({
            id: Date.now() + Math.random() * 1000,
            ...originalTask,
            id: Date.now() + Math.random() * 1000, // New unique ID
            status: 'upcoming',
            completed: 0,
            date: today,
            created: new Date().toISOString(),
            isRepeating: true,
            originalTaskId: originalTask.id
          });
        }

        // Create future daily tasks (next 7 days)
        for (let i = 1; i <= 7; i++) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + i);
          const futureDateStr = futureDate.toISOString().slice(0, 10);

          const futureTaskExists = currentTasks.some(task =>
            task.originalTaskId === originalTask.id && task.date === futureDateStr
          );

          if (!futureTaskExists) {
            tasksToAdd.push({
              id: Date.now() + Math.random() * 1000 + i,
              ...originalTask,
              id: Date.now() + Math.random() * 1000 + i, // New unique ID
              status: 'upcoming',
              completed: 0,
              date: futureDateStr,
              created: new Date().toISOString(),
              isRepeating: true,
              originalTaskId: originalTask.id
            });
          }
        }
      } else if (originalTask.repeat === 'weekly') {
        // Get the day of week from original task
        const originalDate = new Date(originalTask.date);
        const originalDayOfWeek = originalDate.getDay();
        const todayDate = new Date();
        const todayDayOfWeek = todayDate.getDay();

        // Check if today matches the original day of week
        if (originalDayOfWeek === todayDayOfWeek) {
          const todayTaskExists = currentTasks.some(task =>
            task.originalTaskId === originalTask.id && task.date === today
          );

          if (!todayTaskExists && originalTask.date !== today) {
            tasksToAdd.push({
              id: Date.now() + Math.random() * 1000,
              ...originalTask,
              id: Date.now() + Math.random() * 1000, // New unique ID
              status: 'upcoming',
              completed: 0,
              date: today,
              created: new Date().toISOString(),
              isRepeating: true,
              originalTaskId: originalTask.id
            });
          }
        }

        // Create future weekly tasks (next 4 weeks, same day of week)
        for (let i = 1; i <= 4; i++) {
          const futureDate = new Date();
          const daysUntilTargetDay = (originalDayOfWeek - todayDayOfWeek + 7) % 7;
          futureDate.setDate(futureDate.getDate() + daysUntilTargetDay + (i * 7));
          const futureDateStr = futureDate.toISOString().slice(0, 10);

          const futureTaskExists = currentTasks.some(task =>
            task.originalTaskId === originalTask.id && task.date === futureDateStr
          );

          if (!futureTaskExists) {
            tasksToAdd.push({
              id: Date.now() + Math.random() * 1000 + (i * 1000),
              ...originalTask,
              id: Date.now() + Math.random() * 1000 + (i * 1000), // New unique ID
              status: 'upcoming',
              completed: 0,
              date: futureDateStr,
              created: new Date().toISOString(),
              isRepeating: true,
              originalTaskId: originalTask.id
            });
          }
        }
      }
    }

    return [...currentTasks, ...tasksToAdd];
  }



  // Journal Entry Methods (NEW SCHEMA)
  async saveJournalEntry(entry) {
    try {
      const userDoc = await getDoc(this.userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      const currentEntries = currentData.custom?.journal || [];

      const updatedEntries = [entry, ...currentEntries];

      const updates = {
        'custom.journal': updatedEntries,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);

      return updatedEntries;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  async updateJournalEntry(entryId, updatedContent) {
    try {
      const userDoc = await getDoc(this.userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      const currentEntries = currentData.custom?.journal || [];

      const updatedEntries = currentEntries.map(entry =>
        entry.id === entryId
          ? { ...entry, content: updatedContent, lastModified: new Date().toISOString() }
          : entry
      );

      const updates = {
        'custom.journal': updatedEntries,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);

      return updatedEntries;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }

  async deleteJournalEntry(entryId) {
    try {
      const userDoc = await getDoc(this.userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      const currentEntries = currentData.custom?.journal || [];

      const updatedEntries = currentEntries.filter(entry => entry.id !== entryId);

      const updates = {
        'custom.journal': updatedEntries,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);

      return updatedEntries;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }



  // Add archived data directly to daily archives
  async addArchivedData(date, activities) {
    try {
      const userDoc = await getDoc(this.userRef);
      if (!userDoc.exists()) {
        console.error('User document does not exist');
        return;
      }

      const data = userDoc.data();
      const dailyArchives = data.dailyArchives || {};

      // Create archived day entry
      const dayArchive = {
        date,
        archived: new Date().toISOString(),
        activities: {
          water: activities.water || [],
          meals: activities.meals || [],
          workouts: activities.workouts || [],
          focus: activities.focus || [],
          mentalWellness: activities.mentalWellness || []
        },
        progress: {
          waterProgress: activities.water ? activities.water.reduce((sum, log) => sum + log.amount, 0) : 0,
          dietCalories: activities.meals ? activities.meals.reduce((sum, meal) => sum + meal.calories, 0) : 0,
          focusProgress: activities.focus ? Math.min((activities.focus.reduce((sum, task) => sum + (task.completed || 0), 0) / 60) * 100, 100) : 0,
          mentalHealthProgress: activities.mentalWellness ? 100 : 0,
          workoutCompleted: activities.workouts ? activities.workouts.length > 0 : false,
          waterGoalMet: activities.water ? activities.water.reduce((sum, log) => sum + log.amount, 0) >= 3000 : false, // Note: This is test data, using default 3L
          dietGoalMet: activities.meals ? activities.meals.reduce((sum, meal) => sum + meal.calories, 0) >= 2000 : false
        }
      };

      // Add to archives
      dailyArchives[date] = dayArchive;

      const updates = {
        dailyArchives,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);
    } catch (error) {
      console.error('Error adding archived data:', error);
    }
  }

  // Get activities for a specific date (checks both current data and new schema history)
  async getActivitiesForDate(date) {
    try {
      console.log('[FirebaseUserService] getActivitiesForDate called for:', date);
      
      // Force fresh fetch from Firestore (no cache)
      const userDoc = await getDoc(this.userRef);
      
      if (!userDoc.exists()) {
        console.warn('[FirebaseUserService] User document does not exist');
        return {
          water: [],
          diet: [],
          workout: [],
          focus: [],
          mentalWellness: []
        };
      }

      const data = userDoc.data();
      console.log('[FirebaseUserService] User data loaded, checking for date:', date);
      console.log('[FirebaseUserService] Available data keys:', Object.keys(data));
      
      // Don't convert the date - use it as-is since it's already in YYYY-MM-DD format
      const targetDate = date;
      const today = new Date().toISOString().slice(0, 10);
      
      console.log('[FirebaseUserService] Target date:', targetDate, 'Today:', today);

      let activities = {
        water: [],
        diet: [],
        workout: [],
        focus: [],
        mentalWellness: []
      };

      // For today, ALWAYS use current data from new schema
      if (targetDate === today) {
        console.log('[FirebaseUserService] Loading TODAY\'s data from current schema');
        console.log('[FirebaseUserService] activities.workouts count:', data.activities?.workouts?.length || 0);
        console.log('[FirebaseUserService] tasks.focus count:', data.tasks?.focus?.length || 0);
        
        // Get current data from NEW SCHEMA
        const completedWorkouts = (data.activities?.workouts || []).filter(workout => {
          if (!workout.startTime) return false;
          try {
            const workoutDate = new Date(workout.startTime).toISOString().slice(0, 10);
            return workoutDate === targetDate;
          } catch (error) {
            return false;
          }
        });

        console.log('[FirebaseUserService] Completed workouts for today:', completedWorkouts.length);

        // Check for in-progress workout for today
        const inProgressWorkout = data.currentWorkoutProgress;
        const workouts = [...completedWorkouts];
        
        if (inProgressWorkout && inProgressWorkout.startTime) {
          const workoutDate = new Date(inProgressWorkout.startTime).toISOString().slice(0, 10);
          
          if (workoutDate === targetDate) {
            // Add in-progress workout with special flag
            const inProgressWorkoutData = {
              ...inProgressWorkout,
              isInProgress: true,
              planName: inProgressWorkout.planName || 'In Progress',
              exercises: inProgressWorkout.exercises || [],
              id: inProgressWorkout.id || Date.now()
            };
            workouts.push(inProgressWorkoutData);
          }
        }

        activities = {
          water: (data.activities?.water || []).filter(log => {
            if (!log.time) return false;
            try {
              const logDate = new Date(log.time).toISOString().slice(0, 10);
              return logDate === targetDate;
            } catch (error) {
              console.warn('Invalid water log time format:', log.time);
              return false;
            }
          }),
          diet: (data.activities?.meals || []).filter(meal => {
            if (!meal.time) return false;
            try {
              const mealDate = new Date(meal.time).toISOString().slice(0, 10);
              return mealDate === targetDate;
            } catch (error) {
              console.warn('Invalid meal time format:', meal.time);
              return false;
            }
          }),
          workout: workouts,
          focus: (data.tasks?.focus || []).filter(task => {
            if (!task.date) return false;
            return task.date === targetDate;
          }),
          mentalWellness: (data.activities?.mentalHealth || []).filter(log => {
            if (!log.time) return false;
            try {
              const logDate = new Date(log.time).toISOString().slice(0, 10);
              return logDate === targetDate;
            } catch (error) {
              console.warn('Invalid mental health log time format:', log.time);
              return false;
            }
          })
        };
      } else {
        // For past dates, check NEW SCHEMA history first
        console.log('[FirebaseUserService] Loading PAST date data from history');
        console.log('[FirebaseUserService] Checking data.history for key:', targetDate);
        console.log('[FirebaseUserService] data.history exists:', !!data.history);
        
        if (data.history) {
          console.log('[FirebaseUserService] data.history keys:', Object.keys(data.history));
          console.log('[FirebaseUserService] Looking for exact key:', targetDate);
          console.log('[FirebaseUserService] Key exists in history:', targetDate in data.history);
        }
        
        const historyEntry = data.history?.[targetDate];
        console.log('[FirebaseUserService] historyEntry found:', !!historyEntry);
        
        if (historyEntry) {
          console.log('[FirebaseUserService] historyEntry keys:', Object.keys(historyEntry));
          console.log('[FirebaseUserService] historyEntry.activities exists:', !!historyEntry.activities);
          
          if (historyEntry.activities) {
            console.log('[FirebaseUserService] historyEntry.activities keys:', Object.keys(historyEntry.activities));
          }
        }
        
        if (historyEntry && historyEntry.activities) {
          console.log('[FirebaseUserService] Using data from NEW SCHEMA history');
          console.log('[FirebaseUserService] Raw meals data:', historyEntry.activities.meals);
          console.log('[FirebaseUserService] Raw water data:', historyEntry.activities.water);
          console.log('[FirebaseUserService] meals count:', historyEntry.activities.meals?.length || 0);
          console.log('[FirebaseUserService] water count:', historyEntry.activities.water?.length || 0);
          console.log('[FirebaseUserService] workouts count:', historyEntry.activities.workouts?.length || 0);
          console.log('[FirebaseUserService] focus count:', historyEntry.activities.focus?.length || 0);
          console.log('[FirebaseUserService] mentalHealth count:', historyEntry.activities.mentalHealth?.length || 0);
          
          // Use data from new schema history
          activities = {
            water: historyEntry.activities.water || [],
            diet: historyEntry.activities.meals || [],
            workout: historyEntry.activities.workouts || [],
            focus: historyEntry.activities.focus || [],
            mentalWellness: historyEntry.activities.mentalHealth || []
          };
          
          console.log('[FirebaseUserService] Final activities object:', {
            water: activities.water.length,
            diet: activities.diet.length,
            workout: activities.workout.length,
            focus: activities.focus.length,
            mentalWellness: activities.mentalWellness.length
          });
        } else {
          // Fallback: check old dailyArchives (backward compatibility)
          const dailyArchives = data.dailyArchives || {};
          const archivedData = dailyArchives[targetDate];
          
          if (archivedData && archivedData.activities) {
            activities = {
              water: archivedData.activities.water || [],
              diet: archivedData.activities.meals || [],
              workout: archivedData.activities.workouts || [],
              focus: archivedData.activities.focus || [],
              mentalWellness: archivedData.activities.mentalWellness || []
            };
          } else {
            // Last fallback: filter current arrays by date (for data not yet archived)
            activities = {
              water: (data.activities?.water || []).filter(log => {
                if (!log.time) return false;
                try {
                  const logDate = new Date(log.time).toISOString().slice(0, 10);
                  return logDate === targetDate;
                } catch (error) {
                  return false;
                }
              }),
              diet: (data.activities?.meals || []).filter(meal => {
                if (!meal.time) return false;
                try {
                  const mealDate = new Date(meal.time).toISOString().slice(0, 10);
                  return mealDate === targetDate;
                } catch (error) {
                  return false;
                }
              }),
              workout: (data.activities?.workouts || []).filter(workout => {
                if (!workout.startTime) return false;
                try {
                  const workoutDate = new Date(workout.startTime).toISOString().slice(0, 10);
                  return workoutDate === targetDate;
                } catch (error) {
                  return false;
                }
              }),
              focus: (data.tasks?.focus || []).filter(task => {
                if (!task.date) return false;
                return task.date === targetDate;
              }),
              mentalWellness: (data.activities?.mentalHealth || []).filter(log => {
                if (!log.time) return false;
                try {
                  const logDate = new Date(log.time).toISOString().slice(0, 10);
                  return logDate === targetDate;
                } catch (error) {
                  return false;
                }
              })
            };
          }
        }
      }

      console.log('[FirebaseUserService] Returning activities:', {
        water: activities.water.length,
        diet: activities.diet.length,
        workout: activities.workout.length,
        focus: activities.focus.length,
        mentalWellness: activities.mentalWellness.length
      });
      
      return activities;
    } catch (error) {
      console.error('[FirebaseUserService] Error getting activities for date:', error);
      return {
        water: [],
        diet: [],
        workout: [],
        focus: [],
        mentalWellness: []
      };
    }
  }



  // Real-time listener for user progress updates (NEW SCHEMA)
  subscribeToUserProgress(callback) {
    return onSnapshot(this.userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        
        // Return new schema format with ensured structure
        const structuredData = this.ensureSchemaStructure(data);
        
        // Add in-progress workout from new schema location
        const currentWorkoutProgress = data.currentWorkoutProgress || null;
        
        callback({
          ...structuredData,
          currentWorkoutSession: currentWorkoutProgress
        });
      }
    }, (error) => {
      console.error('Error listening to user progress updates:', error);
    });
  }

  // Mental Health Activity Logging (NEW SCHEMA)
  async updateMentalHealthProgress(newProgress) {
    try {
      const updates = {
        'today.progress.mentalHealth': newProgress,
        lastUpdated: serverTimestamp()
      };
      
      await updateDoc(this.userRef, updates);
      return { newProgress };
    } catch (error) {
      console.error('Error updating mental health progress:', error);
      throw error;
    }
  }

  async logMentalHealthActivity(activityLog, currentLogs) {
    try {
      const updatedLogs = [...currentLogs, activityLog];

      const updates = {
        'activities.mentalHealth': updatedLogs,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(this.userRef, updates);

      return { updatedLogs };
    } catch (error) {
      console.error('Error logging mental health activity:', error);
      throw error;
    }
  }

  // XP Data Management (NEW SCHEMA)
  async loadXpData() {
    try {
      const userDoc = await getDoc(this.userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          xp: data.profile?.xp || 0,
          level: data.profile?.level || 1,
          streakDays: data.profile?.streakDays || 0,
          lastActiveDate: data.profile?.lastActiveDate || null,
          dailyXp: data.dailyXp || 0,
          lastStreakDate: data.profile?.lastStreakDate || null
        };
      }
      return {
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActiveDate: null,
        dailyXp: 0,
        lastStreakDate: null
      };
    } catch (error) {
      console.error('Error loading XP data:', error);
      throw error;
    }
  }

  async updateXpData(xpData) {
    try {
      const updates = {
        'profile.xp': xpData.xp,
        'profile.level': xpData.level,
        'profile.streakDays': xpData.streakDays,
        'profile.lastActiveDate': xpData.lastActiveDate,
        'profile.lastStreakDate': xpData.lastStreakDate,
        lastUpdated: serverTimestamp()
      };
      
      await updateDoc(this.userRef, updates);
    } catch (error) {
      console.error('Error updating XP data:', error);
      throw error;
    }
  }

  // Ensure all historical data is properly archived
  async ensureHistoricalDataArchived() {
    try {
      const userDoc = await getDoc(this.userRef);
      if (!userDoc.exists()) return;

      const data = userDoc.data();
      const dailyArchives = data.dailyArchives || {};
      const today = new Date().toISOString().slice(0, 10);
      
      // Get all unique dates from current data
      const allDates = new Set();
      
      // Add dates from water logs
      (data.waterLogs || []).forEach(log => {
        if (log.time) {
          try {
            const date = new Date(log.time).toISOString().slice(0, 10);
            if (date !== today) allDates.add(date);
          } catch (e) {}
        }
      });
      
      // Add dates from meals
      (data.meals || []).forEach(meal => {
        if (meal.time) {
          try {
            const date = new Date(meal.time).toISOString().slice(0, 10);
            if (date !== today) allDates.add(date);
          } catch (e) {}
        }
      });
      
      // Add dates from workout history
      (data.workoutHistory || []).forEach(workout => {
        if (workout.date && workout.date !== today) {
          allDates.add(workout.date);
        }
      });
      
      // Add dates from focus tasks
      (data.focusTasks || []).forEach(task => {
        if (task.date && task.date !== today) {
          allDates.add(task.date);
        }
      });
      
      // Add dates from mental health logs
      (data.mentalHealthLogs || []).forEach(log => {
        if (log.time) {
          try {
            const date = new Date(log.time).toISOString().slice(0, 10);
            if (date !== today) allDates.add(date);
          } catch (e) {}
        }
      });

      // Archive any dates that don't have archived data yet
      let updatedArchives = { ...dailyArchives };
      let hasUpdates = false;

      for (const date of allDates) {
        if (!updatedArchives[date]) {
          updatedArchives = await this.archiveDayData(date, data);
          hasUpdates = true;
        }
      }

      // Save updated archives if we made changes
      if (hasUpdates) {
        await updateDoc(this.userRef, {
          dailyArchives: updatedArchives,
          lastUpdated: serverTimestamp()
        });
      }

    } catch (error) {
      console.error('Error ensuring historical data archived:', error);
    }
  }


}