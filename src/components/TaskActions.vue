<template>
    <HorizontalScrolling class="items-center">
        <DatePickerDialog
            @input="(datetime, close) => task.update({ postponedUntil: datetime }).then(() => close())"
            :value="task.postponedUntil"
        >
            <template v-slot="{ open }">
                <Chip
                    :type="task.postponedUntil ? 'input' : 'assist'"
                    @click="open"
                    icon="chevron-double-right"
                    :removable="task.postponedUntil != null"
                    @remove="task.update({ postponedUntil: undefined })"
                >
                    <template v-if="task.postponedUntil">
                        Postponed until
                        {{
                            task.postponedUntil.toLocaleString({
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                            })
                        }}
                    </template>
                    <template v-else>Postpone</template>
                </Chip>
            </template>
        </DatePickerDialog>
    </HorizontalScrolling>
</template>

<script lang="ts" setup>
import { Task } from '../models/Task'
import HorizontalScrolling from './HorizontalScrolling.vue'
import Chip from './Chip.vue'
import DatePickerDialog from './DatePickerDialog.vue'

defineProps<{ task: Task }>()
</script>
