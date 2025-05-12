// This is a simulated database service for the demo
// In a real application, this would connect to a real database

// Types for our data
export interface Challenge {
  id: string
  title: string
  category: string
  subcategory: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  points: number
  timeEstimate: string
  instructions: string
  hints: string[]
  correctAnswer?: string
}

export interface User {
  email: string
  name: string
  completedChallenges: string[]
  totalPoints: number
  rank: string
}

// Demo user
const demoUser: User = {
  email: "demo@space-detective.org",
  name: "Demo Detective",
  completedChallenges: [],
  totalPoints: 0,
  rank: "Cadet Investigator",
}

// Challenge data from the provided list
const challenges: Challenge[] = [
  // Data Extraction & Decoding Challenges
  {
    id: "voyager-signal-decode",
    title: "Voyager Signal Decode",
    category: "Data Extraction & Decoding",
    subcategory: "Signal Processing",
    description:
      "Download voyager_transmission.bin. The file contains binary data encoded in Base64. Decode it to reveal a CSV with deep space signals.",
    difficulty: "Medium",
    points: 150,
    timeEstimate: "25 min",
    instructions:
      "1. Download the binary file\n2. Decode the Base64 encoding\n3. Parse the resulting CSV data\n4. Calculate the average signal strength from signals originating in the Andromeda quadrant",
    hints: [
      "Use a Base64 decoder to convert the binary data to text",
      "The CSV has a column named 'quadrant' to identify signal origins",
      "Filter for 'Andromeda' in the quadrant column before calculating the average",
    ],
    correctAnswer: "42.47",
  },
  {
    id: "pulsar-timing-extraction",
    title: "Pulsar Timing Extraction",
    category: "Data Extraction & Decoding",
    subcategory: "Astronomical Data",
    description:
      "The file pulsar_data.zip contains hidden text files with pulsar timing data. Extract all files and find the pulsar with the most consistent period.",
    difficulty: "Hard",
    points: 200,
    timeEstimate: "30 min",
    instructions:
      "1. Extract the zip file\n2. Analyze the timing data for each pulsar\n3. Calculate the standard deviation of periods for each pulsar\n4. Identify the pulsar with the lowest standard deviation",
    hints: [
      "The standard deviation measures how consistent the pulsar periods are",
      "Some files may be hidden within subdirectories",
      "Convert all timing data to the same unit before calculating",
    ],
    correctAnswer: "PSR J0437-4715",
  },

  // Data Transformation & Cleaning Challenges
  {
    id: "stellar-classification",
    title: "Stellar Classification Standardization",
    category: "Data Transformation & Cleaning",
    subcategory: "Data Cleaning",
    description:
      "In star_catalog_messy.csv, stellar classifications follow inconsistent formats. Create a regex to standardize all stellar classifications.",
    difficulty: "Medium",
    points: 175,
    timeEstimate: "25 min",
    instructions:
      "1. Load the star catalog data\n2. Create a regular expression to identify all stellar classification formats\n3. Standardize them to the format [A-O][0-9]-(I-V)\n4. Count the number of O-type stars after standardization",
    hints: [
      "Look for patterns like 'O5-III', 'O 5 III', 'O5III' that all represent the same classification",
      "The first letter represents the spectral type (O being the hottest)",
      "The Roman numeral represents the luminosity class",
    ],
    correctAnswer: "27",
  },
  {
    id: "exomoon-orbit",
    title: "Exomoon Orbit Normalization",
    category: "Data Transformation & Cleaning",
    subcategory: "Unit Conversion",
    description:
      "The file exomoon_orbits.json contains orbital periods in different units (days, hours, minutes). Convert all to seconds and find the moon with the orbital resonance closest to 1:3 with its planet.",
    difficulty: "Hard",
    points: 225,
    timeEstimate: "35 min",
    instructions:
      "1. Parse the JSON file containing exomoon data\n2. Convert all orbital periods to seconds\n3. Calculate the orbital resonance ratio between each moon and its planet\n4. Find the moon with a ratio closest to 1:3",
    hints: [
      "Orbital resonance is the ratio of orbital periods (planet:moon)",
      "Convert days to seconds by multiplying by 86400",
      "Convert hours to seconds by multiplying by 3600",
    ],
    correctAnswer: "Kepler-1625b-I",
  },

  // API & Web Scraping Challenges
  {
    id: "galactic-survey-api",
    title: "Galactic Survey API Integration",
    category: "API & Web Scraping",
    subcategory: "API Integration",
    description: "Connect to the Galactic Survey API and retrieve all neutron stars within 100 light-years of Earth.",
    difficulty: "Medium",
    points: 150,
    timeEstimate: "20 min",
    instructions:
      "1. Connect to the Galactic Survey API at https://api.galacticsurvey.io/v2/\n2. Use the API key 'EXPLORER-2023'\n3. Query for neutron stars with the parameter 'distance_lt=100'\n4. Calculate the average spin rate of the returned neutron stars",
    hints: [
      "The API returns JSON data with a 'spin_rate' field for each neutron star",
      "Make sure to handle pagination if there are many results",
      "The spin rate is measured in rotations per second",
    ],
    correctAnswer: "327.89",
  },
  {
    id: "exobiology-scraping",
    title: "Exobiology Database Scraping",
    category: "API & Web Scraping",
    subcategory: "Web Scraping",
    description:
      "The webpage at https://exobiology.space/catalog.html contains a table of planets with potential biosignatures. Scrape this table and analyze the results.",
    difficulty: "Hard",
    points: 200,
    timeEstimate: "30 min",
    instructions:
      "1. Scrape the table from the exobiology catalog webpage\n2. Parse the HTML to extract planet data\n3. Count how many planets show both methane AND oxygen signatures together",
    hints: [
      "Look for columns labeled 'Atmospheric Composition' or 'Biosignatures'",
      "You may need to handle special characters in the HTML",
      "Some entries might list multiple gases separated by commas",
    ],
    correctAnswer: "14",
  },

  // Statistical Analysis & Calculations
  {
    id: "stellar-population",
    title: "Stellar Population Quartiles",
    category: "Statistical Analysis & Calculations",
    subcategory: "Statistical Analysis",
    description:
      "In galaxy_cluster.csv, calculate the interquartile range (IQR) of star masses for each spectral type.",
    difficulty: "Hard",
    points: 250,
    timeEstimate: "40 min",
    instructions:
      "1. Load the galaxy cluster data\n2. Group stars by spectral type\n3. Calculate the interquartile range (IQR) for each type\n4. Divide the IQR by the median to find the relative IQR\n5. Identify which spectral type has the largest relative IQR",
    hints: [
      "The IQR is the difference between the 75th and 25th percentiles",
      "Remember to normalize by dividing by the median to get a fair comparison",
      "Some spectral types may have outliers that affect the results",
    ],
    correctAnswer: "Type B",
  },
  {
    id: "exoplanet-transit",
    title: "Exoplanet Transit Depth Analysis",
    category: "Statistical Analysis & Calculations",
    subcategory: "Anomaly Detection",
    description:
      "The file transit_data.csv contains transit depth measurements for exoplanets. Calculate the z-score for each measurement and identify outliers.",
    difficulty: "Medium",
    points: 175,
    timeEstimate: "25 min",
    instructions:
      "1. Load the transit depth data\n2. Calculate the mean and standard deviation of all transit depths\n3. Compute the z-score for each measurement\n4. Identify planets with z-scores > 2.5\n5. Find which of these planets has the highest transit depth",
    hints: [
      "The z-score is calculated as (value - mean) / standard deviation",
      "A z-score > 2.5 indicates a value that's significantly different from the average",
      "Transit depth is related to the planet's size relative to its star",
    ],
    correctAnswer: "WASP-12b",
  },

  // Image & Signal Processing
  {
    id: "alien-technosignature",
    title: "Alien Technosignature Detection",
    category: "Image & Signal Processing",
    subcategory: "Signal Analysis",
    description:
      "The file radio_signals.wav contains potential technosignatures mixed with noise. Apply signal processing techniques to identify unusual patterns.",
    difficulty: "Expert",
    points: 300,
    timeEstimate: "45 min",
    instructions:
      "1. Load the audio file\n2. Apply a bandpass filter between 1400-1420 MHz (the 'water hole' frequency range)\n3. Perform spectral analysis to identify distinct signals\n4. Find the signal with the highest power spectral density\n5. Determine its exact frequency",
    hints: [
      "The 'water hole' is a frequency range where SETI researchers often look for signals",
      "Use a Fast Fourier Transform (FFT) to convert from the time domain to the frequency domain",
      "Look for signals that have non-random patterns",
    ],
    correctAnswer: "1420.405 MHz",
  },
  {
    id: "exoplanet-spectrum",
    title: "Exoplanet Atmospheric Spectrum",
    category: "Image & Signal Processing",
    subcategory: "Spectral Analysis",
    description:
      "Download planet_spectrum.fits. Using any FITS file library, extract the spectrum data and identify absorption lines.",
    difficulty: "Hard",
    points: 275,
    timeEstimate: "40 min",
    instructions:
      "1. Load the FITS file containing the exoplanet spectrum\n2. Extract the wavelength and flux data\n3. Identify absorption lines (dips in the spectrum)\n4. Match these against known atmospheric gas signatures\n5. Determine which gas has the strongest absorption feature",
    hints: [
      "FITS is a common format for astronomical data",
      "Absorption lines appear as dips in the spectrum at specific wavelengths",
      "Common atmospheric gases include water, methane, carbon dioxide, and ammonia",
    ],
    correctAnswer: "Methane",
  },

  // Time Series Analysis
  {
    id: "variable-star",
    title: "Variable Star Period Detection",
    category: "Time Series Analysis",
    subcategory: "Period Detection",
    description:
      "The file variable_star_luminosity.csv contains brightness measurements over time. Use a Lomb-Scargle periodogram to identify the dominant periodicity of each star.",
    difficulty: "Hard",
    points: 250,
    timeEstimate: "35 min",
    instructions:
      "1. Load the variable star data\n2. For each star, create a time series of brightness measurements\n3. Apply a Lomb-Scargle periodogram to identify periodic signals\n4. Find which star has a period closest to 3.14 days",
    hints: [
      "The Lomb-Scargle periodogram works well for unevenly sampled data",
      "Look for the highest peak in the periodogram to find the dominant period",
      "Convert all time measurements to the same unit before analysis",
    ],
    correctAnswer: "RR Lyrae V42",
  },
  {
    id: "pulsar-glitch",
    title: "Pulsar Glitch Identification",
    category: "Time Series Analysis",
    subcategory: "Anomaly Detection",
    description: "In pulsar_timing.csv, identify timing glitches (sudden period changes > 0.1%).",
    difficulty: "Expert",
    points: 300,
    timeEstimate: "50 min",
    instructions:
      "1. Load the pulsar timing data\n2. Calculate the period between consecutive pulses\n3. Identify sudden changes in period greater than 0.1%\n4. Count how many glitches occurred\n5. Find the largest percentage change",
    hints: [
      "Pulsar glitches are sudden speedups in rotation rate",
      "Calculate the percentage change as (new_period - old_period) / old_period * 100",
      "You may need to smooth the data to reduce false positives from measurement noise",
    ],
    correctAnswer: "7 glitches, 0.32%",
  },

  // Data Visualization
  {
    id: "galactic-habitable",
    title: "Galactic Habitable Zone Mapping",
    category: "Data Visualization",
    subcategory: "Spatial Visualization",
    description:
      "Using milky_way_stars.csv, create a visualization of our galaxy's habitable zone (regions 7-9 kpc from center with metallicity between 0.7-1.5 solar).",
    difficulty: "Medium",
    points: 200,
    timeEstimate: "30 min",
    instructions:
      "1. Load the Milky Way star data\n2. Filter for stars in the habitable zone (7-9 kpc from center with metallicity 0.7-1.5 solar)\n3. Create a visualization showing the distribution of these stars\n4. Calculate what percentage of all stars fall within this zone",
    hints: [
      "The galactic habitable zone is the region where conditions are suitable for complex life",
      "Distance from the galactic center is typically measured in kiloparsecs (kpc)",
      "Metallicity is expressed relative to the Sun's composition",
    ],
    correctAnswer: "8.2%",
  },
  {
    id: "interstellar-network",
    title: "Interstellar Travel Network",
    category: "Data Visualization",
    subcategory: "Network Analysis",
    description:
      "The file stellar_network.csv contains potential interstellar travel routes. Create a network graph and analyze the most efficient paths.",
    difficulty: "Hard",
    points: 225,
    timeEstimate: "35 min",
    instructions:
      "1. Load the stellar network data\n2. Create a graph where nodes are stars and edges are possible routes\n3. Apply a pathfinding algorithm to find the shortest path from Sol to Sirius\n4. Determine the minimum number of jumps needed using only routes < 5 light-years",
    hints: [
      "This is a classic graph theory problem",
      "Dijkstra's algorithm or A* can find the shortest path",
      "Some routes may not be bidirectional",
    ],
    correctAnswer: "3 jumps",
  },

  // File Format Handling
  {
    id: "multi-format-catalog",
    title: "Multi-Format Stellar Catalog Integration",
    category: "File Format Handling",
    subcategory: "Data Integration",
    description:
      "Combine data from stars.csv, stellar_properties.json, and spectral_types.xml into a single dataset using the common 'star_id' field.",
    difficulty: "Medium",
    points: 175,
    timeEstimate: "25 min",
    instructions:
      "1. Load data from the three different file formats\n2. Join the datasets using the common star_id field\n3. Analyze the combined data to find stars with high metal content but low absolute magnitude\n4. Identify which star has the highest metal content but lowest absolute magnitude",
    hints: [
      "Each file format requires different parsing methods",
      "Metal content is typically expressed as [Fe/H] in astronomy",
      "Lower absolute magnitude means a brighter star",
    ],
    correctAnswer: "HD 195019",
  },
  {
    id: "hierarchical-fits",
    title: "Hierarchical FITS Headers",
    category: "File Format Handling",
    subcategory: "Metadata Extraction",
    description:
      "The FITS files in telescope_observations.zip contain hierarchical headers. Extract all metadata and create a searchable database.",
    difficulty: "Hard",
    points: 250,
    timeEstimate: "40 min",
    instructions:
      "1. Extract the zip file containing FITS observations\n2. Parse the hierarchical headers from each FITS file\n3. Create a searchable database of the metadata\n4. Query the database to find which observation used the longest exposure time",
    hints: [
      "FITS headers contain key-value pairs with observation metadata",
      "The EXPTIME keyword typically contains the exposure time",
      "Hierarchical headers may have sections with their own sets of keywords",
    ],
    correctAnswer: "NGC1333-IRAS4",
  },

  // Encryption & Decoding
  {
    id: "alien-artifact",
    title: "Ancient Alien Artifact Decoding",
    category: "Encryption & Decoding",
    subcategory: "Cryptography",
    description:
      "The file artifact_symbols.bin contains symbols encoded with a substitution cipher. The key is the first 26 decimal digits of π.",
    difficulty: "Expert",
    points: 350,
    timeEstimate: "60 min",
    instructions:
      "1. Extract the encoded symbols from the binary file\n2. Create a substitution key using the first 26 decimal digits of π\n3. Apply the substitution cipher to decode the message\n4. Identify which star system is mentioned in the decoded message",
    hints: [
      "The first 26 digits of π are 3.1415926535897932384626433",
      "In a substitution cipher, each symbol is replaced with another according to a fixed system",
      "The decoded message contains coordinates and a star system name",
    ],
    correctAnswer: "TRAPPIST-1",
  },
  {
    id: "interstellar-message",
    title: "Interstellar Message Authentication",
    category: "Encryption & Decoding",
    subcategory: "Digital Signatures",
    description:
      "The file contact_message.txt is signed with an RSA digital signature in signature.bin. Verify the signature using the public key in et_public.pem.",
    difficulty: "Hard",
    points: 300,
    timeEstimate: "45 min",
    instructions:
      "1. Load the message file and the signature file\n2. Use the provided public key to verify the signature\n3. Determine if the message is authentic\n4. If authentic, identify the prime number mentioned in the message",
    hints: [
      "RSA verification involves checking if the decrypted signature matches a hash of the message",
      "The public key file is in PEM format, which is a common format for cryptographic keys",
      "The message may contain mathematical content including prime numbers",
    ],
    correctAnswer: "11927",
  },
]

// Simulated database functions
export const DatabaseService = {
  // Authentication
  login: async (email: string, password: string): Promise<User | null> => {
    // For demo purposes, accept any email/password with specific domains
    const validDomains = ["nasa.gov", "esa.int", "isro.gov.in", "space-detective.org"]
    const emailDomain = email.split("@")[1]

    if (validDomains.includes(emailDomain) && password.length >= 6) {
      // For demo, always return the demo user
      return demoUser
    }

    return null
  },

  // Demo login - no password required
  demoLogin: async (): Promise<User> => {
    return demoUser
  },

  // Get all challenges
  getChallenges: async (): Promise<Challenge[]> => {
    return challenges
  },

  // Get challenges by category
  getChallengesByCategory: async (category: string): Promise<Challenge[]> => {
    return challenges.filter((c) => c.category === category)
  },

  // Get challenge by ID
  getChallenge: async (id: string): Promise<Challenge | null> => {
    return challenges.find((c) => c.id === id) || null
  },

  // Update user's completed challenges
  updateCompletedChallenges: async (userId: string, completedChallenges: string[]): Promise<User> => {
    // Calculate total points
    const totalPoints = completedChallenges.reduce((total, challengeId) => {
      const challenge = challenges.find((c) => c.id === challengeId)
      return total + (challenge?.points || 0)
    }, 0)

    // Determine rank based on points
    let rank = "Cadet Investigator"
    if (totalPoints >= 2000) rank = "Cosmic Detective Master"
    else if (totalPoints >= 1500) rank = "Senior Space Investigator"
    else if (totalPoints >= 1000) rank = "Interstellar Detective"
    else if (totalPoints >= 500) rank = "Space Crime Analyst"
    else if (totalPoints >= 200) rank = "Junior Space Detective"

    // Update demo user (in a real app, this would update the database)
    demoUser.completedChallenges = completedChallenges
    demoUser.totalPoints = totalPoints
    demoUser.rank = rank

    return demoUser
  },

  // Submit a challenge answer
  submitChallengeAnswer: async (challengeId: string, answer: string): Promise<boolean> => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge || !challenge.correctAnswer) return false

    // Simple string comparison (in a real app, this might be more sophisticated)
    return answer.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase()
  },
}
