<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { getUserState, type Game } from '$lib/state/user-state.svelte.js';
	import Icon from '@iconify/svelte';
	import Dropzone from 'svelte-file-dropzone';


    interface GamePageProps {
        data: {
            game: Game;
        };
    }

    let { data } : GamePageProps = $props();
    let userContext = getUserState();
    let game = $derived(userContext.getGameById(data.game.id) || data.game); // $derived(game) je blo prej; spremenil smo zato da dela update na FE
    // zaradi zgornje sprmeembe je load.ts redundanten (edino dodatni checki so, da res obstaja ta id)

    let isEditMode = $state(false);

    let title = $state(game.title);
    let developer = $state(game.developer);
    let description = $state(game.description || "");
    let category = $state(game.category || "");

    function goBack() {
        history.back();
    }
    
    async function toggleEditModeAndSaveToDatabase() {
        if (isEditMode) {
            await userContext.updateGame(game.id, {
                title,
                developer,
                description,
                category
            });
        } 

        isEditMode = !isEditMode;
    }

    async function updatePlayingStatus() {
        const hasStartedPlaying = Boolean(game.started_playing);
        const currentTimestamp = new Date().toISOString();

        if (hasStartedPlaying) {
            await userContext.updateGame(game.id, {finished_playing: currentTimestamp})
        } else {
            await userContext.updateGame(game.id, {started_playing: currentTimestamp})

        }
    }

    async function updateDatabaseRating(newRating: number) {
        await userContext.updateGame(game.id, {rating: newRating});
    }

    async function handleDrop(e : CustomEvent<any>) {
        const { acceptedFiles } = e.detail;

        if (acceptedFiles.length) {
            const file = acceptedFiles[0] as File;
            await userContext.uploadGameCover(file, game.id);
        }
    }

</script>

{#snippet gameInfo()}
<h2 class="game-title mt-m">{game.title}</h2>
<p class="game-developer">by {game.developer}</p>
<h4 class="mt-m mb-xs semi-bold">Your rating</h4>
<StarRating value={game.rating || 0} {updateDatabaseRating} />
<p class="small-font">
    Click to {game.rating ? "change" : "give"} rating
</p>
{#if game.description}
    <h4 class="mt-m mb-xs semi-bold">Description</h4>
    <p class="mb-m">{game.description}</p>
{:else}
<h4 class="mt-m mb-xs semi-bold">No description yet.</h4>
<button class="block mb-m" onclick={() => console.log("toggle to edit mode")}>
    <p>Click to add one.</p>
</button>
{/if}
{#if !game.finished_playing}
    <Button isSecondary={Boolean(game.started_playing)} onclick={updatePlayingStatus}>
        {game.started_playing ? "I finished this game!" : "I started playing this game"}
    </Button>
{/if}
{#if game.category}
    <h4 class="mt-m mb-xs semi-bold">Category</h4>
    <p>{game.category}</p>
{/if}
{/snippet}

{#snippet editFields()}
<form>
    <input class="input input-title mt-m mb-xs" bind:value={title} type="text" name="title" />
    <div class="input-developer">
        <p>by</p>
        <input class="input" bind:value={developer} type="text" name="developer" />
    </div>
    <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
    <StarRating value={game.rating || 0} {updateDatabaseRating} />
    <p class="small-font">
        Click to {game.rating ? "change" : "give"} rating
    </p>
    <h4 class="mt-m mb-xs semi-bold">Description</h4>
    <textarea class="textarea mb-m" name="description" bind:value={description} placeholder="Give a description."></textarea>

    {#if !game.finished_playing}
        <Button isSecondary={Boolean(game.started_playing)} onclick={updatePlayingStatus}>
            {game.started_playing ? "I finished this game!" : "I started playing this game"}
        </Button>
    {/if}
    <h4 class="mt-m mb-xs semi-bold">Category</h4>
    <input class="input" bind:value={category} type="text" name="category" />
</form>
{/snippet}

<div class="game-page">
    <button onclick={goBack} aria-label="Go back">
        <Icon icon="ep:back" width="40" />
    </button>
    <div class="game-container">
        <div class="game-info">
            {#if isEditMode}
                {@render editFields()}
            {:else}
                {@render gameInfo()}
            {/if}
            <div class="buttons-container mt-m">
                <Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>{isEditMode ? "Save changes" : "Edit"}</Button>
                <Button isDanger={true} onclick={() => userContext.deleteGameFromLibrary(game.id)}>Delete game from library</Button>
            </div>
        </div>
        <div class="game-cover">
            {#if game.cover_image}
                <img src={game.cover_image} alt="" />
            {:else}
            <Dropzone on:drop={handleDrop} multiple={false} accept="image/*" maxSize={5*1024*1024} containerClasses={"dropzone-cover"}>
                <Icon icon="bi:camera-fill" width="40" />
                <p>Add game cover</p>
            </Dropzone>
            {/if}
        </div>
    </div>
</div>

<style>
    .game-container {
        display: flex;
        justify-content: flex-start;
    }

    .game-info {
        width: 50%;
    }

    .game-cover {
        width: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        border-radius: 15px;
        min-height: 400px;
        max-width: 450px;
        margin-left: 80px;
    }

    .game-cover img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: inherit;
    }

    .input {
        padding: 8px 4px;
        width: 100%;
    }

    .textarea {
        width: 100%;
    }

    .input-title {
        font-size: 60px;
        font-weight: bold;
        font-family: "Eb Garamond", serif;
    }

    .input-developer {
        display: flex;
        align-items: center;
    }

    .input-developer p {
        margin-right: 8px;
    }

    :global(.dropzone-cover) {
        height: 100%;
        border-radius: 15px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        border: unset !important;
        cursor: pointer;
        border-style: solid !important;
    }

</style>