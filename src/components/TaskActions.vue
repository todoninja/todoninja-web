<template>
    <HorizontalScrolling class="items-center">
        <Popup :id="`task-detail-${task.id}-postpone-picker`">
            <template #trigger="{ open }">
                <Tag
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
                </Tag>
            </template>
            <template #content="{ close }">
                <lit-datetime-picker-calendar
                    startOfWeek="1"
                    @input="
                        task.update({
                            postponedUntil: DateTime.fromJSDate($event.detail),
                        }).then(() => close())
                    "
                    :value="task.postponedUntil?.toJSDate()"
                ></lit-datetime-picker-calendar>
            </template>
        </Popup>
    </HorizontalScrolling>
</template>

<script lang="ts" setup>
import { Task } from '../models/Task'
import { DateTime } from 'luxon'
import HorizontalScrolling from './HorizontalScrolling.vue'
import Popup from './Popup.vue'
import Tag from './Tag.vue'

defineProps<{ task: Task }>()
</script>
