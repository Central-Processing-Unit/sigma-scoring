import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface FieldState {
  cones: string[][]
}

interface ConeData {
  row: number
  column: number
  type: string
}

const initialState = {
  cones: [['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']]
} as FieldState

export const fieldSlice = createSlice({
  name: 'field',
  initialState,
  reducers: {
    addCone: (state, action: PayloadAction<ConeData>) => {
      let newCones = [...state.cones]
      newCones[action.payload.row][action.payload.column] = action.payload.type
      return {
        cones: newCones
      }
    }
  }
})

export const {
  addCone,
} = fieldSlice.actions

export default fieldSlice.reducer

