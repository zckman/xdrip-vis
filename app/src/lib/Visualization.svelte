<script lang="ts">
    import DateRangePick from "./DateRangePick.svelte";
    import { DateTime, Interval, Duration } from 'luxon'
    import { onMount } from "svelte";
    import Api from './Api';

    let startDate: Date | null
    let endDate: Date | null
    let interval: Interval | null
    let days: Interval[] = []

    const oneDay = Duration.fromObject({days: 1})

    $: {
        if (startDate && endDate) {
            interval = Interval.fromDateTimes(DateTime.fromJSDate(startDate).toLocal(), DateTime.fromJSDate(endDate).toLocal())
        } else {
            interval = null
        }
        console.log(interval);
        
    }
    $: {
        if (interval) {
            days = interval.splitBy(oneDay)
        } else {
            days = []
        }
        console.log(days);
        
    }
</script>

<DateRangePick bind:startDate bind:endDate />

<ul>
{#each days as day (day.start.toUnixInteger())}
    <li>{day.start.toRFC2822()} - {day.end.toRFC2822()}</li>
{/each}
</ul>