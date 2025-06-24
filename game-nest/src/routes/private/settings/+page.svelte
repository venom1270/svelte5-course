<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import { getUserState } from "$lib/state/user-state.svelte";


    let userContext = getUserState();
    let userName = $state(userContext.userName || ""); // Derived ne mores uporabljat za edit(?), zato das state, ampak v tem momentu se ni prave vrednosti. zato uporabimo effect
    let email = $state(userContext.user?.email || ""); // email je ze na userju ko se authenticatamo, tko da je ok!

    let isEditMode =$state(false);

    let averageRating = $derived.by(() => {
        const gamesWithRating = userContext.allGames.filter((game) => game.rating);
        if (gamesWithRating.length === 0) {
            return "No ratings yet.";
        }
        const sumOfAllRatings = gamesWithRating.reduce((acc, game) => acc + game.rating!, 0);
        const averageRating = Math.round(100 * (sumOfAllRatings / gamesWithRating.length)) / 100;

        return averageRating;
    });

    $effect(() => {
        if (userContext.userName) {
            userName = userContext.userName;
        }
    });

    async function toggleEditModeAndSaveToDatabase() {
        if (isEditMode) {
            await userContext.updateAccountData(email, userName);
        }
        isEditMode = !isEditMode;
    }

    async function deleteAccount() {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone and removes all of your data!");

        if (confirmDelete) {
            await userContext.deleteAccount();
        }
    }

</script>



<div class="settings-page">
    <div class="settings-container">
        <h2>Settings</h2>
        
        <h5 class="mt-m mb-xs semi-bold">Username</h5>
        {#if isEditMode}
            <input type="text" name="userName" bind:value={userName} />
        {:else}
            <h3>{userName}</h3>
        {/if}
        <h5 class="mt-m mb-xs semi-bold">Email Address</h5>
        {#if isEditMode}
            <input type="email" name="email" bind:value={email} />
        {:else}
            <h3>{email}</h3>
        {/if}

        <div class="buttons-container mt-l">
            <Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>
                {isEditMode ? "Save changes" : "Edit"}
            </Button>
            <Button isDanger={true} onclick={deleteAccount}>
                Delete account
            </Button>
        </div>

    </div>
    <div class="stats-container">
        <h5 class="semi-bold">Games in library</h5>
        <h3>{userContext.allGames.length}</h3>
        <h5 class="semi-bold mt-m">Finished books</h5>
        <h3>{userContext.allGames.filter((game) => Boolean(game.finished_playing)).length}</h3>
        <h5 class="semi-bold mt-m">Average rating given</h5>
        <h3>{averageRating}</h3>
    </div>
</div>

<style>
    .settings-page {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        align-items: center;
    }

    .settings-container {
        margin-right: 80px;
    }

    .settings-container input {
        width: 100%;
    }

    .stats-container {
        min-width: 25%;
        border-radius: 12px;
        padding: 8px 24px;
        background-color: rgba(255, 255, 255, 0.5);
        margin-bottom: 40px;
    }
</style>