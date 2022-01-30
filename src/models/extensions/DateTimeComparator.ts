import { Comparator } from '@opaquejs/query-engine/lib/Comparator'
import { DateTime } from 'luxon'
import { Comparators } from '@opaquejs/query-engine/lib/contracts/Comparator'

export class DateTimeComparator extends Comparator {
    parseDate(value: unknown) {
        if (DateTime.isDateTime(value)) {
            return value
        }
        if (this.isEmpty(value)) {
            return value
        }
        if (typeof value != 'string') {
            throw new Error(
                `A date value must be given as a string, received value [${value}] with type [${typeof value}] in date comparison`
            )
        }
        return DateTime.fromISO(value)
    }

    compare(left: unknown, comparison: Comparators, right: unknown) {
        return super.compare(this.parseDate(left), comparison, this.parseDate(right))
    }

    public '=='(left: DateTime, right: DateTime) {
        return left.equals(right)
    }
}
