// Exercise Library - Single source of truth for all exercises
export const exerciseLibrary = {
  "push-ups": {
    id: "push-ups",
    exerciseName: "Push-ups",
    uniqueName: "push-ups",
    pose_analyzer: true,
    description: "Bodyweight chest warm-up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Triceps", "Shoulders", "Core"],
    video: "/videos/chest/pushups.mp4"
  },
  "incline-dumbbell-press": {
    id: "incline-dumbbell-press",
    exerciseName: "Incline Dumbbell Press",
    uniqueName: "incline-dumbbell-press",
    pose_analyzer: true,
    description: "Upper chest hypertrophy focus",
    primaryMuscle: "Upper Chest",
    secondaryMuscles: ["Triceps", "Front Deltoids"],
    video: "/videos/chest/dumbbell_press.mp4"
  },
  "incline-barbell-bench-press": {
    id: "incline-barbell-bench-press",
    exerciseName: "Incline Barbell Bench Press",
    uniqueName: "incline-barbell-bench-press",
    pose_analyzer: true,
    description: "Upper chest hypertrophy focus",
    primaryMuscle: "Upper Chest",
    secondaryMuscles: ["Triceps", "Front Deltoids"],
    video: "/videos/chest/inclined_chest_press.mp4"
  },
  "flat-barbell-bench-press": {
    id: "flat-barbell-bench-press",
    exerciseName: "Flat Barbell Bench Press",
    uniqueName: "flat-barbell-bench-press",
    pose_analyzer: true,
    description: "Mid-chest compound strength builder",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Triceps", "Shoulders"],
    video: "/videos/chest/flat_bench_press.mp4"
  },
  "rope-pulldown-chest": {
    id: "rope-pulldown-chest",
    exerciseName: "Rope Pulldowns (Chest)",
    uniqueName: "rope-pulldown-chest",
    pose_analyzer: true,
    description: "Lower chest isolation",
    primaryMuscle: "Lower Chest",
    secondaryMuscles: ["Triceps"],
    video: "/videos/chest/chest_flys.mp4"
  },
  "tricep-extension-push-ups": {
    id: "tricep-extension-push-ups",
    exerciseName: "Tricep Extension Push-ups",
    uniqueName: "tricep-extension-push-ups",
    pose_analyzer: true,
    description: "Tricep activation warm-up",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["Chest", "Shoulders"],
    video: "/videos/tricep/Tricep_Extension_Push-ups.mp4"
  },
  "bent-tricep-pull": {
    id: "bent-tricep-pull",
    exerciseName: "Bent Tricep Pull",
    uniqueName: "bent-tricep-pull",
    pose_analyzer: true,
    description: "Free-weight tricep isolation",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    video: "/videos/tricep/long_head.mp4"
  },
  "tricep-rope-pulldown": {
    id: "tricep-rope-pulldown",
    exerciseName: "Tricep Rope Pulldown",
    uniqueName: "tricep-rope-pulldown",
    pose_analyzer: true,
    description: "Cable-based tricep isolation",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["Forearms"],
    video: "/videos/tricep/tricpe_shape.mp4"
  },
  "crunches": {
    id: "crunches",
    exerciseName: "Crunches",
    uniqueName: "crunches",
    pose_analyzer: true,
    description: "Core activation and abdominal hypertrophy",
    primaryMuscle: "Abs",
    secondaryMuscles: ["Obliques"],
    video: "/videos/abs/abs_ropecrunches.mp4"
  },
  "plank": {
    id: "plank",
    exerciseName: "Plank",
    uniqueName: "plank",
    pose_analyzer: true,
    description: "Core stability and endurance",
    primaryMuscle: "Core",
    secondaryMuscles: ["Shoulders", "Glutes", "Lower Back"],
    video: "/videos/abs/plank.mp4"
  },
  "wide-grip-pull-ups": {
    id: "wide-grip-pull-ups",
    exerciseName: "Wide Grip Pull-ups",
    uniqueName: "wide-grip-pull-ups",
    pose_analyzer: true,
    description: "Lat width development",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Rear Deltoids", "Traps"],
    video: "/videos/back/wide_grip_pull_ups.mp4"
  },
  "neutral-grip-pull-ups": {
    id: "neutral-grip-pull-ups",
    exerciseName: "Neutral Grip Pull-ups",
    uniqueName: "neutral-grip-pull-ups",
    pose_analyzer: true,
    description: "Balanced back & arm engagement",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Forearms"],
    video: "/videos/back/Neutral_grip_pull_ups.mp4"
  },
  "chest-supported-rows": {
    id: "chest-supported-rows",
    exerciseName: "Chest Supported Rows",
    uniqueName: "chest-supported-rows",
    pose_analyzer: true,
    description: "Mid-back and rhomboid activation",
    primaryMuscle: "Middle Back",
    secondaryMuscles: ["Lats", "Biceps", "Rear Deltoids"],
    video: "/videos/back/chest_rows.mp4"
  },
  "cable-lat-pulldown": {
    id: "cable-lat-pulldown",
    exerciseName: "Cable Lat Pulldown",
    uniqueName: "cable-lat-pulldown",
    pose_analyzer: true,
    description: "Cable isolation for lats",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Traps", "Rear Deltoids"],
    video: "/videos/back/Lat_pulldown.mp4"
  },
  "neutral-grip-pulldown": {
    id: "neutral-grip-pulldown",
    exerciseName: "Neutral Grip Pulldown",
    uniqueName: "neutral-grip-pulldown",
    pose_analyzer: true,
    description: "Neutral grip for lats & biceps",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    video: "/videos/back/nuetralgrip_pulldwon.mp4"
  },
  "horizontal-neutral-grip-row": {
    id: "horizontal-neutral-grip-row",
    exerciseName: "Horizontal Neutral Grip Row",
    uniqueName: "horizontal-neutral-grip-row",
    pose_analyzer: true,
    description: "Functional unilateral lat movement",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Core", "Biceps"],
    video: "/videos/back/horizontal_nuetralgrip.mp4"
  },
  "reverse-crunches": {
    id: "reverse-crunches",
    exerciseName: "Reverse Crunches",
    uniqueName: "reverse-crunches",
    pose_analyzer: false,
    description: "Lower abs engagement",
    primaryMuscle: "Lower Abs",
    secondaryMuscles: ["Hip Flexors"],
    video: "/videos/back/Lowerback.mp4"
  },
  "ezbar-preacher-curls": {
    id: "ezbar-preacher-curls",
    exerciseName: "EZ Bar Preacher Curls",
    uniqueName: "ezbar-preacher-curls",
    pose_analyzer: true,
    description: "Strict bicep curl variation",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4"
  },
  "incline-dumbbell-curls": {
    id: "incline-dumbbell-curls",
    exerciseName: "Incline Dumbbell Curls",
    uniqueName: "incline-dumbbell-curls",
    pose_analyzer: true,
    description: "Bicep peak isolation",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    video: "/videos/biceps/inclined_barbell_cruls.mp4"
  },
  "hammer-curls": {
    id: "hammer-curls",
    exerciseName: "Hammer Curls",
    uniqueName: "hammer-curls",
    pose_analyzer: true,
    description: "Biceps & brachialis thickness",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    video: "/videos/biceps/hammercurls.mp4"
  },
  "squats": {
    id: "squats",
    exerciseName: "Squats",
    uniqueName: "squats",
    pose_analyzer: true,
    description: "Compound lower body builder",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    video: "/videos/legs/Squats.mp4"
  },
  "leg-press": {
    id: "leg-press",
    exerciseName: "Leg Press",
    uniqueName: "leg-press",
    pose_analyzer: true,
    description: "Quad-focused machine movement",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings"],
    video: "/videos/legs/Leg_press.mp4"
  },
  "calf-raises": {
    id: "calf-raises",
    exerciseName: "Calf Raises",
    uniqueName: "calf-raises",
    pose_analyzer: false,
    description: "Calf hypertrophy",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    video: null
  },
  "chest-supported-shoulder-press": {
    id: "chest-supported-shoulder-press",
    exerciseName: "Chest Supported Shoulder Press",
    uniqueName: "chest-supported-shoulder-press",
    pose_analyzer: true,
    description: "Shoulder press with chest support",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps"],
    video: "/videos/shoulders/Shoulder press.mp4"
  },
  "cable-lateral-raises": {
    id: "cable-lateral-raises",
    exerciseName: "Cable Lateral Raises",
    uniqueName: "cable-lateral-raises",
    pose_analyzer: true,
    description: "Medial delt isolation",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    video: "/videos/shoulders/Lateral raises.mp4"
  },
  "overhead-shoulder-press": {
    id: "overhead-shoulder-press",
    exerciseName: "Overhead Shoulder Press",
    uniqueName: "overhead-shoulder-press",
    pose_analyzer: true,
    description: "Compound shoulder strength",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Upper Chest"],
    video: "/videos/shoulders/Shoulder press.mp4"
  },
  "cable-rope-press": {
    id: "cable-rope-press",
    exerciseName: "Cable Rope Press",
    uniqueName: "cable-rope-press",
    pose_analyzer: true,
    description: "Shoulder cable press variation",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps"],
    video: "/videos/shoulders/Face rope pulls.mp4"
  },
  "front-raises": {
    id: "front-raises",
    exerciseName: "Front Raises",
    uniqueName: "front-raises",
    pose_analyzer: true,
    description: "Front delt isolation",
    primaryMuscle: "Front Deltoids",
    secondaryMuscles: ["Upper Chest"],
    video: "/videos/shoulders/Shoulder press.mp4"
  },
  "abs-circuit": {
    id: "abs-circuit",
    exerciseName: "Abs Circuit",
    uniqueName: "abs-circuit",
    pose_analyzer: false,
    description: "Core strengthening (planks, crunches, leg raises)",
    primaryMuscle: "Abs",
    secondaryMuscles: ["Obliques", "Lower Back"],
    video: null
  },
  "weighted-pull-ups": {
    id: "weighted-pull-ups",
    exerciseName: "Weighted Pull-ups (or Lat Pulldown)",
    uniqueName: "weighted-pull-ups",
    pose_analyzer: true,
    description: "Primary vertical pull — builds lats and pulling strength",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    video: "/videos/back/wide_grip_pull_ups.mp4"
  },
  "barbell-bent-over-row": {
    id: "barbell-bent-over-row",
    exerciseName: "Barbell Bent-over Row",
    uniqueName: "barbell-bent-over-row",
    pose_analyzer: true,
    description: "Horizontal pull — mid-back thickness and overall back strength",
    primaryMuscle: "Middle Back",
    secondaryMuscles: ["Lats", "Biceps", "Rear Deltoids"],
    video: "/videos/back/chest_rows.mp4"
  },
  "dumbbell-lateral-raises": {
    id: "dumbbell-lateral-raises",
    exerciseName: "Dumbbell Lateral Raises",
    uniqueName: "dumbbell-lateral-raises",
    pose_analyzer: true,
    description: "Best exercise for side delt width and roundness",
    primaryMuscle: "Side Deltoids",
    secondaryMuscles: [],
    video: "/videos/shoulders/Lateral raises.mp4"
  },
  "rear-delt-fly": {
    id: "rear-delt-fly",
    exerciseName: "Rear Delt Fly (Machine or Dumbbell)",
    uniqueName: "rear-delt-fly",
    pose_analyzer: true,
    description: "Strengthens rear delts and improves shoulder posture",
    primaryMuscle: "Rear Deltoids",
    secondaryMuscles: ["Rhomboids", "Middle Traps"],
    video: "/videos/shoulders/Face rope pulls.mp4"
  },
  "chest-dips": {
    id: "chest-dips",
    exerciseName: "Chest Dips (leaning forward)",
    uniqueName: "chest-dips",
    pose_analyzer: true,
    description: "Chest-leaning dips emphasize lower chest",
    primaryMuscle: "Chest / Triceps",
    secondaryMuscles: ["Front Deltoids"],
    video: null
  },
  "barbell-curls": {
    id: "barbell-curls",
    exerciseName: "Barbell Curls",
    uniqueName: "barbell-curls",
    pose_analyzer: true,
    description: "Heavy bicep mass builder",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["Forearms"],
    video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4"
  },
  "back-squat": {
    id: "back-squat",
    exerciseName: "Back Squat",
    uniqueName: "back-squat",
    pose_analyzer: true,
    description: "Primary lower-body compound — builds quads, glutes, core and overall strength",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    video: "/videos/legs/Squats.mp4"
  },
  "romanian-deadlift": {
    id: "romanian-deadlift",
    exerciseName: "Romanian Deadlift (RDL)",
    uniqueName: "romanian-deadlift",
    pose_analyzer: true,
    description: "Hamstring-dominant hinge to develop posterior chain strength and hip extension",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["Glutes", "Lower Back"],
    video: null
  },
  "hamstring-curl": {
    id: "hamstring-curl",
    exerciseName: "Hamstring Curl (Machine or Swiss Ball)",
    uniqueName: "hamstring-curl",
    pose_analyzer: false,
    description: "Isolated hamstring work to balance knee health and improve posterior chain hypertrophy",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: [],
    video: null
  },
  "standing-calf-raises": {
    id: "standing-calf-raises",
    exerciseName: "Standing Calf Raises",
    uniqueName: "standing-calf-raises",
    pose_analyzer: false,
    description: "Heavy standing variation for gastrocnemius strength and thickness",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    video: null
  },
  "hip-thrust": {
    id: "hip-thrust",
    exerciseName: "Hip Thrust",
    uniqueName: "hip-thrust",
    pose_analyzer: true,
    description: "Glute-dominant lift for hip extension strength, stability, and hypertrophy",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["Hamstrings", "Core"],
    video: null
  },
  "bulgarian-split-squat": {
    id: "bulgarian-split-squat",
    exerciseName: "Bulgarian Split Squat",
    uniqueName: "bulgarian-split-squat",
    pose_analyzer: true,
    description: "Single-leg movement to reduce imbalance and build quad & glute strength",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    video: null
  },
  "core-stability": {
    id: "core-stability",
    exerciseName: "Core Stability (Plank / Pallof Press)",
    uniqueName: "core-stability",
    pose_analyzer: false,
    description: "Anti-extension/rotation core stability for transferring strength safely",
    primaryMuscle: "Core",
    secondaryMuscles: ["Obliques", "Lower Back"],
    video: "/videos/abs/plank.mp4"
  },
  "pull-ups": {
    id: "pull-ups",
    exerciseName: "Pull-ups",
    uniqueName: "pull-ups",
    pose_analyzer: true,
    description: "Warm-up back exercise activating lats and biceps",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Rear Deltoids"],
    video: "/videos/back/wide_grip_pull_ups.mp4"
  },
  "lat-pulldown": {
    id: "lat-pulldown",
    exerciseName: "Lat Pulldown",
    uniqueName: "lat-pulldown",
    pose_analyzer: true,
    description: "Vertical pull for lat width",
    primaryMuscle: "Lats",
    secondaryMuscles: ["Biceps", "Traps"],
    video: "/videos/back/Lat_pulldown.mp4"
  },
  "shoulder-press": {
    id: "shoulder-press",
    exerciseName: "Shoulder Press",
    uniqueName: "shoulder-press",
    pose_analyzer: true,
    description: "Primary shoulder builder",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Upper Chest"],
    video: "/videos/shoulders/Shoulder press.mp4"
  },
  "chest-flyes": {
    id: "chest-flyes",
    exerciseName: "Chest Flyes (Cable or Dumbbell)",
    uniqueName: "chest-flyes",
    pose_analyzer: true,
    description: "Isolation for chest shape and contraction",
    primaryMuscle: "Chest",
    secondaryMuscles: ["Front Deltoids"],
    video: "/videos/chest/chest_flys.mp4"
  },
  "deadlifts": {
    id: "deadlifts",
    exerciseName: "Deadlifts (Conventional or Trap Bar)",
    uniqueName: "deadlifts",
    pose_analyzer: true,
    description: "Total posterior-chain strength and mass builder",
    primaryMuscle: "Lower Back",
    secondaryMuscles: ["Hamstrings", "Glutes", "Upper Traps", "Lats"],
    video: null
  },
  "seated-cable-row": {
    id: "seated-cable-row",
    exerciseName: "Seated Cable Row",
    uniqueName: "seated-cable-row",
    pose_analyzer: true,
    description: "Controlled horizontal pulling for detail and contraction",
    primaryMuscle: "Middle Back",
    secondaryMuscles: ["Lats", "Biceps"],
    video: "/videos/back/chest_rows.mp4"
  },
  "seated-overhead-press": {
    id: "seated-overhead-press",
    exerciseName: "Seated Overhead Press",
    uniqueName: "seated-overhead-press",
    pose_analyzer: true,
    description: "Primary shoulder strength builder",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Upper Chest"],
    video: "/videos/shoulders/Shoulder press.mp4"
  },
  "battle-ropes": {
    id: "battle-ropes",
    exerciseName: "Battle Ropes (Conditioning Finisher)",
    uniqueName: "battle-ropes",
    pose_analyzer: false,
    description: "Conditioning finisher that improves work capacity and shoulder endurance",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["Core", "Forearms", "Cardio"],
    video: null
  },
  "box-jumps": {
    id: "box-jumps",
    exerciseName: "Box Jumps",
    uniqueName: "box-jumps",
    pose_analyzer: true,
    description: "Explosive lower-body power and rate-of-force development",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Calves", "Core"],
    video: null
  },
  "sled-push": {
    id: "sled-push",
    exerciseName: "Sled Push",
    uniqueName: "sled-push",
    pose_analyzer: false,
    description: "High-intensity conditioning and leg drive",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Core", "Cardio"],
    video: null
  },
  "burpees": {
    id: "burpees",
    exerciseName: "Burpees",
    uniqueName: "burpees",
    pose_analyzer: false,
    description: "Full-body conditioning drill combining strength and cardio",
    primaryMuscle: "Full Body",
    secondaryMuscles: ["Cardio", "Core", "Shoulders"],
    video: null
  },
  "mountain-climbers": {
    id: "mountain-climbers",
    exerciseName: "Mountain Climbers",
    uniqueName: "mountain-climbers",
    pose_analyzer: false,
    description: "Core & conditioning movement",
    primaryMuscle: "Core",
    secondaryMuscles: ["Shoulders", "Quadriceps", "Cardio"],
    video: null
  },
  "kettlebell-swings": {
    id: "kettlebell-swings",
    exerciseName: "Kettlebell Swings",
    uniqueName: "kettlebell-swings",
    pose_analyzer: false,
    description: "Hip hinge conditioning for power endurance",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["Hamstrings", "Core", "Shoulders", "Cardio"],
    video: null
  },
  "high-knees": {
    id: "high-knees",
    exerciseName: "High Knees (Finisher)",
    uniqueName: "high-knees",
    pose_analyzer: false,
    description: "High heart-rate finisher focused on sprint mechanics",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Hip Flexors", "Cardio", "Core"],
    video: null
  },
  "light-squats": {
    id: "light-squats",
    exerciseName: "Light Squats",
    uniqueName: "light-squats",
    pose_analyzer: true,
    description: "Movement quality and low-load activation",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["Glutes", "Hamstrings", "Mobility"],
    video: "/videos/legs/Squats.mp4"
  },
  "band-pull-aparts": {
    id: "band-pull-aparts",
    exerciseName: "Band Pull-Aparts",
    uniqueName: "band-pull-aparts",
    pose_analyzer: false,
    description: "Shoulder health and scapular control",
    primaryMuscle: "Rear Deltoids",
    secondaryMuscles: ["Rhomboids", "Middle Traps"],
    video: null
  },
  "walking": {
    id: "walking",
    exerciseName: "Walking (Active Recovery)",
    uniqueName: "walking",
    pose_analyzer: false,
    description: "Low-intensity steady-state to promote recovery",
    primaryMuscle: "Cardio",
    secondaryMuscles: ["Calves", "Glutes", "Recovery"],
    video: null
  }
};

// Helper function to build exercise with sets/reps overrides
const buildExercise = (exerciseKey, overrides = {}) => {
  const baseExercise = exerciseLibrary[exerciseKey];
  if (!baseExercise) {
    console.error(`Exercise key "${exerciseKey}" not found in library`);
    return null;
  }
  return {
    ...baseExercise,
    ...overrides,
    id: overrides.id || baseExercise.id
  };
};

// Final cleaned gymWorkouts (ready to drop into your app)
export const gymWorkouts = {
  ppl: {
    splitId: "ppl",
    name: "Push/Pull/Legs",
    description: "6-day hypertrophy split",
    duration: "6 days/week",
    type: "Hypertrophy",
    days: {
      push: {
        splitDay: "Push Day",
        exercises: [
          buildExercise("push-ups", { id: 1, sets: 3, reps: "15" }),
          buildExercise("incline-dumbbell-press", { id: 2, sets: 3, reps: "15" }),
          buildExercise("incline-barbell-bench-press", { id: 3, sets: 3, reps: "15" }),
          buildExercise("flat-barbell-bench-press", { id: 4, sets: 3, reps: "10-12" }),
          buildExercise("rope-pulldown-chest", { id: 5, sets: 2, reps: "12-15" }),
          buildExercise("tricep-extension-push-ups", { id: 6, sets: 1, reps: "20" }),
          buildExercise("bent-tricep-pull", { id: 7, sets: 2, reps: "10" }),
          buildExercise("tricep-rope-pulldown", { id: 8, sets: 2, reps: "15" }),
          buildExercise("crunches", { id: 9, sets: 3, reps: "20" }),
          buildExercise("plank", { id: 10, sets: 3, reps: "60s hold" })
        ]
      },
      pull: {
        splitDay: "Pull Day",
        exercises: [
          buildExercise("wide-grip-pull-ups", { id: 1, sets: 3, reps: "10" }),
          buildExercise("neutral-grip-pull-ups", { id: 2, sets: 3, reps: "10" }),
          buildExercise("chest-supported-rows", { id: 3, sets: 3, reps: "10" }),
          buildExercise("cable-lat-pulldown", { id: 4, sets: 1, reps: "15" }),
          buildExercise("neutral-grip-pulldown", { id: 5, sets: 1, reps: "15" }),
          buildExercise("horizontal-neutral-grip-row", { id: 6, sets: 2, reps: "12" }),
          buildExercise("reverse-crunches", { id: 7, sets: 2, reps: "15" }),
          buildExercise("ezbar-preacher-curls", { id: 8, sets: 2, reps: "15" }),
          buildExercise("incline-dumbbell-curls", { id: 9, sets: 3, reps: "15" }),
          buildExercise("hammer-curls", { id: 10, sets: 3, reps: "15" })
        ]
      },
      legs: {
        splitDay: "Leg Day",
        exercises: [
          buildExercise("squats", { id: 1, sets: 3, reps: "12-15" }),
          buildExercise("leg-press", { id: 2, sets: 1, reps: "12-15", exerciseName: "Leg Press (Close Stance)", uniqueName: "leg-press-close", description: "Quad dominant press variation" }),
          buildExercise("leg-press", { id: 3, sets: 1, reps: "12-15", exerciseName: "Leg Press (Wide Stance)", uniqueName: "leg-press-wide", description: "Glute and hamstring emphasis", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings", "Quadriceps"] }),
          buildExercise("leg-press", { id: 4, sets: 1, reps: "12-15", exerciseName: "Leg Press (Feet High)", uniqueName: "leg-press-feet-high", description: "Hamstring and glute focus", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Quadriceps"] }),
          buildExercise("calf-raises", { id: 5, sets: 2, reps: "15-20" }),
          buildExercise("chest-supported-shoulder-press", { id: 6, sets: 2, reps: "12" }),
          buildExercise("cable-lateral-raises", { id: 7, sets: 2, reps: "15" }),
          buildExercise("overhead-shoulder-press", { id: 8, sets: 2, reps: "12" }),
          buildExercise("cable-rope-press", { id: 9, sets: 2, reps: "15" }),
          buildExercise("front-raises", { id: 10, sets: 2, reps: "12" }),
          buildExercise("abs-circuit", { id: 11, sets: 3, reps: "Varied" })
        ]
      }
    }
  },

  upperLower: {
    splitId: "upperLower",
    name: "Upper/Lower",
    description: "Balanced strength + hypertrophy split using commonly programmed exercises",
    duration: "4 days/week (Upper / Lower / Upper / Lower)",
    type: "Strength / Hypertrophy",
    days: {
      upper: {
        splitDay: "Upper Body",
        exercises: [
          buildExercise("flat-barbell-bench-press", { id: 1, sets: 4, reps: "4-6 / 8-12", description: "Primary horizontal push — builds chest and pressing strength." }),
          buildExercise("incline-dumbbell-press", { id: 2, sets: 3, reps: "8-12", description: "Upper chest hypertrophy and shoulder-friendly pressing." }),
          buildExercise("weighted-pull-ups", { id: 3, sets: 4, reps: "6-10" }),
          buildExercise("barbell-bent-over-row", { id: 4, sets: 4, reps: "6-10" }),
          buildExercise("dumbbell-lateral-raises", { id: 5, sets: 3, reps: "12-15" }),
          buildExercise("rear-delt-fly", { id: 6, sets: 3, reps: "12-15" }),
          buildExercise("chest-dips", { id: 7, sets: 3, reps: "6-12", exerciseName: "Chest Dips (leaning forward) — superset option", uniqueName: "chest-dips-superset", description: "Chest-leaning dips emphasize lower chest while the pushdown finishes triceps — pair as a superset." }),
          buildExercise("barbell-curls", { id: 8, sets: 3, reps: "8-12" }),
          buildExercise("incline-dumbbell-curls", { id: 9, sets: 3, reps: "10-15", description: "Stretches long head of biceps for peak development." }),
          buildExercise("tricep-rope-pulldown", { id: 10, sets: 3, reps: "10-15", description: "Direct triceps isolation to finish the workout." })
        ]
      },
      lower: {
        splitDay: "Lower Body",
        exercises: [
          buildExercise("back-squat", { id: 1, sets: 4, reps: "4-6 / 6-10" }),
          buildExercise("leg-press", { id: 2, sets: 3, reps: "10-15", pose_analyzer: false, exerciseName: "Leg Press (Feet Placement as needed)", description: "High-volume quad development option; adjust foot position to vary quad/glute emphasis." }),
          buildExercise("romanian-deadlift", { id: 3, sets: 3, reps: "6-10" }),
          buildExercise("hamstring-curl", { id: 4, sets: 3, reps: "10-15" }),
          buildExercise("standing-calf-raises", { id: 5, sets: 4, reps: "12-20" }),
          buildExercise("hip-thrust", { id: 6, sets: 3, reps: "8-12" }),
          buildExercise("bulgarian-split-squat", { id: 7, sets: 3, reps: "8-12 each leg" }),
          buildExercise("core-stability", { id: 8, sets: 3, reps: "30-90s / 8-12" })
        ]
      }
    }
  },

  fullBody: {
    splitId: "fullBody",
    name: "Full Body",
    description: "Efficiency for beginners",
    duration: "3 days/week",
    type: "Beginner-Friendly",
    days: {
      workout: {
        splitDay: "Full Body Workout",
        exercises: [
          buildExercise("push-ups", { id: 1, sets: 2, reps: "15", description: "Upper body warm-up for chest, triceps, and shoulders." }),
          buildExercise("pull-ups", { id: 2, sets: 2, reps: "6-10" }),
          buildExercise("flat-barbell-bench-press", { id: 3, sets: 4, reps: "6-10", description: "Primary chest compound movement for strength." }),
          buildExercise("incline-dumbbell-press", { id: 4, sets: 3, reps: "8-12", description: "Upper chest hypertrophy movement." }),
          buildExercise("lat-pulldown", { id: 5, sets: 3, reps: "10-12" }),
          buildExercise("chest-supported-rows", { id: 6, sets: 3, reps: "10-12", description: "Horizontal pulling for back thickness." }),
          buildExercise("squats", { id: 7, sets: 4, reps: "8-12", description: "Primary lower body compound exercise." }),
          buildExercise("leg-press", { id: 8, sets: 3, reps: "12-15", pose_analyzer: true }),
          buildExercise("shoulder-press", { id: 9, sets: 3, reps: "8-12" }),
          buildExercise("barbell-curls", { id: 10, sets: 3, reps: "10-12", description: "Bicep isolation for mass." }),
          buildExercise("tricep-rope-pulldown", { id: 11, sets: 3, reps: "12-15", description: "Tricep isolation using cables." }),
          buildExercise("plank", { id: 12, sets: 3, reps: "45-60s", description: "Core stability finisher." })
        ]
      }
    }
  },

  broSplit: {
    splitId: "broSplit",
    name: "Bro-Split",
    description: "5-day focused bodypart split for hypertrophy and aesthetic development",
    duration: "5 days/week",
    type: "Bodybuilding",
    days: {
      chest: {
        splitDay: "Chest Day",
        exercises: [
          buildExercise("push-ups", { id: 1, sets: 3, reps: "15" }),
          buildExercise("flat-barbell-bench-press", { id: 2, sets: 4, reps: "6-10", description: "Heavy compound to build mass and strength on the chest." }),
          buildExercise("incline-dumbbell-press", { id: 3, sets: 4, reps: "8-12", description: "Upper chest emphasis and balanced shoulder-friendly pressing." }),
          buildExercise("chest-flyes", { id: 4, sets: 3, reps: "10-15" }),
          buildExercise("chest-dips", { id: 5, sets: 3, reps: "8-12", exerciseName: "Dips (Chest-leaning)", description: "Lower-chest emphasis; lean forward for chest bias.", primaryMuscle: "Lower Chest", secondaryMuscles: ["Triceps", "Front Deltoids"] })
        ]
      },

      back: {
        splitDay: "Back Day",
        exercises: [
          buildExercise("deadlifts", { id: 1, sets: 4, reps: "4-6" }),
          buildExercise("weighted-pull-ups", { id: 2, sets: 4, reps: "6-10", description: "Vertical pulling for width and lats." }),
          buildExercise("chest-supported-rows", { id: 3, sets: 3, reps: "10" }),
          buildExercise("cable-lat-pulldown", { id: 4, sets: 1, reps: "15" }),
          buildExercise("neutral-grip-pulldown", { id: 5, sets: 1, reps: "15", description: "Neutral grip for balanced lat & bicep engagement." }),
          buildExercise("horizontal-neutral-grip-row", { id: 6, sets: 2, reps: "12" }),
          buildExercise("barbell-bent-over-row", { id: 7, sets: 4, reps: "6-10", description: "Horizontal pull for thickness." }),
          buildExercise("seated-cable-row", { id: 8, sets: 3, reps: "8-12" }),
          buildExercise("reverse-crunches", { id: 9, sets: 2, reps: "15", description: "Lower abs engagement and core control." })
        ]
      },

      arms: {
        splitDay: "Arms Day",
        exercises: [
          buildExercise("ezbar-preacher-curls", { id: 1, sets: 2, reps: "15" }),
          buildExercise("incline-dumbbell-curls", { id: 2, sets: 3, reps: "15" }),
          buildExercise("hammer-curls", { id: 3, sets: 3, reps: "15" }),
          buildExercise("tricep-extension-push-ups", { id: 4, sets: 1, reps: "20", uniqueName: "tricep-extension-pushups" }),
          buildExercise("bent-tricep-pull", { id: 5, sets: 2, reps: "10" }),
          buildExercise("tricep-rope-pulldown", { id: 6, sets: 2, reps: "15" })
        ]
      },

      legs: {
        splitDay: "Leg Day",
        exercises: [
          buildExercise("back-squat", { id: 1, sets: 4, reps: "6-10", description: "Primary quad-dominant compound for mass and strength." }),
          buildExercise("leg-press", { id: 2, sets: 3, reps: "10-15", pose_analyzer: false, description: "High-volume quad focus; adjust foot placement to vary emphasis." }),
          buildExercise("romanian-deadlift", { id: 3, sets: 3, reps: "6-10", description: "Hamstring and glute hinge development." }),
          buildExercise("hamstring-curl", { id: 4, sets: 3, reps: "10-15", description: "Isolation for hamstring hypertrophy and knee health." }),
          buildExercise("standing-calf-raises", { id: 5, sets: 4, reps: "12-20", description: "Gastrocnemius-focused calf development." })
        ]
      },

      shoulders: {
        splitDay: "Shoulders Day",
        exercises: [
          buildExercise("chest-supported-shoulder-press", { id: 1, sets: 2, reps: "12" }),
          buildExercise("cable-lateral-raises", { id: 2, sets: 2, reps: "15" }),
          buildExercise("overhead-shoulder-press", { id: 3, sets: 2, reps: "12" }),
          buildExercise("cable-rope-press", { id: 4, sets: 2, reps: "15", exerciseName: "Cable Rope Press / Face Pull", description: "Shoulder cable movement targeting rear delts and traps", primaryMuscle: "Rear Deltoids", secondaryMuscles: ["Upper Traps", "Rotator Cuff"] }),
          buildExercise("front-raises", { id: 5, sets: 2, reps: "12" }),
          buildExercise("seated-overhead-press", { id: 6, sets: 4, reps: "6-10" }),
          buildExercise("dumbbell-lateral-raises", { id: 7, sets: 4, reps: "12-15" }),
          buildExercise("rear-delt-fly", { id: 8, sets: 3, reps: "12-15" })
        ]
      }
    }
  },

  hybrid: {
    splitId: "hybrid",
    name: "Hybrid Split",
    description: "Strength + Conditioning mix for athletes",
    duration: "4 days/week",
    type: "Athletic Performance",
    days: {
      strengthUpper: {
        splitDay: "Strength Upper",
        exercises: [
          buildExercise("flat-barbell-bench-press", { id: 1, sets: 5, reps: "3-5", exerciseName: "Bench Press", uniqueName: "bench-press-heavy", description: "Heavy strength work for horizontal pressing power." }),
          buildExercise("weighted-pull-ups", { id: 2, sets: 4, reps: "6-8", exerciseName: "Pull-ups (Weighted if possible)", uniqueName: "pull-ups-weighted", description: "Primary vertical pull for lats and upper-body pulling strength.", secondaryMuscles: ["Rhomboids", "Middle Traps", "Biceps", "Rear Deltoids"] }),
          buildExercise("overhead-shoulder-press", { id: 3, sets: 4, reps: "5-6", exerciseName: "Overhead Press", uniqueName: "overhead-press-heavy", description: "Heavy vertical press for shoulder strength and stability.", secondaryMuscles: ["Triceps", "Upper Chest", "Core"] }),
          buildExercise("battle-ropes", { id: 4, sets: 3, reps: "30s" })
        ]
      },

      strengthLower: {
        splitDay: "Strength Lower",
        exercises: [
          buildExercise("squats", { id: 1, sets: 5, reps: "3-5", uniqueName: "squats-heavy", description: "Heavy strength squats for total leg and core strength.", secondaryMuscles: ["Glutes", "Hamstrings", "Calves", "Core"] }),
          buildExercise("deadlifts", { id: 2, sets: 4, reps: "3-5", uniqueName: "deadlifts-heavy", description: "Heavy posterior-chain pulling for strength and power.", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back", "Upper Traps", "Lats", "Forearms"] }),
          buildExercise("box-jumps", { id: 3, sets: 4, reps: "8-10" }),
          buildExercise("sled-push", { id: 4, sets: 3, reps: "20m" })
        ]
      },

      conditioning: {
        splitDay: "Conditioning",
        exercises: [
          buildExercise("burpees", { id: 1, sets: 4, reps: "10-15" }),
          buildExercise("mountain-climbers", { id: 2, sets: 4, reps: "30s" }),
          buildExercise("kettlebell-swings", { id: 3, sets: 4, reps: "20-25" }),
          buildExercise("high-knees", { id: 4, sets: 3, reps: "30s" }),
          buildExercise("reverse-crunches", { id: 5, sets: 3, reps: "15-20", description: "Lower abs engagement and core strengthening." })
        ]
      },

      recovery: {
        name: "Active Recovery",
        exercises: [
          buildExercise("light-squats", { id: 1, sets: 3, reps: "15-20" }),
          buildExercise("band-pull-aparts", { id: 2, sets: 3, reps: "20-25" }),
          buildExercise("plank", { id: 3, sets: 3, reps: "45-60s", description: "Core stability." }),
          buildExercise("walking", { id: 4, sets: 1, reps: "20-30 mins" })
        ]
      }
    }
  }
};
