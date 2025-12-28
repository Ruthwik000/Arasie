import { create } from 'zustand'
import { FirebaseUserService } from '../services/FirebaseUserService'
import { useXpStore } from './xpStore'

export const useUserStore = create((set, get) => ({
      // User profile & authentication
      user: null, // Firebase user object
      name: null, // Will be set when authenticated
      level: 1,
      isAuthenticated: false,
      email: null,
      firebaseService: null, // Will be set when user logs in

      // NEW SCHEMA: Profile & Gamification
      profile: {
        level: 1,
        xp: 0,
        streakDays: 0,
        lastActiveDate: null,
        lastStreakDate: null
      },

      // NEW SCHEMA: Goals
      goals: {
        water: { target: 3000, unit: 'ml' },
        calories: { target: 2000, unit: 'kcal' },
        focus: { target: 60, unit: 'minutes' },
        workout: { target: 1, unit: 'sessions' }
      },

      // NEW SCHEMA: Today's Progress
      today: {
        date: new Date().toISOString().slice(0, 10),
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

      // NEW SCHEMA: Activities
      activities: {
        water: [],
        meals: [],
        workouts: [],
        focus: [],
        mentalHealth: []
      },

      // NEW SCHEMA: Tasks
      tasks: {
        focus: []
      },

      // NEW SCHEMA: Custom Content
      custom: {
        workouts: [],
        journal: []
      },

      // DEPRECATED: Keep for backward compatibility (computed from new schema)
      streakCount: 0,
      calendar: [],
      waterProgress: 0,
      waterGoal: 3000,
      dietCalories: 0,
      workoutCompleted: false,
      waterGoalMet: false,
      dietGoalMet: false,
      mentalHealthProgress: 0,
      focusProgress: 0,
      dailyFocusGoal: 60,
      dailyCalorieGoal: 2000,
      meals: [],
      waterLogs: [],
      workoutHistory: [],
      mentalHealthLogs: [],
      focusLogs: [],
      focusTasks: [],
      customWorkouts: [],
      journalEntries: [],

      // Real-time subscription
      unsubscribeFromUpdates: null,

      // UI state
      isChatOpen: false,
      mentalHealthSubSection: null, // Track active mental health sub-section
      focusSubSection: null, // Track active focus sub-section

      // Workout session state
      currentWorkoutSession: null,
      workoutStartTime: null,

      // Helper: Sync deprecated fields from new schema (for backward compatibility)
      syncDeprecatedFields: () => {
        const state = get();
        set({
          // Sync from profile
          level: state.profile.level,
          streakCount: state.profile.streakDays,
          
          // Sync from today.progress
          waterProgress: state.today.progress.water,
          dietCalories: state.today.progress.calories,
          mentalHealthProgress: state.today.progress.mentalHealth,
          focusProgress: state.today.progress.focus,
          
          // Sync from today.goalsCompleted
          workoutCompleted: state.today.goalsCompleted.workout,
          waterGoalMet: state.today.goalsCompleted.water,
          dietGoalMet: state.today.goalsCompleted.calories,
          
          // Sync from goals
          waterGoal: state.goals.water.target,
          dailyFocusGoal: state.goals.focus.target,
          dailyCalorieGoal: state.goals.calories.target,
          
          // Sync from activities
          waterLogs: state.activities.water,
          meals: state.activities.meals,
          workoutHistory: state.activities.workouts,
          focusLogs: state.activities.focus,
          mentalHealthLogs: state.activities.mentalHealth,
          
          // Sync from tasks
          focusTasks: state.tasks.focus,
          
          // Sync from custom
          customWorkouts: state.custom.workouts,
          journalEntries: state.custom.journal
        });
      },

      // User actions
      updateName: (name) => set({ name }),
      updateLevel: (level) => {
        set((state) => ({
          level,
          profile: { ...state.profile, level }
        }));
      },
      updateWaterGoal: async (goal) => {
        const state = get();
        set((state) => ({
          waterGoal: goal,
          goals: {
            ...state.goals,
            water: { target: goal, unit: 'ml' }
          }
        }));

        // Also update in Firebase if available
        if (state.firebaseService && state.firebaseService.updateWaterGoal) {
          try {
            await state.firebaseService.updateWaterGoal(goal);
          } catch (error) {
            console.error('Error updating water goal in Firebase:', error);
          }
        }
      },

      updateFocusGoal: async (goal) => {
        const state = get();
        set((state) => ({
          dailyFocusGoal: goal,
          goals: {
            ...state.goals,
            focus: { target: goal, unit: 'minutes' }
          }
        }));

        // Update in Firebase if available
        if (state.firebaseService) {
          try {
            await state.firebaseService.updateFocusGoal(goal);
          } catch (error) {
            console.error('Error updating focus goal in Firebase:', error);
          }
        }
      },

      updateCalorieGoal: async (goal) => {
        const state = get();
        set((state) => ({
          dailyCalorieGoal: goal,
          goals: {
            ...state.goals,
            calories: { target: goal, unit: 'kcal' }
          }
        }));

        // Update in Firebase if available
        if (state.firebaseService) {
          try {
            await state.firebaseService.updateCalorieGoal(goal);
          } catch (error) {
            console.error('Error updating calorie goal in Firebase:', error);
          }
        }
      },

      updateWorkoutGoal: async (goal) => {
        const state = get();
        set((state) => ({
          goals: {
            ...state.goals,
            workout: { target: goal, unit: 'sessions' }
          }
        }));

        // Update in Firebase if available
        if (state.firebaseService) {
          try {
            await state.firebaseService.updateWorkoutGoal(goal);
          } catch (error) {
            console.error('Error updating workout goal in Firebase:', error);
          }
        }
      },

      // UI actions
      setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      setMentalHealthSubSection: (section) => set({ mentalHealthSubSection: section }),
      setFocusSubSection: (section) => set({ focusSubSection: section }),



      // Authentication methods - updated to work with Firebase
      setUser: async (user) => {
        const firebaseService = user ? new FirebaseUserService(user.uid) : null;

        set({
          user,
          isAuthenticated: !!user,
          email: user?.email || null,
          name: user?.displayName || user?.email?.split('@')[0] || 'Guest',
          firebaseService
        });

        // Load user progress from Firebase when user logs in
        if (firebaseService) {
          try {
            const progress = await firebaseService.loadUserProgress();
            set(progress);
            
            // Sync deprecated fields for backward compatibility
            get().syncDeprecatedFields();

            // Set up real-time listener for updates
            const unsubscribe = firebaseService.subscribeToUserProgress((updates) => {
              set(updates);
              get().syncDeprecatedFields();
            });
            set({ unsubscribeFromUpdates: unsubscribe });

            // Reset daily progress if needed
            await firebaseService.resetDaily();

            // Ensure all historical data is properly archived
            await firebaseService.ensureHistoricalDataArchived();

            // Check for missed days and reset streak if necessary
            await get().checkAndResetStreakForMissedDays();

            // Update focus progress based on completed tasks
            await get().updateFocusProgress();

            // Initialize XP store with Firebase service
            const { initializeForUser } = await import('./xpStore');
            const xpStore = await import('./xpStore');
            await xpStore.useXpStore.getState().initializeForUser(user.uid, firebaseService);
          } catch (error) {
            console.error('Error loading user progress:', error);
          }
        }
      },

      logout: async () => {
        const state = get();

        // Unsubscribe from real-time updates
        if (state.unsubscribeFromUpdates) {
          state.unsubscribeFromUpdates();
        }

        // Clear XP store data
        const { useXpStore } = await import('./xpStore');
        useXpStore.getState().clearXpData();

        set({
          user: null,
          isAuthenticated: false,
          email: null,
          name: null,
          firebaseService: null,
          unsubscribeFromUpdates: null,
          
          // Reset NEW SCHEMA fields
          profile: {
            level: 1,
            xp: 0,
            streakDays: 0,
            lastActiveDate: null,
            lastStreakDate: null
          },
          goals: {
            water: { target: 3000, unit: 'ml' },
            calories: { target: 2000, unit: 'kcal' },
            focus: { target: 60, unit: 'minutes' },
            workout: { target: 1, unit: 'sessions' }
          },
          today: {
            date: new Date().toISOString().slice(0, 10),
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
          activities: {
            water: [],
            meals: [],
            workouts: [],
            focus: [],
            mentalHealth: []
          },
          tasks: {
            focus: []
          },
          custom: {
            workouts: [],
            journal: []
          },
          
          // Reset DEPRECATED fields
          waterProgress: 0,
          dietCalories: 0,
          workoutCompleted: false,
          waterGoalMet: false,
          dietGoalMet: false,
          mentalHealthProgress: 0,
          focusProgress: 0,
          meals: [],
          waterLogs: [],
          mentalHealthLogs: [],
          focusLogs: [],
          focusTasks: [],
          level: 1,
          streakCount: 0,
          calendar: [],
          workoutHistory: [],
          customWorkouts: [],
          journalEntries: []
        });
      },

      // Streak management
      addStreak: async (date) => {
        const state = get();
        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          // First check if we should reset streak before adding
          await get().checkAndResetStreakForMissedDays();

          // Get updated state after potential reset
          const updatedState = get();

          const { newStreak, newCalendar, newLevel } = await state.firebaseService.addStreak(
            date,
            updatedState.profile.streakDays,
            updatedState.calendar,
            updatedState.profile.level
          );

          set((state) => ({
            profile: {
              ...state.profile,
              streakDays: newStreak,
              level: newLevel,
              lastActiveDate: date,
              lastStreakDate: date
            },
            calendar: newCalendar
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error adding streak:', error);
        }
      },

      // Daily reset (call this at midnight or app start for new day)
      resetDaily: async () => {
        const state = get();

        // Check for missed days and reset streak if necessary
        await get().checkAndResetStreakForMissedDays();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const wasReset = await state.firebaseService.resetDaily();
          if (wasReset) {
            // Get today's date for filtering
            const today = new Date().toISOString().slice(0, 10);

            set((state) => ({
              today: {
                date: today,
                lastReset: new Date().toISOString(),
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
              activities: {
                water: [],
                meals: [],
                workouts: [],
                focus: [],
                mentalHealth: []
              },
              tasks: {
                focus: (state.tasks.focus || []).filter(task => task.date === today)
              }
            }));
            
            get().syncDeprecatedFields();
          }
        } catch (error) {
          console.error('Error resetting daily progress:', error);
        }
      },

      // Water tracking
      logWater: async (amount) => {
        const state = get();
        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { newProgress, waterGoalMet, newLog } = await state.firebaseService.logWater(
            amount,
            state.today.progress.water,
            state.goals.water.target,
            state.activities.water
          );

          set((state) => ({
            today: {
              ...state.today,
              progress: {
                ...state.today.progress,
                water: newProgress
              },
              goalsCompleted: {
                ...state.today.goalsCompleted,
                water: waterGoalMet
              }
            },
            activities: {
              ...state.activities,
              water: [...state.activities.water, newLog]
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging water:', error);
        }
      },

      // Diet tracking
      logMeal: async (meal) => {
        const state = get();
        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { newMeal, newCalories, dietGoalMet } = await state.firebaseService.logMeal(
            meal,
            state.activities.meals,
            state.today.progress.calories
          );

          set((state) => ({
            today: {
              ...state.today,
              progress: {
                ...state.today.progress,
                calories: newCalories
              },
              goalsCompleted: {
                ...state.today.goalsCompleted,
                calories: dietGoalMet
              }
            },
            activities: {
              ...state.activities,
              meals: [...state.activities.meals, newMeal]
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging meal:', error);
        }
      },

      // Workout tracking
      // Save workout session with real exercise data
      saveWorkoutSession: async (workoutSessionData) => {
        const state = get();

        if (!state.firebaseService) {
          return;
        }

        try {
          // If this is an in-progress workout, save to a different collection/field
          if (workoutSessionData.isInProgress) {
            // Save progress to Firebase without marking workout as completed
            if (state.firebaseService.saveWorkoutProgress) {
              await state.firebaseService.saveWorkoutProgress(workoutSessionData);
            }
            // Update current session in state
            set({ currentWorkoutSession: workoutSessionData });
            return;
          }

          // Check if the function exists for completed workouts
          if (!state.firebaseService.saveWorkoutSession) {
            // Fallback to old method with new data structure
            const legacyData = {
              type: workoutSessionData.type,
              planName: workoutSessionData.planName,
              planId: workoutSessionData.planId,
              dayId: workoutSessionData.dayId,
              duration: workoutSessionData.duration,
              exercises: workoutSessionData.exercises
            };

            const { newHistory } = await state.firebaseService.setWorkoutCompleted(
              legacyData,
              state.activities.workouts
            );

            set((state) => ({
              today: {
                ...state.today,
                goalsCompleted: {
                  ...state.today.goalsCompleted,
                  workout: true
                }
              },
              activities: {
                ...state.activities,
                workouts: newHistory
              }
            }));
            
            get().syncDeprecatedFields();
            return;
          }

          const { newHistory } = await state.firebaseService.saveWorkoutSession(
            workoutSessionData,
            state.activities.workouts
          );

          // Clear the in-progress workout since it's now completed
          if (state.firebaseService.clearWorkoutProgress) {
            await state.firebaseService.clearWorkoutProgress();
          }

          set((state) => ({
            today: {
              ...state.today,
              goalsCompleted: {
                ...state.today.goalsCompleted,
                workout: true
              }
            },
            activities: {
              ...state.activities,
              workouts: newHistory
            },
            currentWorkoutSession: null
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          // Error saving workout session
        }
      },



      // Load workout progress
      loadWorkoutProgress: async (planId, dayId = null) => {
        const state = get();
        if (!state.firebaseService || !state.firebaseService.loadWorkoutProgress) {
          return null;
        }

        try {
          const progress = await state.firebaseService.loadWorkoutProgress(planId, dayId);
          if (progress) {
            set({ currentWorkoutSession: progress });
          }
          return progress;
        } catch (error) {
          console.error('Error loading workout progress:', error);
          return null;
        }
      },

      // Clear workout progress from Firestore
      clearWorkoutProgress: async () => {
        const state = get();
        if (!state.firebaseService || !state.firebaseService.clearWorkoutProgress) {
          console.warn('[userStore] clearWorkoutProgress: Firebase service not available');
          return;
        }

        try {
          console.log('[userStore] Clearing workout progress from Firebase...');
          await state.firebaseService.clearWorkoutProgress();
          console.log('[userStore] Cleared from Firebase, now clearing local state...');
          
          // Also clear the local state
          set({ currentWorkoutSession: null });
          console.log('[userStore] Local state cleared');
        } catch (error) {
          console.error('[userStore] Error clearing workout progress:', error);
        }
      },

      // Start workout session
      startWorkoutSession: (workoutPlan) => {
        // First check if there's existing progress for this workout
        const state = get();

        const session = {
          id: Date.now(),
          planName: workoutPlan.planName,
          planId: workoutPlan.planId,
          dayId: workoutPlan.dayId,
          type: workoutPlan.type || "split",
          startTime: new Date().toISOString(),
          currentExercise: 0,
          exercises: workoutPlan.exercises.map(exercise => ({
            ...exercise,
            completed: false,
            completedSets: 0,
            completedReps: [],
            actualWeight: [],
            notes: "",
            setProgress: {}
          }))
        };

        set({
          currentWorkoutSession: session,
          workoutStartTime: new Date().toISOString()
        });

        // Try to load existing progress
        state.loadWorkoutProgress(workoutPlan.planId, workoutPlan.dayId);

        console.log('Workout session started:', session);
        return session;
      },

      // Update exercise in current session
      updateExerciseInSession: (exerciseIndex, updates) => {
        const state = get();
        if (!state.currentWorkoutSession) return;

        const updatedSession = {
          ...state.currentWorkoutSession,
          exercises: state.currentWorkoutSession.exercises.map((exercise, index) =>
            index === exerciseIndex ? { ...exercise, ...updates } : exercise
          )
        };

        set({ currentWorkoutSession: updatedSession });
      },

      // Complete workout session
      completeWorkoutSession: async () => {
        const state = get();
        if (!state.currentWorkoutSession) return;

        const endTime = new Date().toISOString();
        const startTime = new Date(state.workoutStartTime);
        const duration = Math.round((new Date(endTime) - startTime) / (1000 * 60)); // minutes

        const sessionData = {
          ...state.currentWorkoutSession,
          endTime,
          duration,
          totalVolume: state.currentWorkoutSession.exercises.reduce((sum, exercise) => {
            const weight = Array.isArray(exercise.actualWeight)
              ? exercise.actualWeight.reduce((a, b) => a + b, 0)
              : exercise.actualWeight || 0;
            const reps = Array.isArray(exercise.completedReps)
              ? exercise.completedReps.reduce((a, b) => a + b, 0)
              : exercise.completedReps || 0;
            return sum + (weight * reps);
          }, 0)
        };

        await state.saveWorkoutSession(sessionData);

        // Clear workout progress from Firestore
        await state.clearWorkoutProgress();

        // Clear session
        set({
          currentWorkoutSession: null,
          workoutStartTime: null
        });

        return sessionData;
      },

      // Cancel workout session
      cancelWorkoutSession: () => {
        set({
          currentWorkoutSession: null,
          workoutStartTime: null
        });
      },









      // Save cardio workout
      saveCardioWorkout: async (cardioData) => {
        const state = get();
        if (!state.firebaseService) {
          return;
        }

        try {
          const { newHistory } = await state.firebaseService.saveCardioWorkout(
            cardioData,
            state.activities.workouts
          );

          set((state) => ({
            today: {
              ...state.today,
              goalsCompleted: {
                ...state.today.goalsCompleted,
                workout: true
              }
            },
            activities: {
              ...state.activities,
              workouts: newHistory
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          // Silent error handling - could be logged to external service
        }
      },

      // Streak logic - check if all daily goals are met
      checkStreak: async () => {
        const state = get();

        // First, check for missed days and reset streak if necessary
        await get().checkAndResetStreakForMissedDays();

        // Check if all goals are met from new schema
        const allGoalsMet = 
          state.today.goalsCompleted.workout &&
          state.today.goalsCompleted.water &&
          state.today.goalsCompleted.calories &&
          state.today.goalsCompleted.focus;

        // Update allGoalsMet in state and Firebase
        if (allGoalsMet !== state.today.goalsCompleted.allGoalsMet) {
          set((state) => ({
            today: {
              ...state.today,
              goalsCompleted: {
                ...state.today.goalsCompleted,
                allGoalsMet
              }
            }
          }));

          // Update in Firebase
          if (state.firebaseService) {
            try {
              await state.firebaseService.updateAllGoalsMet(allGoalsMet);
            } catch (error) {
              console.error('Error updating allGoalsMet:', error);
            }
          }
        }

        if (allGoalsMet) {
          const today = new Date().toISOString().slice(0, 10);
          // Only add streak if not already added today
          if (!state.calendar.find(c => c.date === today && c.completed)) {
            await get().addStreak(today);
          }
        }
      },

      // Get XP and focus stats
      getXpStats: () => {
        const xpState = useXpStore.getState();
        const dailyProgress = xpState.getDailyProgress();

        return {
          totalXp: xpState.xp,
          level: xpState.level,
          streakDays: xpState.streakDays,
          dailyXp: dailyProgress.dailyXp,
          dailyThreshold: dailyProgress.threshold,
          dailyProgress: dailyProgress.progress,
          isThresholdReached: dailyProgress.isThresholdReached
        };
      },

      // Check for missed days and reset streak if necessary
      checkAndResetStreakForMissedDays: async () => {
        const state = get();
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        // If no streak, nothing to check
        if (state.streakCount === 0) {
          return;
        }

        // If no calendar entries, reset streak
        if (state.calendar.length === 0) {
          await get().resetStreak();
          return;
        }

        // Find the most recent completed day
        const completedDays = state.calendar
          .filter(c => c.completed)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // If no completed days but we have a streak, reset it
        if (completedDays.length === 0) {
          await get().resetStreak();
          return;
        }

        const lastCompletedDate = new Date(completedDays[0].date);
        const daysDifference = Math.floor((today - lastCompletedDate) / (1000 * 60 * 60 * 24));

        // If more than 1 day has passed since last completion, reset streak
        // Allow for same day (0 days) and yesterday (1 day), but reset if 2+ days
        if (daysDifference > 1) {
          await get().resetStreak();
        }
      },

      // Reset streak to 0
      resetStreak: async () => {
        const state = get();
        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          await state.firebaseService.resetStreak();
          set({ streakCount: 0 });
        } catch (error) {
          console.error('Error resetting streak:', error);
        }
      },

      // Get streak statistics
      getStreakStats: () => {
        const state = get()
        const currentStreak = state.streakCount
        const totalCompletedDays = state.calendar.filter(c => c.completed).length
        const thisWeek = state.calendar.filter(c => {
          const date = new Date(c.date)
          const today = new Date()
          const weekStart = new Date(today.getTime()) // Create a copy to avoid mutation
          weekStart.setDate(weekStart.getDate() - weekStart.getDay())
          return date >= weekStart && c.completed
        }).length

        return {
          currentStreak,
          totalCompletedDays,
          thisWeek
        }
      },



      // Get progress percentages for dashboard
      getProgressStats: () => {
        const state = get()
        return {
          workout: state.workoutCompleted ? 100 : 0,
          water: Math.min((state.waterProgress / state.waterGoal) * 100, 100),
          diet: state.dietGoalMet ? 100 : Math.min((state.meals.length / 3) * 100, 100),
          mentalHealth: state.mentalHealthProgress,
          focus: state.focusProgress
        }
      },

      // Mental Health tracking
      updateMentalHealthProgress: async (percentage) => {
        const state = get();
        const newProgress = Math.min(state.today.progress.mentalHealth + percentage, 100);

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          await state.firebaseService.updateMentalHealthProgress(newProgress);
          set((state) => ({
            today: {
              ...state.today,
              progress: {
                ...state.today.progress,
                mentalHealth: newProgress
              }
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error updating mental health progress:', error);
        }
      },

      // Add specific mental health activity tracking
      logBreathingSession: async (exerciseName, duration) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          type: 'breathing',
          activity: exerciseName,
          duration: duration,
          time: new Date().toISOString()
        };

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging breathing session:', error);
        }
      },

      logMeditationSession: async (meditationName, duration) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          type: 'meditation',
          activity: meditationName,
          duration: duration,
          time: new Date().toISOString()
        };

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging meditation session:', error);
        }
      },

      logSoundHealingSession: async (soundName, duration) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          type: 'sound_healing',
          activity: soundName,
          duration: duration,
          time: new Date().toISOString()
        };

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging sound healing session:', error);
        }
      },

      logMentalHealthEntry: async (mood, journalEntry = '') => {
        const state = get()
        const newLog = {
          id: Date.now(),
          type: 'mood_check',
          mood,
          journalEntry,
          time: new Date().toISOString()
        }

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging mental health entry:', error);
        }
      },

      // Focus tracking
      updateFocusProgress: async () => {
        const state = get();
        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const today = new Date().toISOString().slice(0, 10);
          
          // Get today's focus log sessions (pomodoro sessions only)
          const todaysFocusLogSessions = state.activities.focus.filter(log => 
            log.time && log.time.slice(0, 10) === today
          );
          const focusLogMinutes = todaysFocusLogSessions.reduce((total, session) => total + (session.duration || 0), 0);
          
          // Get today's completed tasks (custom tasks only)
          const todaysCompletedTasks = state.tasks.focus.filter(task => 
            task.date === today && task.status === 'completed'
          );
          const taskMinutes = todaysCompletedTasks.reduce((total, task) => total + (task.completed || task.planned || 0), 0);
          
          // Calculate total minutes
          const totalMinutes = focusLogMinutes + taskMinutes;
          
          const { newProgress, focusGoalMet } = await state.firebaseService.updateFocusProgress(
            totalMinutes,
            state.goals.focus.target
          );
          
          set((state) => ({
            today: {
              ...state.today,
              progress: {
                ...state.today.progress,
                focus: newProgress
              },
              goalsCompleted: {
                ...state.today.goalsCompleted,
                focus: focusGoalMet
              }
            }
          }));
          
          get().syncDeprecatedFields();
          
          // Check if all goals are met for streak
          await get().checkStreak();
        } catch (error) {
          console.error('Error updating focus progress:', error);
        }
      },

      logFocusSession: async (duration, task, completed = true) => {
        const state = get();
        console.log('[userStore] 🎯 logFocusSession called with:', { duration, task, completed });
        console.log('[userStore] Current activities.focus count:', state.activities?.focus?.length || 0);
        console.log('[userStore] Current activities.focus array:', state.activities?.focus);
        
        if (!state.firebaseService) {
          console.error('[userStore] ❌ Firebase service not available');
          return;
        }

        // Validate inputs
        if (!duration || duration <= 0) {
          console.error('[userStore] ❌ Invalid duration:', duration);
          return;
        }

        if (!task || typeof task !== 'string') {
          console.error('[userStore] ❌ Invalid task name:', task);
          return;
        }

        try {
          console.log('[userStore] 📤 Calling Firebase logFocusSession...');
          
          const { newLog } = await state.firebaseService.logFocusSession(
            duration,
            task,
            completed,
            state.activities?.focus || []
          );
          
          console.log('[userStore] 📥 Firebase returned newLog:', newLog);
          
          if (newLog) {
            set((state) => ({
              activities: {
                ...state.activities,
                focus: [...(state.activities?.focus || []), newLog]
              }
            }));
            
            console.log('[userStore] ✅ Updated activities.focus count:', get().activities?.focus?.length || 0);
            console.log('[userStore] Updated activities.focus array:', get().activities?.focus);
            
            get().syncDeprecatedFields();
          } else {
            console.error('[userStore] ❌ No newLog returned from Firebase');
          }
        } catch (error) {
          console.error('[userStore] ❌ Error logging focus session:', error);
        }
      },



      // Custom Workout Management
      saveCustomWorkout: async (workoutData) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { newWorkout, updatedWorkouts } = await state.firebaseService.saveCustomWorkout(
            workoutData,
            state.custom.workouts
          );

          // Sort workouts by creation date (latest first)
          const sortedWorkouts = updatedWorkouts.sort((a, b) => {
            const dateA = new Date(a.created || 0);
            const dateB = new Date(b.created || 0);
            return dateB - dateA;
          });
          
          set((state) => ({
            custom: {
              ...state.custom,
              workouts: sortedWorkouts
            }
          }));
          
          get().syncDeprecatedFields();
          return newWorkout;
        } catch (error) {
          console.error('Error saving custom workout:', error);
          throw error;
        }
      },

      updateCustomWorkout: async (workoutId, workoutData) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedWorkouts } = await state.firebaseService.updateCustomWorkout(
            workoutId,
            workoutData,
            state.custom.workouts
          );

          // Sort workouts by creation date (latest first)
          const sortedWorkouts = updatedWorkouts.sort((a, b) => {
            const dateA = new Date(a.created || 0);
            const dateB = new Date(b.created || 0);
            return dateB - dateA;
          });
          
          set((state) => ({
            custom: {
              ...state.custom,
              workouts: sortedWorkouts
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedWorkouts;
        } catch (error) {
          console.error('Error updating custom workout:', error);
          throw error;
        }
      },

      deleteCustomWorkout: async (workoutId) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedWorkouts } = await state.firebaseService.deleteCustomWorkout(
            workoutId,
            state.custom.workouts
          );

          // Sort workouts by creation date (latest first)
          const sortedWorkouts = updatedWorkouts.sort((a, b) => {
            const dateA = new Date(a.created || 0);
            const dateB = new Date(b.created || 0);
            return dateB - dateA;
          });
          
          set((state) => ({
            custom: {
              ...state.custom,
              workouts: sortedWorkouts
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedWorkouts;
        } catch (error) {
          console.error('Error deleting custom workout:', error);
          throw error;
        }
      },

      loadCustomWorkouts: async () => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return [];
        }

        try {
          const workouts = await state.firebaseService.getCustomWorkouts();
          // Sort workouts by creation date (latest first)
          const sortedWorkouts = workouts.sort((a, b) => {
            const dateA = new Date(a.created || 0);
            const dateB = new Date(b.created || 0);
            return dateB - dateA;
          });
          
          set((state) => ({
            custom: {
              ...state.custom,
              workouts: sortedWorkouts
            }
          }));
          
          get().syncDeprecatedFields();
          return sortedWorkouts;
        } catch (error) {
          console.error('Error loading custom workouts:', error);
          return [];
        }
      },

      loadFocusTasks: async () => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return [];
        }

        try {
          console.log('[userStore] loadFocusTasks: Loading tasks from Firebase...');
          const tasks = await state.firebaseService.getFocusTasks();
          console.log('[userStore] loadFocusTasks: Loaded', tasks.length, 'tasks');
          
          // Always create a new array reference to trigger React re-renders
          const newTasksArray = [...tasks];
          
          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: newTasksArray
            }
          }));
          
          console.log('[userStore] loadFocusTasks: State updated with new tasks array');
          
          get().syncDeprecatedFields();
          return newTasksArray;
        } catch (error) {
          console.error('Error loading focus tasks:', error);
          return [];
        }
      },



      // Focus Task Management
      saveFocusTask: async (taskData) => {
        const state = get();

        console.log('[userStore] saveFocusTask called with:', taskData);
        console.log('[userStore] Current focus tasks:', state.tasks.focus);

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { newTask, updatedTasks } = await state.firebaseService.saveFocusTask(
            taskData,
            state.tasks.focus
          );

          console.log('[userStore] Firebase returned newTask:', newTask);
          console.log('[userStore] Firebase returned updatedTasks count:', updatedTasks.length);

          // Always create a new array reference to trigger React re-renders
          const newTasksArray = [...updatedTasks];

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: newTasksArray
            }
          }));
          
          console.log('[userStore] State updated, new tasks count:', get().tasks.focus.length);
          
          // ALSO log today's tasks to activities.focus for history tracking
          const today = new Date().toISOString().slice(0, 10);
          if (newTask && newTask.date === today) {
            console.log('[userStore] 📝 Logging today\'s task creation to activities.focus');
            try {
              await get().logFocusSession(0, `Task Created: ${newTask.name}`, false);
            } catch (error) {
              console.error('[userStore] Error logging task creation to activities:', error);
            }
          }
          
          get().syncDeprecatedFields();
          return newTask;
        } catch (error) {
          console.error('[userStore] Error saving focus task:', error);
          throw error;
        }
      },

      updateFocusTask: async (taskId, updatedTaskData) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedTasks } = await state.firebaseService.updateFocusTask(
            taskId,
            updatedTaskData,
            state.tasks.focus
          );

          // Always create a new array reference to trigger React re-renders
          const newTasksArray = [...updatedTasks];

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: newTasksArray
            }
          }));
          
          get().syncDeprecatedFields();
          return { success: true, updatedTasks: newTasksArray };
        } catch (error) {
          console.error('Error updating focus task:', error);
          throw error;
        }
      },

      updateFocusTaskProgress: async (taskId, minutesCompleted) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          // Find the task before updating to check previous status
          const taskBefore = state.tasks.focus.find(task => task.id === taskId);
          const wasCompleted = taskBefore?.status === 'completed';

          const { updatedTasks } = await state.firebaseService.updateFocusTaskProgress(
            taskId,
            minutesCompleted,
            state.tasks.focus
          );

          // Find the updated task to check new status
          const taskAfter = updatedTasks.find(task => task.id === taskId);
          const isNowCompleted = taskAfter?.status === 'completed';

          // Award XP when task is completed (not when uncompleted)
          if (!wasCompleted && isNowCompleted && minutesCompleted > 0) {
            // Award XP based on minutes completed (1 XP per minute)
            const xpToAward = Math.max(1, minutesCompleted); // Minimum 1 XP
            useXpStore.getState().awardXp(xpToAward);

            // Update focus progress
            await get().updateFocusProgress();
          } else if (wasCompleted && !isNowCompleted) {
            // Deduct XP when task is uncompleted
            const xpToDeduct = -(taskBefore.completed || taskBefore.planned || 25);
            useXpStore.getState().awardXp(xpToDeduct);

            // Update focus progress
            await get().updateFocusProgress();
          }

          // Always create a new array reference to trigger React re-renders
          const newTasksArray = [...updatedTasks];

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: newTasksArray
            }
          }));
          
          get().syncDeprecatedFields();
          return newTasksArray;
        } catch (error) {
          console.error('Error updating focus task progress:', error);
          throw error;
        }
      },



      deleteFocusTask: async (taskId) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedTasks } = await state.firebaseService.deleteFocusTask(
            taskId,
            state.tasks.focus
          );

          // Always create a new array reference to trigger React re-renders
          const newTasksArray = [...updatedTasks];

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: newTasksArray
            }
          }));
          
          get().syncDeprecatedFields();
          return newTasksArray;
        } catch (error) {
          console.error('Error deleting focus task:', error);
          throw error;
        }
      },

      deleteFocusTaskSeries: async (taskId) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedTasks } = await state.firebaseService.deleteFocusTaskSeries(
            taskId,
            state.tasks.focus
          );

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: updatedTasks
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedTasks;
        } catch (error) {
          console.error('Error deleting focus task series:', error);
          throw error;
        }
      },

      addFocusTaskReflection: async (taskId, reflection) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const { updatedTasks } = await state.firebaseService.addFocusTaskReflection(
            taskId,
            reflection,
            state.tasks.focus
          );

          set((state) => ({
            tasks: {
              ...state.tasks,
              focus: updatedTasks
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedTasks;
        } catch (error) {
          console.error('Error adding focus task reflection:', error);
          throw error;
        }
      },

      // Journal Entry Management
      saveJournalEntry: async (entry) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const updatedEntries = await state.firebaseService.saveJournalEntry(entry);
          set((state) => ({
            custom: {
              ...state.custom,
              journal: updatedEntries
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedEntries;
        } catch (error) {
          console.error('Error saving journal entry:', error);
          throw error;
        }
      },

      updateJournalEntry: async (entryId, updatedContent) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const updatedEntries = await state.firebaseService.updateJournalEntry(entryId, updatedContent);
          set((state) => ({
            custom: {
              ...state.custom,
              journal: updatedEntries
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedEntries;
        } catch (error) {
          console.error('Error updating journal entry:', error);
          throw error;
        }
      },

      deleteJournalEntry: async (entryId) => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          throw new Error('Authentication required');
        }

        try {
          const updatedEntries = await state.firebaseService.deleteJournalEntry(entryId);
          set((state) => ({
            custom: {
              ...state.custom,
              journal: updatedEntries
            }
          }));
          
          get().syncDeprecatedFields();
          return updatedEntries;
        } catch (error) {
          console.error('Error deleting journal entry:', error);
          throw error;
        }
      },

      loadJournalEntries: async () => {
        const state = get();

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return [];
        }

        try {
          const progress = await state.firebaseService.loadUserProgress();
          const journalEntries = progress.custom?.journal || progress.journalEntries || [];
          set((state) => ({
            custom: {
              ...state.custom,
              journal: journalEntries
            }
          }));
          
          get().syncDeprecatedFields();
          return journalEntries;
        } catch (error) {
          console.error('Error loading journal entries:', error);
          return [];
        }
      },





      logChatSession: async (summary, topics = []) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          type: 'chat',
          activity: 'AI Assistant Chat',
          summary: summary,
          topics: topics,
          time: new Date().toISOString()
        };

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging chat session:', error);
        }
      },

      logJournalActivity: async (title, content, wordCount, mood = null) => {
        const state = get();
        const newLog = {
          id: Date.now(),
          type: 'journal',
          activity: 'Journal Entry',
          title: title,
          content: content,
          wordCount: wordCount,
          mood: mood,
          time: new Date().toISOString()
        };

        if (!state.firebaseService) {
          console.error('Firebase service not available');
          return;
        }

        try {
          const { updatedLogs } = await state.firebaseService.logMentalHealthActivity(
            newLog,
            state.activities.mentalHealth
          );
          set((state) => ({
            activities: {
              ...state.activities,
              mentalHealth: updatedLogs
            }
          }));
          
          get().syncDeprecatedFields();
        } catch (error) {
          console.error('Error logging journal activity:', error);
        }
      },
    }))


