import { DateTime, type Interval } from "luxon";


export default class IntervalData {

    interval: Interval
    data: ApiResults

    constructor(interval: Interval, data: ApiResults) {
        this.interval = interval
        const filterByTimestamp =
            item => {
                const timestamp = Object.hasOwn(item, "created_timestamp")
                    ? item.created_timestamp
                    : item.timestamp
                    
                return interval.contains(DateTime.fromMillis(timestamp)) && timestamp != interval.end.toMillis()
            }
        this.data = {
            bgReadings: { items: data.bgReadings.items.filter(filterByTimestamp) },
            bloodTests: { items: data.bloodTests.items.filter(filterByTimestamp) },
            treatments: { items: data.treatments.items.filter(filterByTimestamp) },
        }
    }

    hasBgReadings = () => this.data.bgReadings.items.length != 0
    hasBloodTests = () => this.data.bloodTests.items.length != 0
    hasTreatments = () => this.data.treatments.items.length != 0

    hasData = () => this.hasBgReadings() || this.hasBloodTests() || this.hasTreatments()

    /**
     * 
     * @param dt a Date, a luxon DateTime or a unix timestamp 
     */
    public diffFromStart(dt: Date): number
    public diffFromStart(dt: DateTime): number
    public diffFromStart(dt: number): number
    public diffFromStart(dt: Date | DateTime | number): number {
        if (dt instanceof Date) {
            dt = DateTime.fromJSDate(dt)
        }
        if (typeof dt === 'number') {
            dt = DateTime.fromMillis(dt)
        }
        return dt.diff(this.interval.start).toMillis()
    }

}