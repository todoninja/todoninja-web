import { ref } from 'vue'
import { Task } from './models/Task'

export const focusedTask = ref<string | null>(null)

export const openPopups = []
