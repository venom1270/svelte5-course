<script lang="ts">
	import GameCard from "$lib/components/GameCard.svelte";
	import GameCategory from "$lib/components/GameCategory.svelte";
	import StarRating from "$lib/components/StarRating.svelte";
	import { getUserState } from "$lib/state/user-state.svelte";
	import Icon from "@iconify/svelte";

    let userContext = getUserState();
    let {allGames, userName, isLoading} = $derived(userContext);

    let favouriteGenre = $derived(userContext.getFavouriteGenre());

</script>


<div class="dashboard">
    <div class="dashboard-header mb-m">
        <a href="/private/scan-shelf" class="add-game">
            <Icon icon="icons8:plus" width="72" height="72" />
            <p>Add a  game</p>
        </a>
        <div class="headline">
            <h3 class="bold mb-xs">Welcome Back, {userName}</h3>
            <p>There's nothing quite like the journey a good game can take you on. Have you discovered any new favourites recently?</p>
        </div>
    </div>

    {#if allGames.length}
        {#if userContext.getHighestRatedGames(null).length}
            <GameCategory games={userContext.getHighestRatedGames(null)} categoryName={"Your favourite games"} />
        {/if}
        <GameCategory games={userContext.getUnplayedGames()} categoryName={"Recently added, unplayed games"} />
        {#if userContext.getFavouriteGenre()}
            <GameCategory games={userContext.getHighestRatedGames(favouriteGenre)} categoryName={`Highest rated games from your favourite genre: ${favouriteGenre}`} />
        {/if}
    {:else if !isLoading}
        <div class="upload-hint">
            <a href="/private/scan-shelf" class="upload-hint mt-l">
                <h3>You have no games in your library at this moment. Click here to get started!</h3>
                <div class="mt-m">
                    <Icon icon="icons8:plus" width=72 height=72 />
                    <p>Add games</p>
                </div>
            </a>
        </div>
    {:else}
        <!-- LOADING -->
    {/if}

    
</div>

<style>
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
    }

    .add-game {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .add-game p {
        margin-left: 8px;
    }

    .headline {
        text-align: right;
        max-width: 30%;
        min-width: 300px;
    }

    .upload-hint {
        display: flex;
        text-decoration: none;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .upload-hint div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>