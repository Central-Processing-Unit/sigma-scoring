import { configureStore } from '@reduxjs/toolkit'
import fieldSlice from './fieldSlice'

const store = configureStore({
  reducer: {
    field: fieldSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
