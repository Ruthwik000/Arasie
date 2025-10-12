// Comprehensive Exercise Library for Custom Workouts
console.log('Loading customWorkoutExercises module');
export const customWorkoutExercises = {
  gym: {
    chest: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        exerciseName: 'Bench Press',
        sets: 4,
        reps: '8-12',
        pose_analyzer: true,
        primaryMuscle: 'Chest',
        secondaryMuscles: ['Triceps', 'Front Deltoids'],
        equipment: ['Barbell', 'Bench'],
        difficulty: 'Intermediate',
        description: 'Classic compound chest exercise for building mass and strength',
        video: '/videos/chest/bench_press.mp4',
        image: '/images/exercises/bench_press.jpg',
        category: 'Compound',
        bodyPart: 'Upper Body',
        tags: ['strength', 'mass', 'compound', 'barbell']
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        exerciseName: 'Incline Dumbbell Press',
        sets: 3,
        reps: '10-15',
        pose_analyzer: true,
        primaryMuscle: 'Upper Chest',
        secondaryMuscles: ['Triceps', 'Front Deltoids'],
        equipment: ['Dumbbells', 'Incline Bench'],
        difficulty: 'Beginner',
        description: 'Targets upper chest with greater range of motion',
        video: '/videos/chest/incline_dumbbell_press.mp4',
        image: '/images/exercises/incline_dumbbell_press.jpg',
        category: 'Compound',
        bodyPart: 'Upper Body',
        tags: ['upper chest', 'dumbbells', 'incline', 'mass']
      }
    ],
    back: [
      {
        id: 'pull-ups',
        name: 'Pull-ups',
        exerciseName: 'Pull-ups',
        sets: 3,
        reps: '6-12',
        pose_analyzer: true,
        primaryMuscle: 'Lats',
        secondaryMuscles: ['Biceps', 'Rhomboids', 'Middle Traps'],
        equipment: ['Pull-up Bar'],
        difficulty: 'Intermediate',
        description: 'King of upper body pulling exercises for back width',
        video: '/videos/back/pull_ups.mp4',
        image: '/images/exercises/pull_ups.jpg',
        category: 'Compound',
        bodyPart: 'Upper Body',
        tags: ['bodyweight', 'lats', 'width', 'compound']
      }
    ]
  }
};

// Helper functions for working with exercise data
export const exerciseHelpers = {
  getAllExercises: () => {
    const allExercises = [];
    Object.values(customWorkoutExercises.gym).forEach(muscleGroup => {
      allExercises.push(...muscleGroup);
    });
    return allExercises;
  },

  getExercisesByCategory: (category) => {
    return customWorkoutExercises[category] || {};
  },

  searchExercises: (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return exerciseHelpers.getAllExercises().filter(
      exercise => 
        exercise.name.toLowerCase().includes(term) ||
        exercise.description.toLowerCase().includes(term) ||
        (exercise.tags && exercise.tags.some(tag => tag.includes(term)))
    );
  }
};

// Exercise categories for UI organization
export const exerciseCategories = {
  gym: {
    name: 'Gym',
    icon: 'Dumbbell'
  },
  calisthenics: {
    name: 'Calisthenics',
    icon: 'User'
  },
  stretching: {
    name: 'Stretching',
    icon: 'Maximize'
  },
  yoga: {
    name: 'Yoga',
    icon: 'Sun'
  }
};