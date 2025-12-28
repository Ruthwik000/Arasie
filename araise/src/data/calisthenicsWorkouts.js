// Calisthenics Workout Programs — video URLs kept ONLY for push-ups & pull-ups; all other videos set to null
export const calisthenicsWorkouts = {
  beginner: {
    name: "Beginner Full Body",
    description: "Foundation bodyweight movements with emphasis on movement quality and base strength. Includes Frog Hold as the key introductory balance skill.",
    duration: "3 days/week",
    type: "Skill Building / Foundational Strength",
    // programmingNote: Aim 6-8 weeks. Progress by adding reps, sets or reducing assistance gradually.
    days: {
      fullBody: {
        name: "Full Body Basics",
        warmup: [
          { name: "Joint Mobility (Shoulders/Hips/Ankles)", time: "3-4 min" },
          { name: "Dynamic Leg Swings + Arm Circles", time: "2-3 min" },
          { name: "Scapular Activations / Band Pull-aparts", time: "2 min" }
        ],
        exercises: [
          {
            id: 1,
            exerciseName: "Push-ups",
            uniqueName: "push-ups",
            sets: 3,
            reps: "8-12",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Basic horizontal push; keep a straight plank line.",
            primaryMuscle: "Chest",
            secondaryMuscles: ["Triceps","Front Deltoids","Core"],
            video: "/videos/calisthenics/pushups.mp4"
          },
          {
            id: 2,
            exerciseName: "Negative Pull-ups / Assisted Pull-ups",
            uniqueName: "assisted-pull-ups",
            sets: 3,
            reps: "5-8 (negatives) / 6-10 (assisted)",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Build vertical pulling strength with controlled negatives or band assistance.",
            primaryMuscle: "Lats",
            secondaryMuscles: ["Biceps","Rear Deltoids"],
            video: "/videos/calisthenics/assisted_pullups.mp4"
          },
          {
            id: 3,
            exerciseName: "Bodyweight Squats",
            uniqueName: "bodyweight-squats",
            sets: 3,
            reps: "15-20",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Hinge at hips, depth as mobility allows; chest up.",
            primaryMuscle: "Quadriceps",
            secondaryMuscles: ["Glutes","Hamstrings","Calves","Core"],
            video: null
          },
          {
            id: 4,
            exerciseName: "Glute Bridges",
            uniqueName: "glute-bridges",
            sets: 3,
            reps: "12-20",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Posterior chain activation; squeeze at top.",
            primaryMuscle: "Glutes",
            secondaryMuscles: ["Hamstrings","Core"],
            video: null
          },
          {
            id: 5,
            exerciseName: "Plank",
            uniqueName: "plank",
            sets: 3,
            reps: "30-60s",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Core stability; maintain straight line from head to heels.",
            primaryMuscle: "Core",
            secondaryMuscles: ["Shoulders","Glutes"],
            video: null,
            time: true
          },
          {
            id: 6,
            exerciseName: "Frog Hold (Frog Stand)",
            uniqueName: "frog-hold",
            sets: 3,
            reps: "10-20s",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Foundational balance skill developing wrist strength, scapular protraction, compression and balance.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Wrists","Adductors","Balance"],
            video: null,
            time: true
          }
        ],
        cooldown: [
          { name: "Hamstring + Quad Stretch", time: "2 min" },
          { name: "Thoracic Rotation + Deep Breathing", time: "2 min" }
        ]
      }
    }
  },

  intermediate: {
    name: "Intermediate Bodyweight Strength",
    description: "Progressions to harder bodyweight moves: horizontal/vertical strength, single-leg work and core control.",
    duration: "4 days/week",
    type: "Strength / Hypertrophy",
    // programmingNote: 8 weeks ideal. Add weighted vest or reduce assistance to progress.
    days: {
      pushPullLegs: {
        name: "Push / Pull / Legs (4 day cycle)",
        // Arranged as sample exercises across a 4-day repeating cycle; you can map to Day A/B/C/D
        exercises: [
          // Push variations
          {
            id: 1,
            exerciseName: "Archer Push-ups / Elevated Push-ups",
            uniqueName: "archer-pushups",
            sets: 4,
            reps: "6-10",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Unilateral emphasis building one-arm strength; use incline if needed.",
            primaryMuscle: "Chest",
            secondaryMuscles: ["Triceps","Shoulders","Core"],
            video: null
          },
          {
            id: 2,
            exerciseName: "Dips (Parallel Bars)",
            uniqueName: "dips",
            sets: 4,
            reps: "6-12",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Chest/triceps compound — lean forward for chest bias.",
            primaryMuscle: "Chest/Triceps",
            secondaryMuscles: ["Front Deltoids"],
            video: null
          },

          // Pull variations
          {
            id: 3,
            exerciseName: "Strict Pull-ups",
            uniqueName: "strict-pullups",
            sets: 4,
            reps: "6-10",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Strict vertical pull; full ROM, scapular control.",
            primaryMuscle: "Lats",
            secondaryMuscles: ["Biceps","Rear Deltoids"],
            video: "/videos/calisthenics/pullups_strict.mp4"
          },
          {
            id: 4,
            exerciseName: "Australian Rows / Body Rows",
            uniqueName: "australian-rows",
            sets: 4,
            reps: "8-15",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Horizontal pull with anti-rotation control.",
            primaryMuscle: "Middle Back",
            secondaryMuscles: ["Biceps","Rear Deltoids","Core"],
            video: null
          },

          // Legs / Core
          {
            id: 5,
            exerciseName: "Pistol Progressions (Box Pistol / Assisted)",
            uniqueName: "pistol-progressions",
            sets: 3,
            reps: "6-10 each leg",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Single-leg strength & balance progressions.",
            primaryMuscle: "Quadriceps",
            secondaryMuscles: ["Glutes","Hamstrings","Core"],
            video: null
          },
          {
            id: 6,
            exerciseName: "Nordic Hamstring Curl (Assisted)",
            uniqueName: "nordic-hamstring",
            sets: 3,
            reps: "6-10",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Eccentric hamstring strength for knee health.",
            primaryMuscle: "Hamstrings",
            secondaryMuscles: ["Glutes","Calves"],
            video: null
          },

          // Conditioning & Core
          {
            id: 7,
            exerciseName: "Hollow Body Rocks / Hollow Holds",
            uniqueName: "hollow-body",
            sets: 4,
            reps: "20-45s",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Core strength carryover for advanced skills.",
            primaryMuscle: "Core",
            secondaryMuscles: ["Hip Flexors"],
            video: null,
            time: true
          }
        ]
      }
    }
  },

  advanced: {
    name: "Advanced Calisthenics",
    description: "High-skill strength work — planche, front lever, one-arm push progressions & weighted calisthenics.",
    duration: "5-6 days/week",
    type: "Skill + Strength",
    // programmingNote: Advanced athletes should periodize (3:1 load:deload weeks). Use weighted vests & negatives.
    days: {
      skillStrengthSplit: {
        name: "Skill + Strength Split",
        exercises: [
          {
            id: 1,
            exerciseName: "One-Arm Push-up Progressions",
            uniqueName: "one-arm-pushup-progression",
            sets: 4,
            reps: "3-6 each side",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Build unilateral pressing strength and control.",
            primaryMuscle: "Chest",
            secondaryMuscles: ["Triceps","Shoulders","Core"],
            video: null
          },
          {
            id: 2,
            exerciseName: "Front Lever Progressions (Tuck → Advanced Tuck)",
            uniqueName: "front-lever-progressions",
            sets: 5,
            reps: "10-30s holds",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Static posterior chain hold building scapular & core strength.",
            primaryMuscle: "Lats/Core",
            secondaryMuscles: ["Lower Back","Glutes"],
            video: null,
            time: true
          },
          {
            id: 3,
            exerciseName: "Planche Progressions (Advanced Tuck / Straddle)",
            uniqueName: "planche-progressions",
            sets: 5,
            reps: "10-20s holds",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Full-weight shoulder and core conditioning for planche.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Triceps","Core","Chest"],
            video: null,
            time: true
          },
          {
            id: 4,
            exerciseName: "Weighted Pull-ups / Muscle-up Practice",
            uniqueName: "weighted-pullups-muscleup",
            sets: 4,
            reps: "4-8",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Power & transition practice for muscle-up and high strength.",
            primaryMuscle: "Lats",
            secondaryMuscles: ["Biceps","Chest","Triceps"],
            video: "/videos/calisthenics/muscleup_progression.mp4"
          }
        ]
      }
    }
  },

  skillProgression: {
    name: "Skill Progression",
    description: "Dedicated skill tracks for Planche, Handstand, Front Lever and Muscle-up. Frog Hold is placed as the initial skill in planche progression.",
    duration: "4-6 days/week depending on track",
    type: "High-Skill Development",
    // programmingNote: Train skills 3–5x/week in short sessions; pair with strength accessory work.
    days: {
      planche: {
        name: "Planche Training",
        notes: "Progress slowly: Frog Hold → Planche Lean → Pseudo Planche Push-ups → Tuck Planche → Advanced Tuck → Straddle → Full Planche.",
        exercises: [
          // Frog Hold as the first and essential skill
          {
            id: 1,
            exerciseName: "Frog Hold (Frog Stand)",
            uniqueName: "frog-hold",
            sets: 4,
            reps: "15-30s",
            pose_analyzer: true,
            difficulty: "Beginner–Intermediate",
            description: "First true static balance skill; teaches lean angle, wrist pressure, and core compression needed for planche.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Wrists","Chest","Triceps","Balance"],
            video: null,
            time: true
          },
          {
            id: 2,
            exerciseName: "Planche Lean",
            uniqueName: "planche-lean",
            sets: 4,
            reps: "10-30s",
            pose_analyzer: true,
            difficulty: "Beginner–Intermediate",
            description: "Develops lean and shoulder loading for planche progression.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Chest","Triceps"],
            video: null,
            time: true
          },
          {
            id: 3,
            exerciseName: "Pseudo Planche Push-ups",
            uniqueName: "pseudo-planche-pushups",
            sets: 4,
            reps: "5-10",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Pressing strength in a forward hand position to simulate planche line.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Chest","Triceps","Core"],
            video: null
          },
          {
            id: 4,
            exerciseName: "Tuck Planche Hold",
            uniqueName: "tuck-planche-hold",
            sets: 5,
            reps: "10-20s",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Static hold building planche-specific shoulder and core strength.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Chest","Triceps"],
            video: null,
            time: true
          },
          {
            id: 5,
            exerciseName: "Advanced Tuck / Straddle Progressions",
            uniqueName: "advanced-tuck-straddle",
            sets: 5,
            reps: "8-15s",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Increase lever length progressively toward straddle/planche.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Chest","Triceps"],
            video: null,
            time: true
          },
          {
            id: 6,
            exerciseName: "Planche Push-ups (Assisted / Partial)",
            uniqueName: "planche-pushups",
            sets: 3,
            reps: "3-6",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Generate dynamic strength in planche line (use partial ROM/assistance).",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Chest","Triceps","Core"],
            video: null
          }
        ]
      },

      handstand: {
        name: "Handstand Training",
        notes: "Balance + overhead strength. Short daily skill practice recommended. Frog Hold used as a wrist and balance prep if needed.",
        exercises: [
          {
            id: 1,
            exerciseName: "Frog Hold (Balance Prep)",
            uniqueName: "frog-hold-handstand-prep",
            sets: 2,
            reps: "15-25s",
            pose_analyzer: true,
            difficulty: "Beginner",
            description: "Wrist and balance prep improving shoulder protraction and compression for handstand work.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Wrists","Core","Balance"],
            video: null,
            time: true
          },
          {
            id: 2,
            exerciseName: "Wall Handstand (Shoulder Taps Progression)",
            uniqueName: "wall-handstand",
            sets: 4,
            reps: "30-60s / progress taps",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Shoulder strength + balance practice.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Triceps","Balance"],
            video: null,
            time: true
          },
          {
            id: 3,
            exerciseName: "Hollow Body Hold",
            uniqueName: "hollow-body-hold",
            sets: 4,
            reps: "20-45s",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Core position for handstand and levering skills.",
            primaryMuscle: "Core",
            secondaryMuscles: ["Hip Flexors","Shoulders"],
            video: null,
            time: true
          },
          {
            id: 4,
            exerciseName: "Handstand Push-ups (Wall Assisted → Freestanding)",
            uniqueName: "handstand-pushups",
            sets: 4,
            reps: "3-8",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Vertical pressing strength progression.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Triceps","Upper Chest","Core"],
            video: null
          },
          {
            id: 5,
            exerciseName: "Freestanding Handstand Practice",
            uniqueName: "freestanding-handstand",
            sets: 5,
            reps: "10-30s",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Balance skill progression and proprioception.",
            primaryMuscle: "Shoulders",
            secondaryMuscles: ["Core","Balance"],
            video: null,
            time: true
          }
        ]
      },

      frontLever: {
        name: "Front Lever Track",
        notes: "Train scapular depression, long levers, and straight-body tension. Pair holds with pulling strength sessions.",
        exercises: [
          {
            id: 1,
            exerciseName: "Tuck Front Lever Hold",
            uniqueName: "tuck-front-lever",
            sets: 5,
            reps: "10-20s",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Beginner front lever hold.",
            primaryMuscle: "Lats/Core",
            secondaryMuscles: ["Lower Back","Glutes"],
            video: null,
            time: true
          },
          {
            id: 2,
            exerciseName: "Advanced Tuck / One Leg Front Lever",
            uniqueName: "advanced-tuck-front-lever",
            sets: 5,
            reps: "8-15s",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Increase lever length gradually.",
            primaryMuscle: "Lats/Core",
            secondaryMuscles: ["Lower Back","Glutes"],
            video: null,
            time: true
          }
        ]
      },

      muscleup: {
        name: "Muscle-up Pathway",
        notes: "Combine false grip rows, high pull strength & transition drills. Train explosiveness and transition frequently.",
        exercises: [
          {
            id: 1,
            exerciseName: "False Grip Rows / Pulls",
            uniqueName: "false-grip-rows",
            sets: 4,
            reps: "6-10",
            pose_analyzer: true,
            difficulty: "Intermediate",
            description: "Grip & transition strength for muscle-up.",
            primaryMuscle: "Lats/Biceps",
            secondaryMuscles: ["Forearms","Chest"],
            video: null
          },
          {
            id: 2,
            exerciseName: "Explosive Pull-ups (High Pulls)",
            uniqueName: "explosive-pullups",
            sets: 4,
            reps: "3-6",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Build pulling power and chest-to-bar height.",
            primaryMuscle: "Lats",
            secondaryMuscles: ["Biceps","Chest"],
            video: "/videos/calisthenics/explosive_pullups.mp4"
          },
          {
            id: 3,
            exerciseName: "Muscle-up Transition Drills (Low Rings)",
            uniqueName: "muscleup-transitions",
            sets: 6,
            reps: "3-5",
            pose_analyzer: true,
            difficulty: "Advanced",
            description: "Short, frequent transition practice.",
            primaryMuscle: "Chest/Triceps",
            secondaryMuscles: ["Shoulders","Core"],
            video: null
          }
        ]
      }
    }
  }
};
