// Calisthenics Workout Programs
export const calisthenicsWorkouts = {
  beginner: {
    name: "Beginner Full Body",
    description: "Foundation bodyweight movements",
    duration: "3 days/week",
    type: "Skill Building",
    days: {
      fullBody: {
        name: "Full Body Basics",
        exercises: [
          {
            id: 1,
            exerciseName: "Push-ups",
            sets: 3,
            reps: "8-12",
            pose_analyzer: true,
            description: "Basic push movement",
            primaryMuscle: "Chest",
            secondaryMuscles: ["Triceps", "Front Deltoids", "Core"]
          },
          {
            id: 2,
            exerciseName: "Bodyweight Squats",
            sets: 3,
            reps: "15-20",
            pose_analyzer: true,
            description: "Leg strength",
            primaryMuscle: "Quadriceps",
            secondaryMuscles: ["Glutes", "Hamstrings", "Calves", "Core"]
          },
          {
            id: 3,
            exerciseName: "Plank",
            sets: 3,
            reps: "30-60s",
            pose_analyzer: true,
            description: "Core stability",
            primaryMuscle: "Core",
            secondaryMuscles: ["Shoulders", "Glutes"]
          },
          {
            id: 4,
            exerciseName: "Glute Bridges",
            sets: 3,
            reps: "15-20",
            pose_analyzer: true,
            description: "Posterior chain",
            primaryMuscle: "Glutes",
            secondaryMuscles: ["Hamstrings", "Core"]
          }
        ]
      }
    }
  },
  skillProgression: {
    name: "Skill Progression",
    description: "Advanced calisthenics skills",
    duration: "5 days/week",
    type: "Skill Development",
    days: {
      planche: {
        name: "Planche Training",
        exercises: [
          {
            id: 1,
            exerciseName: "Planche Lean",
            sets: 5,
            reps: "20-30s",
            pose_analyzer: true,
            description: "Planche preparation",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core", "Chest", "Triceps"]
          },
          {
            id: 2,
            exerciseName: "Pseudo Planche Push-ups",
            sets: 4,
            reps: "5-8",
            pose_analyzer: true,
            description: "Strength building",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Chest", "Triceps", "Core"]
          },
          {
            id: 3,
            exerciseName: "Tuck Planche Hold",
            sets: 4,
            reps: "10-20s",
            pose_analyzer: true,
            description: "Static hold",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core", "Chest", "Triceps"]
          },
          {
            id: 4,
            exerciseName: "Planche Push-ups",
            sets: 3,
            reps: "3-5",
            pose_analyzer: true,
            description: "Advanced movement",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Chest", "Triceps", "Core"]
          }
        ]
      },
      handstand: {
        name: "Handstand Training",
        exercises: [
          {
            id: 1,
            exerciseName: "Wall Handstand",
            sets: 4,
            reps: "30-60s",
            pose_analyzer: true,
            description: "Balance practice",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core", "Triceps", "Balance"]
          },
          {
            id: 2,
            exerciseName: "Hollow Body Hold",
            sets: 4,
            reps: "30-45s",
            pose_analyzer: true,
            description: "Core strength",
            primaryMuscle: "Core",
            secondaryMuscles: ["Hip Flexors", "Shoulders"]
          },
          {
            id: 3,
            exerciseName: "Handstand Push-ups",
            sets: 3,
            reps: "5-8",
            pose_analyzer: true,
            description: "Vertical pressing",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Triceps", "Upper Chest", "Core"]
          },
          {
            id: 4,
            exerciseName: "Freestanding Handstand",
            sets: 5,
            reps: "10-30s",
            pose_analyzer: true,
            description: "Balance skill",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core", "Balance", "Proprioception"]
          }
        ]
      }
    }
  }
};
