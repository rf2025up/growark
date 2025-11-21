import { Student, Challenge, PKMatch, Badge, Habit, Task } from '../types'
import { MOCK_STUDENTS, MOCK_CHALLENGES, MOCK_PK, MOCK_BADGES, MOCK_HABITS, MOCK_TASKS } from './mockData'

export const getStudents = (): Student[] => [...MOCK_STUDENTS]
export const getClasses = (): string[] => ['三年一班', '三年二班', '三年三班']
export const getTasks = (): Task[] => [...MOCK_TASKS]
export const getChallenges = (): Challenge[] => [...MOCK_CHALLENGES]
export const getPKs = (): PKMatch[] => [...MOCK_PK]
export const getBadges = (): Badge[] => [...MOCK_BADGES]
export const getHabits = (): Habit[] => [...MOCK_HABITS]
export const getTeacherClass = (): string => '三年一班'
export const getIdentity = (): 'teacher' | 'principal' => 'teacher'