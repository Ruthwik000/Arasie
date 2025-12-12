// Stretching & Yoga Programs
export const stretchingPrograms = {
  daily_movement: {
    name: "Daily Movement & Mobility",
    description: "Essential daily mobility and stretching routine",
    duration: "15-20 mins",
    type: "Mobility & Flexibility",
    exercises: [
      { id: 'neck-circles', name: 'Neck Mobility Circles', duration: '20s', pose_analyzer: false },
      { id: 'shoulder-rolls', name: 'Shoulder Rolls', duration: '40s', pose_analyzer: false },
      { id: 'arm-circles', name: 'Arm Circles (Small to Large)', duration: '30s', pose_analyzer: false },
      { id: 'spine-wave', name: 'Spinal Wave Mobility (Cat-Camel Motion)', duration: '10 reps', pose_analyzer: false },
      { id: 'thoracic-rotation', name: 'Thoracic Rotation Reach', duration: '10 reps each', pose_analyzer: false },
      { id: 'hip-cars', name: 'Hip CARs', duration: '5 slow circles each', pose_analyzer: false },
      { id: 'leg-swings-front', name: 'Leg Swings Front/Back', duration: '15 each leg', pose_analyzer: false },
      { id: 'leg-swings-side', name: 'Leg Swings Side-to-Side', duration: '15 each leg', pose_analyzer: false },
      { id: 'standing-quad', name: 'Standing Quad Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'kneeling-hip-flexor', name: 'Kneeling Hip Flexor Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'hamstring-single', name: 'Single Leg Hamstring Stretch', duration: '40s each', pose_analyzer: false },
      { id: 'calf-wall', name: 'Calf Wall Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'adductor-side-lunge', name: 'Side Lunge Inner Thigh Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'seated-twist', name: 'Seated Spinal Twist', duration: '25s each', pose_analyzer: false },
      { id: 'doorway-chest', name: 'Chest Doorway Stretch', duration: '40s', pose_analyzer: false }
    ]
  },
  pre_workout: {
    name: "Pre-Workout Dynamic Warm-up",
    description: "Dynamic stretches to prepare for exercise",
    duration: "8-10 mins",
    type: "Dynamic Warm-up",
    exercises: [
      { id: 'marching-knee-hugs', name: 'Marching Knee Hugs', duration: '20s', pose_analyzer: false },
      { id: 'butt-kicks', name: 'Butt Kicks', duration: '20s', pose_analyzer: false },
      { id: 'leg-swings-dynamic-front', name: 'Dynamic Leg Swings (Front)', duration: '15 each', pose_analyzer: false },
      { id: 'leg-swings-dynamic-side', name: 'Dynamic Leg Swings (Side)', duration: '15 each', pose_analyzer: false },
      { id: 'wgs', name: "World's Greatest Stretch", duration: '5 reps each', pose_analyzer: false },
      { id: 'inchworm', name: 'Inchworm Walkouts', duration: '5 reps', pose_analyzer: false },
      { id: 'dynamic-lunge-twist', name: 'Dynamic Lunge with Twist', duration: '10 steps each', pose_analyzer: false },
      { id: 'arm-swings-cross', name: 'Cross-Body Arm Swings', duration: '20s', pose_analyzer: false },
      { id: 'ankle-circles', name: 'Ankle Circles', duration: '20s each', pose_analyzer: false },
      { id: 'hip-openers', name: 'Hip Open/Close Circles', duration: '10 each leg', pose_analyzer: false }
    ]
  },
  post_workout: {
    name: "Post-Workout Static Stretching",
    description: "Cool down and recovery stretches",
    duration: "10-12 mins",
    type: "Static Stretching",
    exercises: [
      { id: 'hamstring-stretch', name: 'Hamstring Stretch (Seated or Standing)', duration: '45s each', pose_analyzer: false },
      { id: 'quad-stretch', name: 'Quad Stretch', duration: '40s each', pose_analyzer: false },
      { id: 'hip-flexor-stretch', name: 'Hip Flexor Stretch', duration: '40s each', pose_analyzer: false },
      { id: 'figure-4', name: 'Figure-4 Glute Stretch', duration: '45s each', pose_analyzer: false },
      { id: 'forward-fold', name: 'Seated Forward Fold (Non-yoga)', duration: '45s', pose_analyzer: false },
      { id: 'calf-stretch', name: 'Calf Stretch (Wall)', duration: '30s each', pose_analyzer: false },
      { id: 'inner-thigh-stretch', name: 'Inner Thigh Wide-Seated Stretch', duration: '40s', pose_analyzer: false },
      { id: 'doorway-chest-post', name: 'Doorway Chest Stretch', duration: '40s', pose_analyzer: false },
      { id: 'upper-back-stretch', name: 'Cross-Arm Upper Back Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'triceps-stretch', name: 'Overhead Triceps Stretch', duration: '30s each', pose_analyzer: false },
      { id: 'neck-side-stretch', name: 'Neck Side Stretch', duration: '20s each', pose_analyzer: false },
      { id: 'lower-back-lean', name: 'Lower Back Lean Stretch', duration: '20s', pose_analyzer: false }
    ]
  }
};

export const yogaPrograms = {
  beginner_yoga: {
    name: "Beginner Yoga Flow",
    description: "Foundational yoga poses for beginners",
    duration: "20-25 mins",
    type: "Beginner Yoga",
    exercises: [
      { id: 'tadasana', name: 'Tadasana (Mountain Pose)', duration: '30s', pose_analyzer: false },
      { id: 'vrikshasana', name: 'Vrikshasana (Tree Pose)', duration: '30s each', pose_analyzer: false },
      { id: 'trikonasana', name: 'Trikonasana (Triangle Pose)', duration: '30s each', pose_analyzer: false },
      { id: 'utkatasana', name: 'Utkatasana (Chair Pose)', duration: '30s', pose_analyzer: false },
      { id: 'bhujangasana', name: 'Bhujangasana (Cobra Pose)', duration: '30s', pose_analyzer: false },
      { id: 'setu-bandhasana', name: 'Setu Bandhasana (Bridge Pose)', duration: '40s', pose_analyzer: false },
      { id: 'paschimottanasana', name: 'Paschimottanasana (Forward Fold)', duration: '45s', pose_analyzer: false },
      { id: 'cat-cow', name: 'Marjaryasana–Bitilasana (Cat–Cow)', duration: '10 reps', pose_analyzer: false },
      { id: 'downward-dog', name: 'Adho Mukha Svanasana (Downward Dog)', duration: '60s', pose_analyzer: false },
      { id: 'child-pose', name: "Balasana (Child's Pose)", duration: '60s', pose_analyzer: false },
      { id: 'warrior-1', name: 'Virabhadrasana I (Warrior Pose I)', duration: '30s each', pose_analyzer: false },
      { id: 'warrior-2', name: 'Virabhadrasana II (Warrior Pose II)', duration: '30s each', pose_analyzer: false },
      { id: 'easy-pose', name: 'Sukhasana (Easy Pose Breathing)', duration: '1 min', pose_analyzer: false },
      { id: 'pawanmuktasana', name: 'Pavanamuktasana (Wind Relieving)', duration: '30s each', pose_analyzer: false },
      { id: 'shavasana', name: 'Shavasana (Relaxation Pose)', duration: '2 min', pose_analyzer: false }
    ]
  },
  morning: {
    name: "Morning Energizer",
    description: "Wake up your body",
    duration: "10-15 mins",
    type: "Energy",
    sequence: [
      { pose: "Sun Salutation A", duration: "3 rounds", description: "Full body warm-up" },
      { pose: "Warrior I", duration: "30s each", description: "Hip opener and strength" },
      { pose: "Triangle Pose", duration: "30s each", description: "Side body stretch" },
      { pose: "Tree Pose", duration: "30s each", description: "Balance and focus" }
    ]
  },
  sleepYoga: {
    name: "Sleep Yoga",
    description: "Calming bedtime routine",
    duration: "15-20 mins",
    type: "Restorative",
    sequence: [
      { pose: "Legs Up Wall", duration: "3 mins", description: "Circulation and calm" },
      { pose: "Supine Twist", duration: "1 min each", description: "Gentle spinal release" },
      { pose: "Happy Baby", duration: "1 min", description: "Hip release" },
      { pose: "Corpse Pose", duration: "5-10 mins", description: "Deep relaxation" }
    ]
  }
};
