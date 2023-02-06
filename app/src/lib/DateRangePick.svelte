<script lang="ts">
    import DatePick from './DatePick.svelte';
    import { DateTime } from 'luxon'
    import { onMount } from "svelte";


    const now = DateTime.local()

    let startDateTime : DateTime | null
    export let startDate : Date | null = null
    //default end date is tomorrow
    let endDateTime : DateTime | null = now.plus({days: 1}).startOf('day');
    export let endDate: Date | null = endDateTime.toJSDate()

    $: {
        if (startDate) {
            startDateTime = DateTime.fromJSDate(startDate)
        } else {
            startDateTime = null
        }
        if (endDate) {
            endDateTime = DateTime.fromJSDate(endDate)
        } else {
            endDateTime = null
        }        
    }

    onMount(() => {
    })

</script>

<DatePick bind:date={startDate}/>
<DatePick bind:date={endDate}/>