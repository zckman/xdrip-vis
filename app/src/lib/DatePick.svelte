<script lang="ts">
  import { onMount } from "svelte";

  export let date: Date | null = null  
  /** 
   * Minutes offset from UTC. E.g. for UTC+1 the offset is -60
   * The offset is only used internally to make the date input display local dates.
   * Defaults to `Date::getTimezoneOffset`
   */
  export let timezoneOffset : number = new Date().getTimezoneOffset()
  let input: HTMLInputElement

  function updateDate() {
    let valueAsDate = input?.valueAsDate
    // Remove the offset again
    if (valueAsDate instanceof Date && timezoneOffset) {
      valueAsDate = new Date(valueAsDate.getTime() + (timezoneOffset * 1000 * 60))
    }
    date = valueAsDate
  }

  onMount(() => {
    // Modify the date so the input shows our local date
    let valueAsDate = date
    if (valueAsDate instanceof Date && timezoneOffset) {
      valueAsDate = new Date(valueAsDate.getTime() - (timezoneOffset * 1000 * 60))
    }
    input.valueAsDate = valueAsDate
    
  })

</script>

<input type="date" bind:this={input} on:change={updateDate}>