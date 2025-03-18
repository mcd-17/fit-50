import { deleteWorkout, getUserWorkoutList, getWorkoutDetails, getWorkoutList, postWorkout, updateWorkout } from "../../controllers/workout.controller";
import { Router } from "express";
import { isTrainer, isUser } from "../../middlewares/auth.middleware";


const workoutRoutes = Router()

workoutRoutes.get('/list', isTrainer, getWorkoutList)
workoutRoutes.post('', isTrainer, postWorkout)
workoutRoutes.get('/details', isTrainer, getWorkoutDetails)
workoutRoutes.post('/update', isTrainer, updateWorkout)
workoutRoutes.delete('/delete', isTrainer, deleteWorkout)

workoutRoutes.get('/users', isUser, getUserWorkoutList)

export default workoutRoutes