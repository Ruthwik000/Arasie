# Workout Data Structure

The workout data has been organized into separate files for better maintainability:

## File Structure

### 1. `workoutData.js` (Main Index)
- Combines all workout programs
- Exports `workoutData` and `exerciseLibrary`
- Import this file in your components

### 2. `gymWorkouts.js`
- Contains all gym-based workout programs:
  - Push/Pull/Legs (PPL)
  - Upper/Lower Split
  - Full Body
  - Bro-Split
  - Hybrid Split

### 3. `calisthenicsWorkouts.js`
- Contains bodyweight workout programs:
  - Beginner Full Body
  - Skill Progression (Planche, Handstand)

### 4. `stretchingYoga.js`
- Contains stretching and yoga programs:
  - **Stretching Programs:**
    - Daily Movement & Mobility
    - Pre-Workout Dynamic Warm-up
    - Post-Workout Static Stretching
  - **Yoga Programs:**
    - Beginner Yoga Flow
    - Morning Energizer
    - Sleep Yoga

## Usage

```javascript
// Import in your components
import { workoutData, exerciseLibrary } from '../data/workoutData';

// Access gym workouts
const pplWorkout = workoutData.gym.ppl;

// Access stretching programs
const dailyStretch = workoutData.stretching.daily_movement;

// Access yoga programs
const beginnerYoga = workoutData.yoga.beginner_yoga;

// Access exercise library
const gymExercises = exerciseLibrary.gym;
```

## Benefits

- **Better Organization**: Each category in its own file
- **Easier Maintenance**: Update specific workout types without touching others
- **Improved Performance**: Smaller file sizes, better code splitting
- **Clear Structure**: Easy to find and modify specific workouts
