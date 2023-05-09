<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
  import { getContext } from "svelte";

  const { data, xScale, yScale } = getContext("LayerCake");

  /** @type {String} [stroke='#000'] – The circle's stroke color. */
  export let stroke = "#000";

  /** @type {Number} [strokeWidth=0] – The circle's stroke width. */
  export let strokeWidth = 0;

  let day = $data;
  let bgReadings = day.data.bgReadings.items;
  let bloodTests = day.data.bloodTests.items;
  let treatments = day.data.treatments.items;
  let carbs = treatments.filter(t => t.carbs > 0);
  let insulin = treatments.filter(t => t.insulin > 0).map(t => {
    const insulinData = JSON.parse(t.insulinJSON)
    // calculate amounts per type, for now just the two types that I selected in xdrip
    let bolus = 0, basal = 0, other = 0
    insulinData.forEach(i => {
      switch (i.insulin) {
      case "Novorapid":
        bolus += i.units
        break;
      case "Insulatard":
        basal += i.units
        break;
      default:
        other += i.units
        break;
      }
    })
    return { ...t, byType: {bolus, basal, other} }
  });
  let bolus = insulin.filter(i => i.byType.bolus > 0)
  let basal = insulin.filter(i => i.byType.basal > 0)
  let other = insulin.filter(i => i.byType.other > 0)

  const xGet = (item) =>
    $xScale(
      Math.round(
        day.diffFromStart(
          Object.hasOwn(item, "created_timestamp")
            ? item.created_timestamp
            : item.timestamp
        ) / 1000
      )
    );
  const yGet = (item) => $yScale(item);
</script>

<g class="scatter-group">
  {#each bgReadings as b}
    <circle
      cx={xGet(b) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      cy={yGet(b.filtered_calculated_value > 0 ? b.filtered_calculated_value : b.calculated_value) +
        ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      r="2"
      fill="orange"
      {stroke}
      stroke-width={strokeWidth}
    />
  {/each}
</g>
<g class="scatter-group">
  {#each bloodTests as b}
    <circle
      cx={xGet(b) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      cy={yGet(b.mgdl) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      r="3"
      fill="red"
      {stroke}
      stroke-width={strokeWidth}
    />
  {/each}
</g>
<g class="scatter-group">
  {#each carbs as c}
    <rect
      x={xGet(c) -15 + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(45) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      width={$xScale(30 * 60)}
      height={22}
      fill="#FF5F05"
    />
    <text
      x={xGet(c) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(35) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      fill="#ffffff"
      text-anchor="middle"
      textLength={$xScale(26 * 60 )}
      dominant-baseline="central">{c.carbs}g
    </text>
  {/each}
</g>
<g class="scatter-group">
  {#each bolus as i}
    <rect
      x={xGet(i) -15 + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(70) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      width={$xScale(30 * 60)}
      height={22}
      fill="#4778F5"
    />
    <text
      x={xGet(i) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(60) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      fill="#ffffff"
      text-anchor="middle"
      textLength={$xScale(26 * 60 )}
      dominant-baseline="central">{i.byType.bolus}E
    </text>
  {/each}
</g>
<g class="scatter-group">
  {#each basal as i}
    <rect
      x={xGet(i) -15 + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(95) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      width={$xScale(30 * 60)}
      height={22}
      fill="#27B719"
    />
    <text
      x={xGet(i) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(85) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      fill="#ffffff"
      text-anchor="middle"
      textLength={$xScale(26 * 60 )}
      dominant-baseline="central">{i.byType.basal}E
    </text>
  {/each}
</g>
<g class="scatter-group">
  {#each other as i}
    <rect
      x={xGet(i) -15 + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(320) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      width={$xScale(30 * 60)}
      height={22}
      fill="red"
    />
    <text
      x={xGet(i) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
      y={yGet(310) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}
      fill="#ffffff"
      text-anchor="middle"
      textLength={$xScale(26 * 60 )}
      dominant-baseline="central">{i.byType.other}E
    </text>
  {/each}
</g>
