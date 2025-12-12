// Main Workout Data - Combines all workout programs
import { gymWorkouts } from './gymWorkouts';
import { calisthenicsWorkouts } from './calisthenicsWorkouts';
import { stretchingPrograms, yogaPrograms } from './stretchingYoga';

// Comprehensive Workout Data Structure
export const workoutData = {
  gym: gymWorkouts,
  calisthenics: calisthenicsWorkouts,
  stretching: stretchingPrograms,
  yoga: yogaPrograms
};

// Exercise Library for Custom Workouts
export const exerciseLibrary = {
  gym: [
    { id: 'bench-press', name: 'Bench Press', sets: 4, reps: '8-12', pose_analyzer: true },
    { id: 'squats', name: 'Squats', sets: 4, reps: '8-12', pose_analyzer: true },
    { id: 'deadlifts', name: 'Deadlifts', sets: 3, reps: '5-8', pose_analyzer: true },
    { id: 'pull-ups', name: 'Pull-ups', sets: 3, reps: '6-10', pose_analyzer: true },
    { id: 'overhead-press', name: 'Overhead Press', sets: 3, reps: '8-10', pose_analyzer: true },
    { id: 'barbell-rows', name: 'Barbell Rows', sets: 4, reps: '8-12', pose_analyzer: true }
  ],
  calisthenics: [
    { id: 'push-ups', name: 'Push-ups', sets: 3, reps: '10-15', pose_analyzer: true },
    { id: 'burpees', name: 'Burpees', sets: 3, reps: '8-12', pose_analyzer: true },
    { id: 'plank', name: 'Plank', sets: 3, reps: '30-60s', pose_analyzer: true },
    { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 3, reps: '20 each', pose_analyzer: true },
    { id: 'jump-squats', name: 'Jump Squats', sets: 3, reps: '12-15', pose_analyzer: true },
    { id: 'pike-push-ups', name: 'Pike Push-ups', sets: 3, reps: '8-12', pose_analyzer: true }
  ],
  stretching: [
    { id: 'forward-fold', name: 'Forward Fold', duration: '45s', pose_analyzer: false },
    { id: 'hip-flexor', name: 'Hip Flexor Stretch', duration: '30s each', pose_analyzer: false },
    { id: 'shoulder-rolls', name: 'Shoulder Rolls', duration: '30s', pose_analyzer: false },
    { id: 'cat-cow', name: 'Cat-Cow Stretch', duration: '45s', pose_analyzer: false },
    { id: 'pigeon-pose', name: 'Pigeon Pose', duration: '60s each', pose_analyzer: false }
  ],
  yoga: [
    { id: 'downward-dog', name: 'Downward Dog', duration: '60s', pose_analyzer: false },
    { id: 'warrior-1', name: 'Warrior I', duration: '30s each', pose_analyzer: false },
    { id: 'child-pose', name: "Child's Pose", duration: '60s', pose_analyzer: false },
    { id: 'cobra-pose', name: 'Cobra Pose', duration: '30s', pose_analyzer: false },
    { id: 'tree-pose', name: 'Tree Pose', duration: '30s each', pose_analyzer: false }
  ]
};
