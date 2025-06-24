<script lang="ts">
    import type { Game } from "$lib/state/user-state.svelte"
	import StarRating from "./StarRating.svelte";

    interface GameCardProps {
        game: Game;
    }

    let {game}: GameCardProps = $props();
    let gameStatus = $derived(
        game.finished_playing ? "Finished" : game.started_playing ? "Currently playing" : "Not started"
    );

</script>

<a class="game-card" href={`/private/games/${game.id}`}>
    <div class="game-status">
        <span>{gameStatus}</span>
    </div>
    <div class="game-cover">
        {#if game.cover_image}
            <img src={game.cover_image} alt="" />
        {/if}
    </div>
    <div class="game-info">
        <h4>{game.title}</h4>
        <p class="mb-s">{game.developer}</p>
        <StarRating value={game.rating || 0} isReadOnly={true} />
    </div>
</a>

<style>
    .game-card {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 360px;
        width: 360px;
        height: 300px;
        max-width: 450px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        color: white;
        text-decoration: none;
        text-align: left;
    }

    .game-cover {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .game-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
    }

    .game-info {
        background: rgba(0, 0, 0, 0.4);
        height: 100%;
        width: 100%;
        padding: 60px 16px 0 16px;
        border-radius: 12px;
    }

    .game-info h4 {
        font-family: "EB Garamond", serif;
    }

    .game-info p {
        font-size: 14px;
        font-weight: 400;
        font-style: italic;
    }

    .game-status {
        position: absolute;
        top: 16px;
        right: 0;
        padding: 4px 8px;
        width: auto;
        background-color: rgba(4, 59, 92, 0.7);
    }
</style>