<script lang="ts">
	import { getUserState } from "$lib/state/user-state.svelte";
	import Icon from "@iconify/svelte";

    let userContext = getUserState();
    let {allGames, userName} = $derived(userContext);

    $inspect(allGames);

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
</style>