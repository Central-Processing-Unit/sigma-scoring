export interface Scores {
  blue: number
  red: number
}

export interface ScoreReport {
  blue: number
  red: number
  blueAuton: number
  redAuton: number
  blueTeleOp: number
  redTeleOp: number
  bluePenaltyFor: number
  redPenaltyFor: number
}

export type JunctionHeight = 'ground' | 'low' | 'medium' | 'high'

export type Cone = 'blue' | 'red' | 'blue beacon' | 'red beacon'

export type TeamColor = 'blue' | 'red'

export type Period = 'autonomous' | 'teleop'

export interface Penalties {
  minor: {
    againstBlue: number
    againstRed: number
  }
  major: {
    againstBlue: number
    againstRed: number
  }
}
