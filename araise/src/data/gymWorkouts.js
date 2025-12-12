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
          { id: 1, exerciseName: "Push-ups", uniqueName: "push-ups", sets: 3, reps: "15", pose_analyzer: true, description: "Bodyweight chest warm-up", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Shoulders","Core"], video: "/videos/chest/pushups.mp4" },
          { id: 2, exerciseName: "Incline Dumbbell Press", uniqueName: "incline-dumbbell-press", sets: 3, reps: "15", pose_analyzer: true, description: "Upper chest hypertrophy focus", primaryMuscle: "Upper Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/dumbbell_press.mp4" },
          { id: 3, exerciseName: "Incline Barbell Bench Press", uniqueName: "incline-barbell-bench-press", sets: 3, reps: "15", pose_analyzer: true, description: "Upper chest hypertrophy focus", primaryMuscle: "Upper Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/inclined_chest_press.mp4" },
          { id: 4, exerciseName: "Flat Barbell Bench Press", uniqueName: "flat-barbell-bench-press", sets: 3, reps: "10-12", pose_analyzer: true, description: "Mid-chest compound strength builder", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Shoulders"], video: "/videos/chest/flat_bench_press.mp4" },
          { id: 5, exerciseName: "Rope Pulldowns (Chest)", uniqueName: "rope-pulldown-chest", sets: 2, reps: "12-15", pose_analyzer: true, description: "Lower chest isolation", primaryMuscle: "Lower Chest", secondaryMuscles: ["Triceps"], video: "/videos/chest/chest_flys.mp4" },
          { id: 6, exerciseName: "Tricep Extension Push-ups", uniqueName: "tricep-extension-push-ups", sets: 1, reps: "20", pose_analyzer: true, description: "Tricep activation warm-up", primaryMuscle: "Triceps", secondaryMuscles: ["Chest","Shoulders"], video: "/videos/tricep/Tricep_Extension_Push-ups.mp4" },
          { id: 7, exerciseName: "Bent Tricep Pull", uniqueName: "bent-tricep-pull", sets: 2, reps: "10", pose_analyzer: true, description: "Free-weight tricep isolation", primaryMuscle: "Triceps", secondaryMuscles: [], video: "/videos/tricep/long_head.mp4" },
          { id: 8, exerciseName: "Tricep Rope Pulldown", uniqueName: "tricep-rope-pulldown", sets: 2, reps: "15", pose_analyzer: true, description: "Cable-based tricep isolation", primaryMuscle: "Triceps", secondaryMuscles: ["Forearms"], video: "/videos/tricep/tricpe_shape.mp4" },
          { id: 9, exerciseName: "Crunches", uniqueName: "crunches", sets: 3, reps: "20", pose_analyzer: true, description: "Core activation and abdominal hypertrophy", primaryMuscle: "Abs", secondaryMuscles: ["Obliques"], video: "/videos/abs/abs_ropecrunches.mp4" },
          { id: 10, exerciseName: "Plank", uniqueName: "plank", sets: 3, reps: "60s hold", pose_analyzer: true, description: "Core stability and endurance", primaryMuscle: "Core", secondaryMuscles: ["Shoulders","Glutes","Lower Back"], video: "/videos/abs/plank.mp4" }
        ]
      },
      pull: {
        splitDay: "Pull Day",
        exercises: [
          { id: 1, exerciseName: "Wide Grip Pull-ups", uniqueName: "wide-grip-pull-ups", sets: 3, reps: "10", pose_analyzer: true, description: "Lat width development", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids","Traps"], video: "/videos/back/wide_grip_pull_ups.mp4" },
          { id: 2, exerciseName: "Neutral Grip Pull-ups", uniqueName: "neutral-grip-pull-ups", sets: 3, reps: "10", pose_analyzer: true, description: "Balanced back & arm engagement", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Forearms"], video: "/videos/back/Neutral_grip_pull_ups.mp4" },
          { id: 3, exerciseName: "Chest Supported Rows", uniqueName: "chest-supported-rows", sets: 3, reps: "10", pose_analyzer: true, description: "Mid-back and rhomboid activation", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps","Rear Deltoids"], video: "/videos/back/chest_rows.mp4" },
          { id: 4, exerciseName: "Cable Lat Pulldown", uniqueName: "cable-lat-pulldown", sets: 1, reps: "15", pose_analyzer: true, description: "Cable isolation for lats", primaryMuscle: "Lats", secondaryMuscles: ["Traps","Rear Deltoids"], video: "/videos/back/Lat_pulldown.mp4" },
          { id: 5, exerciseName: "Neutral Grip Pulldown", uniqueName: "neutral-grip-pulldown", sets: 1, reps: "15", pose_analyzer: true, description: "Neutral grip for lats & biceps", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids"], video: "/videos/back/nuetralgrip_pulldwon.mp4" },
          { id: 6, exerciseName: "Horizontal Neutral Grip Row", uniqueName: "horizontal-neutral-grip-row", sets: 2, reps: "12", pose_analyzer: true, description: "Functional unilateral lat movement", primaryMuscle: "Lats", secondaryMuscles: ["Core","Biceps"], video: "/videos/back/horizontal_nuetralgrip.mp4" },
          { id: 7, exerciseName: "Reverse Crunches", uniqueName: "reverse-crunches", sets: 2, reps: "15", pose_analyzer: true, description: "Lower abs engagement", primaryMuscle: "Lower Abs", secondaryMuscles: ["Hip Flexors"], video: "/videos/back/Lowerback.mp4" },
          { id: 8, exerciseName: "EZ Bar Preacher Curls", uniqueName: "ezbar-preacher-curls", sets: 2, reps: "15", pose_analyzer: true, description: "Strict bicep curl variation", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4" },
          { id: 9, exerciseName: "Incline Dumbbell Curls", uniqueName: "incline-dumbbell-curls", sets: 3, reps: "15", pose_analyzer: true, description: "Bicep peak isolation", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/inclined_barbell_cruls.mp4" },
          { id: 10, exerciseName: "Hammer Curls", uniqueName: "hammer-curls", sets: 3, reps: "15", pose_analyzer: true, description: "Biceps & brachialis thickness", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/hammercurls.mp4" }
        ]
      },
      legs: {
        splitDay: "Leg Day",
        exercises: [
          { id: 1, exerciseName: "Squats", uniqueName: "squats", sets: 3, reps: "12-15", pose_analyzer: true, description: "Compound lower body builder", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core"], video: "/videos/legs/Squats.mp4" },
          { id: 2, exerciseName: "Leg Press (Close Stance)", uniqueName: "leg-press-close", sets: 1, reps: "12-15", pose_analyzer: true, description: "Quad dominant press variation", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings"], video: "/videos/legs/Leg_press.mp4" },
          { id: 3, exerciseName: "Leg Press (Wide Stance)", uniqueName: "leg-press-wide", sets: 1, reps: "12-15", pose_analyzer: true, description: "Glute and hamstring emphasis", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings","Quadriceps"], video: "/videos/legs/Leg_press.mp4" },
          { id: 4, exerciseName: "Leg Press (Feet High)", uniqueName: "leg-press-feet-high", sets: 1, reps: "12-15", pose_analyzer: true, description: "Hamstring and glute focus", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes","Quadriceps"], video: "/videos/legs/Leg_press.mp4" },
          { id: 5, exerciseName: "Calf Raises", uniqueName: "calf-raises", sets: 2, reps: "15-20", pose_analyzer: false, description: "Calf hypertrophy", primaryMuscle: "Calves", secondaryMuscles: [], video: null },
          { id: 6, exerciseName: "Chest Supported Shoulder Press", uniqueName: "chest-supported-shoulder-press", sets: 2, reps: "12", pose_analyzer: true, description: "Shoulder press with chest support", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 7, exerciseName: "Cable Lateral Raises", uniqueName: "cable-lateral-raises", sets: 2, reps: "15", pose_analyzer: true, description: "Medial delt isolation", primaryMuscle: "Shoulders", secondaryMuscles: [], video: "/videos/shoulders/Lateral raises.mp4" },
          { id: 8, exerciseName: "Overhead Shoulder Press", uniqueName: "overhead-shoulder-press", sets: 2, reps: "12", pose_analyzer: true, description: "Compound shoulder strength", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps","Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 9, exerciseName: "Cable Rope Press", uniqueName: "cable-rope-press", sets: 2, reps: "15", pose_analyzer: true, description: "Shoulder cable press variation", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], video: "/videos/shoulders/Face rope pulls.mp4" },
          { id: 10, exerciseName: "Front Raises", uniqueName: "front-raises", sets: 2, reps: "12", pose_analyzer: true, description: "Front delt isolation", primaryMuscle: "Front Deltoids", secondaryMuscles: ["Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 11, exerciseName: "Abs Circuit", uniqueName: "abs-circuit", sets: 3, reps: "Varied", pose_analyzer: false, description: "Core strengthening (planks, crunches, leg raises)", primaryMuscle: "Abs", secondaryMuscles: ["Obliques","Lower Back"], video: null }
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
          { id: 1, exerciseName: "Flat Barbell Bench Press", uniqueName: "flat-barbell-bench-press", sets: 4, reps: "4-6 / 8-12", pose_analyzer: true, description: "Primary horizontal push — builds chest and pressing strength.", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/flat_bench_press.mp4" },
          { id: 2, exerciseName: "Incline Dumbbell Press", uniqueName: "incline-dumbbell-press", sets: 3, reps: "8-12", pose_analyzer: true, description: "Upper chest hypertrophy and shoulder-friendly pressing.", primaryMuscle: "Upper Chest", secondaryMuscles: ["Front Deltoids","Triceps"], video: "/videos/chest/dumbbell_press.mp4" },
          { id: 3, exerciseName: "Weighted Pull-ups (or Lat Pulldown)", uniqueName: "weighted-pull-ups", sets: 4, reps: "6-10", pose_analyzer: true, description: "Primary vertical pull — builds lats and pulling strength.", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids"], video: "/videos/back/wide_grip_pull_ups.mp4" },
          { id: 4, exerciseName: "Barbell Bent-over Row", uniqueName: "barbell-bent-over-row", sets: 4, reps: "6-10", pose_analyzer: true, description: "Horizontal pull — mid-back thickness and overall back strength.", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps","Rear Deltoids"], video: "/videos/back/chest_rows.mp4" },
          { id: 5, exerciseName: "Dumbbell Lateral Raises", uniqueName: "dumbbell-lateral-raises", sets: 3, reps: "12-15", pose_analyzer: true, description: "Best exercise for side delt width and roundness.", primaryMuscle: "Side Deltoids", secondaryMuscles: [], video: "/videos/shoulders/Lateral raises.mp4" },
          { id: 6, exerciseName: "Rear Delt Fly (Machine or Dumbbell)", uniqueName: "rear-delt-fly", sets: 3, reps: "12-15", pose_analyzer: true, description: "Strengthens rear delts and improves shoulder posture.", primaryMuscle: "Rear Deltoids", secondaryMuscles: ["Rhomboids","Middle Traps"], video: "/videos/shoulders/Face rope pulls.mp4" },
          { id: 7, exerciseName: "Chest Dips (leaning forward) — superset option", uniqueName: "chest-dips-superset", sets: 3, reps: "6-12", pose_analyzer: true, description: "Chest-leaning dips emphasize lower chest while the pushdown finishes triceps — pair as a superset.", primaryMuscle: "Chest / Triceps", secondaryMuscles: ["Front Deltoids"], video: null },
          { id: 8, exerciseName: "Barbell Curls", uniqueName: "barbell-curls", sets: 3, reps: "8-12", pose_analyzer: true, description: "Heavy bicep mass builder.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4" },
          { id: 9, exerciseName: "Incline Dumbbell Curls", uniqueName: "incline-dumbbell-curls", sets: 3, reps: "10-15", pose_analyzer: true, description: "Stretches long head of biceps for peak development.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/inclined_barbell_cruls.mp4" },
          { id: 10, exerciseName: "Tricep Rope Pushdown", uniqueName: "tricep-rope-pushdown", sets: 3, reps: "10-15", pose_analyzer: true, description: "Direct triceps isolation to finish the workout.", primaryMuscle: "Triceps", secondaryMuscles: ["Forearms"], video: "/videos/tricep/tricpe_shape.mp4" }
        ]
      },
      lower: {
        splitDay: "Lower Body",
        exercises: [
          { id: 1, exerciseName: "Back Squat", uniqueName: "back-squat", sets: 4, reps: "4-6 / 6-10", pose_analyzer: true, description: "Primary lower-body compound — builds quads, glutes, core and overall strength.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core"], video: "/videos/legs/Squats.mp4" },
          { id: 2, exerciseName: "Leg Press (Feet Placement as needed)", uniqueName: "leg-press", sets: 3, reps: "10-15", pose_analyzer: false, description: "High-volume quad development option; adjust foot position to vary quad/glute emphasis.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings"], video: "/videos/legs/Leg_press.mp4" },
          { id: 3, exerciseName: "Romanian Deadlift (RDL)", uniqueName: "romanian-deadlift", sets: 3, reps: "6-10", pose_analyzer: true, description: "Hamstring-dominant hinge to develop posterior chain strength and hip extension.", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes","Lower Back"], video: null },
          { id: 4, exerciseName: "Hamstring Curl (Machine or Swiss Ball)", uniqueName: "hamstring-curl", sets: 3, reps: "10-15", pose_analyzer: false, description: "Isolated hamstring work to balance knee health and improve posterior chain hypertrophy.", primaryMuscle: "Hamstrings", secondaryMuscles: [], video: null },
          { id: 5, exerciseName: "Standing Calf Raises", uniqueName: "standing-calf-raises", sets: 4, reps: "12-20", pose_analyzer: false, description: "Heavy standing variation for gastrocnemius strength and thickness.", primaryMuscle: "Calves", secondaryMuscles: [], video: null },
          { id: 6, exerciseName: "Hip Thrust", uniqueName: "hip-thrust", sets: 3, reps: "8-12", pose_analyzer: true, description: "Glute-dominant lift for hip extension strength, stability, and hypertrophy.", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings","Core"], video: null },
          { id: 7, exerciseName: "Bulgarian Split Squat", uniqueName: "bulgarian-split-squat", sets: 3, reps: "8-12 each leg", pose_analyzer: true, description: "Single-leg movement to reduce imbalance and build quad & glute strength.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core"], video: null },
          { id: 8, exerciseName: "Core Stability (Plank / Pallof Press)", uniqueName: "core-stability", sets: 3, reps: "30-90s / 8-12", pose_analyzer: true, description: "Anti-extension/rotation core stability for transferring strength safely.", primaryMuscle: "Core", secondaryMuscles: ["Obliques","Lower Back"], video: "/videos/abs/plank.mp4" }
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
          { id: 1, exerciseName: "Push-ups", uniqueName: "push-ups", sets: 2, reps: "15", pose_analyzer: true, description: "Upper body warm-up for chest, triceps, and shoulders.", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Shoulders","Core"], video: "/videos/chest/pushups.mp4" },
          { id: 2, exerciseName: "Pull-ups", uniqueName: "pull-ups", sets: 2, reps: "6-10", pose_analyzer: true, description: "Warm-up back exercise activating lats and biceps.", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids"], video: "/videos/back/wide_grip_pull_ups.mp4" },
          { id: 3, exerciseName: "Flat Barbell Bench Press", uniqueName: "flat-barbell-bench-press", sets: 4, reps: "6-10", pose_analyzer: true, description: "Primary chest compound movement for strength.", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/flat_bench_press.mp4" },
          { id: 4, exerciseName: "Incline Dumbbell Press", uniqueName: "incline-dumbbell-press", sets: 3, reps: "8-12", pose_analyzer: true, description: "Upper chest hypertrophy movement.", primaryMuscle: "Upper Chest", secondaryMuscles: ["Front Deltoids","Triceps"], video: "/videos/chest/dumbbell_press.mp4" },
          { id: 5, exerciseName: "Lat Pulldown", uniqueName: "lat-pulldown", sets: 3, reps: "10-12", pose_analyzer: true, description: "Vertical pull for lat width.", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Traps"], video: "/videos/back/Lat_pulldown.mp4" },
          { id: 6, exerciseName: "Chest Supported Rows", uniqueName: "chest-supported-rows", sets: 3, reps: "10-12", pose_analyzer: true, description: "Horizontal pulling for back thickness.", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps","Rear Deltoids"], video: "/videos/back/chest_rows.mp4" },
          { id: 7, exerciseName: "Squats", uniqueName: "squats", sets: 4, reps: "8-12", pose_analyzer: true, description: "Primary lower body compound exercise.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core"], video: "/videos/legs/Squats.mp4" },
          { id: 8, exerciseName: "Leg Press", uniqueName: "leg-press", sets: 3, reps: "12-15", pose_analyzer: true, description: "Quad-focused machine movement.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings"], video: "/videos/legs/Leg_press.mp4" },
          { id: 9, exerciseName: "Shoulder Press", uniqueName: "shoulder-press", sets: 3, reps: "8-12", pose_analyzer: true, description: "Primary shoulder builder.", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps","Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 10, exerciseName: "Barbell Curls", uniqueName: "barbell-curls", sets: 3, reps: "10-12", pose_analyzer: true, description: "Bicep isolation for mass.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4" },
          { id: 11, exerciseName: "Tricep Rope Pulldown", uniqueName: "tricep-rope-pulldown", sets: 3, reps: "12-15", pose_analyzer: true, description: "Tricep isolation using cables.", primaryMuscle: "Triceps", secondaryMuscles: ["Forearms"], video: "/videos/tricep/tricpe_shape.mp4" },
          { id: 12, exerciseName: "Plank", uniqueName: "plank", sets: 3, reps: "45-60s", pose_analyzer: true, description: "Core stability finisher.", primaryMuscle: "Core", secondaryMuscles: ["Shoulders","Glutes"], video: "/videos/abs/plank.mp4" }
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
          { id: 1, exerciseName: "Push-ups", uniqueName: "push-ups", sets: 3, reps: "15", pose_analyzer: true, description: "Bodyweight chest warm-up", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Shoulders","Core"], video: "/videos/chest/pushups.mp4" },
          { id: 2, exerciseName: "Flat Barbell Bench Press", uniqueName: "flat-barbell-bench-press", sets: 4, reps: "6-10", pose_analyzer: true, description: "Heavy compound to build mass and strength on the chest.", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/flat_bench_press.mp4" },
          { id: 3, exerciseName: "Incline Dumbbell Press", uniqueName: "incline-dumbbell-press", sets: 4, reps: "8-12", pose_analyzer: true, description: "Upper chest emphasis and balanced shoulder-friendly pressing.", primaryMuscle: "Upper Chest", secondaryMuscles: ["Front Deltoids","Triceps"], video: "/videos/chest/dumbbell_press.mp4" },
          { id: 4, exerciseName: "Chest Flyes (Cable or Dumbbell)", uniqueName: "chest-flyes", sets: 3, reps: "10-15", pose_analyzer: true, description: "Isolation for chest shape and contraction.", primaryMuscle: "Chest", secondaryMuscles: ["Front Deltoids"], video: "/videos/chest/chest_flys.mp4" },
          { id: 5, exerciseName: "Dips (Chest-leaning)", uniqueName: "chest-dips", sets: 3, reps: "8-12", pose_analyzer: true, description: "Lower-chest emphasis; lean forward for chest bias.", primaryMuscle: "Lower Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: null }
        ]
      },

      back: {
        splitDay: "Back Day",
        exercises: [
          { id: 1, exerciseName: "Deadlifts (Conventional or Trap Bar)", uniqueName: "deadlifts", sets: 4, reps: "4-6", pose_analyzer: true, description: "Total posterior-chain strength and mass builder.", primaryMuscle: "Lower Back", secondaryMuscles: ["Hamstrings","Glutes","Upper Traps","Lats"], video: null },
          { id: 2, exerciseName: "Weighted Pull-ups (or Lat Pulldown)", uniqueName: "weighted-pull-ups", sets: 4, reps: "6-10", pose_analyzer: true, description: "Vertical pulling for width and lats.", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids"], video: "/videos/back/wide_grip_pull_ups.mp4" },
          { id: 3, exerciseName: "Chest Supported Rows", uniqueName: "chest-supported-rows", sets: 3, reps: "10", pose_analyzer: true, description: "Mid-back and rhomboid activation.", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps","Rear Deltoids"], video: "/videos/back/chest_rows.mp4" },
          { id: 4, exerciseName: "Cable Lat Pulldown", uniqueName: "cable-lat-pulldown", sets: 1, reps: "15", pose_analyzer: true, description: "Cable isolation for lats.", primaryMuscle: "Lats", secondaryMuscles: ["Traps","Rear Deltoids"], video: "/videos/back/Lat_pulldown.mp4" },
          { id: 5, exerciseName: "Neutral Grip Pulldown", uniqueName: "neutral-grip-pulldown", sets: 1, reps: "15", pose_analyzer: true, description: "Neutral grip for balanced lat & bicep engagement.", primaryMuscle: "Lats", secondaryMuscles: ["Biceps","Rear Deltoids"], video: "/videos/back/nuetralgrip_pulldwon.mp4" },
          { id: 6, exerciseName: "Horizontal Neutral Grip Row", uniqueName: "horizontal-neutral-grip-row", sets: 2, reps: "12", pose_analyzer: true, description: "Functional unilateral lat movement.", primaryMuscle: "Lats", secondaryMuscles: ["Core","Biceps"], video: "/videos/back/horizontal_nuetralgrip.mp4" },
          { id: 7, exerciseName: "Barbell Bent-over Row", uniqueName: "barbell-bent-over-row", sets: 4, reps: "6-10", pose_analyzer: true, description: "Horizontal pull for thickness.", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps","Rear Deltoids"], video: "/videos/back/chest_rows.mp4" },
          { id: 8, exerciseName: "Seated Cable Row", uniqueName: "seated-cable-row", sets: 3, reps: "8-12", pose_analyzer: true, description: "Controlled horizontal pulling for detail and contraction.", primaryMuscle: "Middle Back", secondaryMuscles: ["Lats","Biceps"], video: "/videos/back/chest_rows.mp4" },
          { id: 9, exerciseName: "Reverse Crunches", uniqueName: "reverse-crunches", sets: 2, reps: "15", pose_analyzer: true, description: "Lower abs engagement and core control.", primaryMuscle: "Lower Abs", secondaryMuscles: ["Hip Flexors"], video: "/videos/back/Lowerback.mp4" }
        ]
      },

      arms: {
        splitDay: "Arms Day",
        exercises: [
          { id: 1, exerciseName: "EZ Bar Preacher Curls", uniqueName: "ezbar-preacher-curls", sets: 2, reps: "15", pose_analyzer: true, description: "Strict bicep curl variation.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/EZ_Bar_Preacher_Curls.mp4" },
          { id: 2, exerciseName: "Incline Dumbbell Curls", uniqueName: "incline-dumbbell-curls", sets: 3, reps: "15", pose_analyzer: true, description: "Bicep peak isolation.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/inclined_barbell_cruls.mp4" },
          { id: 3, exerciseName: "Hammer Curls", uniqueName: "hammer-curls", sets: 3, reps: "15", pose_analyzer: true, description: "Biceps & brachialis thickness.", primaryMuscle: "Biceps", secondaryMuscles: ["Forearms"], video: "/videos/biceps/hammercurls.mp4" },
          { id: 4, exerciseName: "Tricep Extension Push-ups", uniqueName: "tricep-extension-pushups", sets: 1, reps: "20", pose_analyzer: true, description: "Tricep activation warm-up.", primaryMuscle: "Triceps", secondaryMuscles: ["Chest","Shoulders"], video: "/videos/tricep/Tricep_Extension_Push-ups.mp4" },
          { id: 5, exerciseName: "Bent Tricep Pull", uniqueName: "bent-tricep-pull", sets: 2, reps: "10", pose_analyzer: true, description: "Free-weight tricep isolation.", primaryMuscle: "Triceps", secondaryMuscles: [], video: "/videos/tricep/long_head.mp4" },
          { id: 6, exerciseName: "Tricep Rope Pulldown", uniqueName: "tricep-rope-pulldown", sets: 2, reps: "15", pose_analyzer: true, description: "Cable-based tricep isolation.", primaryMuscle: "Triceps", secondaryMuscles: ["Forearms"], video: "/videos/tricep/tricpe_shape.mp4" }
        ]
      },

      legs: {
        splitDay: "Leg Day",
        exercises: [
          { id: 1, exerciseName: "Back Squat", uniqueName: "back-squat", sets: 4, reps: "6-10", pose_analyzer: true, description: "Primary quad-dominant compound for mass and strength.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core"], video: "/videos/legs/Squats.mp4" },
          { id: 2, exerciseName: "Leg Press", uniqueName: "leg-press", sets: 3, reps: "10-15", pose_analyzer: false, description: "High-volume quad focus; adjust foot placement to vary emphasis.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings"], video: "/videos/legs/Leg_press.mp4" },
          { id: 3, exerciseName: "Romanian Deadlift (RDL)", uniqueName: "romanian-deadlift", sets: 3, reps: "6-10", pose_analyzer: true, description: "Hamstring and glute hinge development.", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes","Lower Back"], video: null },
          { id: 4, exerciseName: "Hamstring Curl", uniqueName: "hamstring-curl", sets: 3, reps: "10-15", pose_analyzer: false, description: "Isolation for hamstring hypertrophy and knee health.", primaryMuscle: "Hamstrings", secondaryMuscles: [], video: null },
          { id: 5, exerciseName: "Standing Calf Raises", uniqueName: "standing-calf-raises", sets: 4, reps: "12-20", pose_analyzer: false, description: "Gastrocnemius-focused calf development.", primaryMuscle: "Calves", secondaryMuscles: [], video: null }
        ]
      },

      shoulders: {
        splitDay: "Shoulders Day",
        exercises: [
          { id: 1, exerciseName: "Chest Supported Shoulder Press", uniqueName: "chest-supported-shoulder-press", sets: 2, reps: "12", pose_analyzer: true, description: "Shoulder press with chest support", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 2, exerciseName: "Cable Lateral Raises", uniqueName: "cable-lateral-raises", sets: 2, reps: "15", pose_analyzer: true, description: "Medial delt isolation", primaryMuscle: "Side Deltoids", secondaryMuscles: [], video: "/videos/shoulders/Lateral raises.mp4" },
          { id: 3, exerciseName: "Overhead Shoulder Press", uniqueName: "overhead-shoulder-press", sets: 2, reps: "12", pose_analyzer: true, description: "Compound shoulder pressing movement", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps","Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 4, exerciseName: "Cable Rope Press / Face Pull", uniqueName: "cable-rope-press", sets: 2, reps: "15", pose_analyzer: true, description: "Shoulder cable movement targeting rear delts and traps", primaryMuscle: "Rear Deltoids", secondaryMuscles: ["Upper Traps","Rotator Cuff"], video: "/videos/shoulders/Face rope pulls.mp4" },
          { id: 5, exerciseName: "Front Raises", uniqueName: "front-raises", sets: 2, reps: "12", pose_analyzer: true, description: "Front delt isolation", primaryMuscle: "Front Deltoids", secondaryMuscles: ["Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 6, exerciseName: "Seated Overhead Press", uniqueName: "seated-overhead-press", sets: 4, reps: "6-10", pose_analyzer: true, description: "Primary shoulder strength builder", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps","Upper Chest"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 7, exerciseName: "Dumbbell Lateral Raises", uniqueName: "dumbbell-lateral-raises", sets: 4, reps: "12-15", pose_analyzer: true, description: "Side delt width builder", primaryMuscle: "Side Deltoids", secondaryMuscles: [], video: "/videos/shoulders/Lateral raises.mp4" },
          { id: 8, exerciseName: "Rear Delt Fly", uniqueName: "rear-delt-fly", sets: 3, reps: "12-15", pose_analyzer: true, description: "Rear delt isolation and posture improvement", primaryMuscle: "Rear Deltoids", secondaryMuscles: ["Rhomboids","Middle Traps"], video: "/videos/shoulders/Face rope pulls.mp4" }
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
          { id: 1, exerciseName: "Bench Press", uniqueName: "bench-press-heavy", sets: 5, reps: "3-5", pose_analyzer: true, description: "Heavy strength work for horizontal pressing power.", primaryMuscle: "Chest", secondaryMuscles: ["Triceps","Front Deltoids"], video: "/videos/chest/flat_bench_press.mp4" },
          { id: 2, exerciseName: "Pull-ups (Weighted if possible)", uniqueName: "pull-ups-weighted", sets: 4, reps: "6-8", pose_analyzer: true, description: "Primary vertical pull for lats and upper-body pulling strength.", primaryMuscle: "Lats", secondaryMuscles: ["Rhomboids","Middle Traps","Biceps","Rear Deltoids"], video: "/videos/back/wide_grip_pull_ups.mp4" },
          { id: 3, exerciseName: "Overhead Press", uniqueName: "overhead-press-heavy", sets: 4, reps: "5-6", pose_analyzer: true, description: "Heavy vertical press for shoulder strength and stability.", primaryMuscle: "Shoulders", secondaryMuscles: ["Triceps","Upper Chest","Core"], video: "/videos/shoulders/Shoulder press.mp4" },
          { id: 4, exerciseName: "Battle Ropes (Conditioning Finisher)", uniqueName: "battle-ropes", sets: 3, reps: "30s", pose_analyzer: false, description: "Conditioning finisher that improves work capacity and shoulder endurance.", primaryMuscle: "Shoulders", secondaryMuscles: ["Core","Forearms","Cardio"], video: null }
        ]
      },

      strengthLower: {
        splitDay: "Strength Lower",
        exercises: [
          { id: 1, exerciseName: "Squats", uniqueName: "squats-heavy", sets: 5, reps: "3-5", pose_analyzer: true, description: "Heavy strength squats for total leg and core strength.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Calves","Core"], video: "/videos/legs/Squats.mp4" },
          { id: 2, exerciseName: "Deadlifts", uniqueName: "deadlifts-heavy", sets: 4, reps: "3-5", pose_analyzer: true, description: "Heavy posterior-chain pulling for strength and power.", primaryMuscle: "Hamstrings", secondaryMuscles: ["Glutes","Lower Back","Upper Traps","Lats","Forearms"], video: null },
          { id: 3, exerciseName: "Box Jumps", uniqueName: "box-jumps", sets: 4, reps: "8-10", pose_analyzer: true, description: "Explosive lower-body power and rate-of-force development.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Calves","Core"], video: null },
          { id: 4, exerciseName: "Sled Push", uniqueName: "sled-push", sets: 3, reps: "20m", pose_analyzer: false, description: "High-intensity conditioning and leg drive.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Core","Cardio"], video: null }
        ]
      },

      conditioning: {
        splitDay: "Conditioning",
        exercises: [
          { id: 1, exerciseName: "Burpees", uniqueName: "burpees", sets: 4, reps: "10-15", pose_analyzer: true, description: "Full-body conditioning drill combining strength and cardio.", primaryMuscle: "Full Body", secondaryMuscles: ["Cardio","Core","Shoulders"], video: null },
          { id: 2, exerciseName: "Mountain Climbers", uniqueName: "mountain-climbers", sets: 4, reps: "30s", pose_analyzer: true, description: "Core & conditioning movement.", primaryMuscle: "Core", secondaryMuscles: ["Shoulders","Quadriceps","Cardio"], video: null },
          { id: 3, exerciseName: "Kettlebell Swings", uniqueName: "kettlebell-swings", sets: 4, reps: "20-25", pose_analyzer: true, description: "Hip hinge conditioning for power endurance.", primaryMuscle: "Glutes", secondaryMuscles: ["Hamstrings","Core","Shoulders","Cardio"], video: null },
          { id: 4, exerciseName: "High Knees (Finisher)", uniqueName: "high-knees", sets: 3, reps: "30s", pose_analyzer: false, description: "High heart-rate finisher focused on sprint mechanics.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Hip Flexors","Cardio","Core"], video: null },
          { id: 5, exerciseName: "Reverse Crunches", uniqueName: "reverse-crunches", sets: 3, reps: "15-20", pose_analyzer: true, description: "Lower abs engagement and core strengthening.", primaryMuscle: "Lower Abs", secondaryMuscles: ["Hip Flexors"], video: "/videos/back/Lowerback.mp4" }
        ]
      },

      recovery: {
        name: "Active Recovery",
        exercises: [
          { id: 1, exerciseName: "Light Squats", uniqueName: "light-squats", sets: 3, reps: "15-20", pose_analyzer: true, description: "Movement quality and low-load activation.", primaryMuscle: "Quadriceps", secondaryMuscles: ["Glutes","Hamstrings","Mobility"], video: "/videos/legs/Squats.mp4" },
          { id: 2, exerciseName: "Band Pull-Aparts", uniqueName: "band-pull-aparts", sets: 3, reps: "20-25", pose_analyzer: false, description: "Shoulder health and scapular control.", primaryMuscle: "Rear Deltoids", secondaryMuscles: ["Rhomboids","Middle Traps"], video: null },
          { id: 3, exerciseName: "Plank", uniqueName: "plank", sets: 3, reps: "45-60s", pose_analyzer: true, description: "Core stability.", primaryMuscle: "Core", secondaryMuscles: ["Shoulders","Glutes"], video: "/videos/abs/plank.mp4" },
          { id: 4, exerciseName: "Walking (Active Recovery)", uniqueName: "walking", sets: 1, reps: "20-30 mins", pose_analyzer: false, description: "Low-intensity steady-state to promote recovery.", primaryMuscle: "Cardio", secondaryMuscles: ["Calves","Glutes","Recovery"], video: null }
        ]
      }
    }
  }
};
