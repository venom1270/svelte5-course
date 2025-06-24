<script lang="ts">
	import type { Game } from "$lib/state/user-state.svelte";
	import GameCard from "./GameCard.svelte";

    interface GameCategoryProps {
        categoryName: string;
        games: Game[];
    }

    let { categoryName, games }: GameCategoryProps = $props();
</script>

<section class="game-category mb-m">
    <h3 class="mb-s">{categoryName}</h3>
    <div class="games-container">
        {#each games as game}
            <GameCard {game} />
        {/each}
    </div>
</section>

<style>
    .games-container {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding-bottom: 8px;
        scrollbar-width: thin;
    }

    .games-container::-webkit-scrollbar {
        height: 6px;
    }

    .games-container::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }
</style>