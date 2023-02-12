<script lang="ts">
  import Visualization from './lib/Visualization.svelte';
</script>

<main>
  <div class="card">
    <Visualization />
  </div>
</main>

<style lang="scss">
  main {
    width: 100%;
    padding: 100px 50px;
    @media print {
      padding: 1cm;
    }
  }
</style>