<script lang="ts">
    import DateRangePick from "./DateRangePick.svelte";
    import { DateTime, Interval, Duration } from "luxon";
    import { onMount } from "svelte";
    import Api from "./Api";
    import { LayerCake, Svg } from "layercake";
    import { timeDay } from "d3-time";
    import { scaleBand, scaleTime } from "d3-scale";
    import ScatterSvg from "./layercake/Scatter.svg.svelte";
    import AxisX from "./layercake/AxisX.svelte";
    import AxisY from "./layercake/AxisY.svelte";
    import Day from "./Day";

    let startDate: Date | null;
    let endDate: Date | null;
    let interval: Interval | null;
    let daysPromise: Promise<Day[]> = Promise.resolve([]);

    /** used to split the interval later */
    const oneDay = Duration.fromObject({ days: 1 });

    $: {
        if (startDate && endDate) {
            interval = Interval.fromDateTimes(
                DateTime.fromJSDate(startDate).toLocal(),
                DateTime.fromJSDate(endDate).toLocal()
            );
        } else {
            interval = null;
        }
    }
    $: {
        if (interval) {
            const bgReadings = Api.bgreadings(
                interval.start.toJSDate(),
                interval.end.toJSDate()
            );
            const bloodTests = Api.bloodtests(
                interval.start.toJSDate(),
                interval.end.toJSDate()
            );
            const treatments = Api.treatments(
                interval.start.toJSDate(),
                interval.end.toJSDate()
            );

            // split interval into days and map api results to `Day[]`
            const intervals = interval.splitBy(oneDay);
            daysPromise = Promise.all([
                bgReadings,
                bloodTests,
                treatments,
            ]).then((value: [BgReadings, BloodTests, Treatments]) => {
                return intervals.map(
                    (interval) =>
                        new Day(interval, {
                            bgReadings: value[0],
                            bloodTests: value[1],
                            treatments: value[2],
                        })
                );
            });
        } else {
            daysPromise = Promise.resolve([]);
        }
    }
</script>

<DateRangePick bind:startDate bind:endDate />

{#await daysPromise}
    {#if interval}
        <p>Loading data...</p>
    {/if}
{:then days}
    {#each days as day (day.interval.start.toUnixInteger())}
        <h3>
            {day.interval.start.toRFC2822()} - {day.interval.end.toRFC2822()}
        </h3>
        {#if day.hasData()}
            <div class="chart-container">
                <LayerCake
                    xDomain={[0, 24 * 60 * 60]}
                    yDomain={[25, 350]}
                    xScale={scaleTime()}
                    data={day.data.bgReadings.items}
                    x={(bgreading) =>
                        Math.round(
                            day.diffFromStart(bgreading.timestamp) / 1000
                        )}
                    y={(bgreading) => bgreading.filtered_calculated_value}
                >
                    
                    <Svg>
                        <AxisX
                        ticks={[0, 4, 8, 12, 16, 20, 24].map(
                            (d) => d * 60 * 60
                        )}
                        formatTick={(d) => `${Math.floor(d / 60 / 60)}:00`}
                    />
                    <AxisY ticks={[50, 100, 150, 200, 250, 300, 350]}/>
                        <!-- You can expose properties on your chart components to make them more reusable -->
                        <ScatterSvg fill={"blue"} r={2} />
                    </Svg>
                </LayerCake>
            </div>
        {:else}
            <p>No Data</p>
        {/if}
    {/each}
{:catch error}
    {#if error}
        <p style="color: red">{error}</p>
    {/if}
{/await}

<style lang="scss">
    /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
    .chart-container {
        width: 100%;
        height: 300px;

        @media print {
            height: 8cm;
        }
    }
</style>
