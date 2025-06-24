import { goto } from "$app/navigation";
import type { Database } from "$lib/types/database.types";
import { type SupabaseClient, type Session, type User } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import { getContext, setContext } from "svelte";

export interface Game {
    category: string | null
    cover_image: string | null
    created_at: string
    description: string | null
    developer: string | null
    finished_playing: string | null
    id: number
    rating: number | null
    started_playing: string | null
    title: string
    user_id: string
}

type UpdatableBookFields = Omit<UpdatableBookFields, "id" | "user_id" | "created_at">;

interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
}

export interface OpenAiGame {
    gameTitle: string;
    developer: string;
}

export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient<Database> | null>(null);
    user = $state<User | null>(null);
    allGames = $state<Game[]>([]);
    userName = $state<string | null>(null);
    isLoading = $state(false);


    constructor(data: UserStateProps) {
        this.updateState(data);
    }

    updateState(data: UserStateProps) {
        this.session = data.session;
        this.supabase = data.supabase;
        this.user = data.user;
        this.fetchUserData();
    }

    async fetchUserData() {
        if (!this.user || !this.supabase) return;

        this.isLoading = true;

        const userId = this.user.id;
        
        const [gamesResponse, userNameResponse] = await Promise.all([
            this.supabase.from("games").select("*").eq("user_id", userId),
            this.supabase.from("user_names").select("name").eq("user_id", userId).single()
        ]);

        if (gamesResponse.error || !gamesResponse.data || userNameResponse.error || !userNameResponse.data) {
            console.log("Error fetching user data!");
            console.log({gamesError: gamesResponse.error, userNamesError: userNameResponse.error});
            return;
        }

        this.allGames = gamesResponse.data;
        this.userName = userNameResponse.data.name;

        this.isLoading = false;
    }

    getHighestRatedGames(genre: string | null) {
        if (this.allGames.length === 0) {
            return [];
        }

        return this.allGames
            .filter((game) => game.rating)
            .filter((game) => !genre || game.category?.includes(genre))
            .toSorted((a, z) => z.rating! -a.rating!)
            .slice(0, 9);
    }

    getUnplayedGames() {
        if (this.allGames.length === 0) {
            return [];
        }

        return this.allGames
            .filter((game) => !game.started_playing)
            .toSorted((a, z) => new Date(z.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 9);
    }

    getFavouriteGenre() {
        if (this.allGames.filter(game => game.category).length === 0) {
            return "";
        }
        const genreCounts: {[key: string]: number} = {};

        this.allGames.forEach((game) => {
            const genres = game.category ? game.category?.split(",") : [];
            genres.forEach((genre) => {
                const trimmedGenre = genre.trim();
                if (trimmedGenre) {
                    if (!genreCounts[trimmedGenre]) {
                        genreCounts[trimmedGenre] = 1;
                    } else {
                        genreCounts[trimmedGenre]++;
                    }
                }
            });
        });

        const mostCommonGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
        
        return mostCommonGenre || null;
    }

    getGameById(gameId: number) {
        return this.allGames.find(game => game.id === gameId);
    }

    async updateGame(gameId: number, updateObject: Partial<UpdatableBookFields>) {
        if (!this.supabase) {
            return;
        }

        const {status, error} = await this.supabase.from("games").update(updateObject).eq("id", gameId);

        if (status === 204 && !error) {
            this.allGames = this.allGames.map((game) => {
                if (game.id === gameId) {
                    return {
                        ...game,
                        ...updateObject,
                    };
                } else {
                    return game;
                }
            });
        }
    }

    async uploadGameCover(file: File, gameId: number) {
        if (!this.user || !this.supabase) {
            return;
        }

        const filePath = `${this.user.id}/${new Date().getTime()}_${file.name}`;
        const {error: uploadError} = await this.supabase.storage.from("game-covers").upload(filePath, file);

        if (uploadError) {
            return console.log(uploadError);
        }

        const data = this.supabase.storage.from("game-covers").getPublicUrl(filePath);

        await this.updateGame(gameId, { cover_image: data.data.publicUrl });
    }

    async deleteGameFromLibrary(gameId: number) {
        if (!this.supabase) {
            return;
        }

        const { error, status } = await this.supabase.from("games").delete().eq("id", gameId);
        if (!error && status === 204) {
            this.allGames = this.allGames.filter((game) => game.id !== gameId); // bacause frontend doesn't refresh immediately
        }

        goto("/private/dashboard");
    }

    async addGamesToLibrary(gamesToAdd: OpenAiGame[]) {
        if (!this.supabase || !this.user) {
            return;
        }

        const userId = this.user.id;

        const processedGames = gamesToAdd.map(game => ({
            title: game.gameTitle,
            developer: game.developer,
            user_id: userId
        }));

        const {error} = await this.supabase.from("games").insert(processedGames);
        if (error) {
            throw new Error(error.message);
        } else{
            //this.fetchUserData(); // This is fine, but it also fetches the user name...
           const {data} = await this.supabase.from("games").select("*").eq("user_id", userId);

           if (!data) {
            throw new Error("Could not retrieve all games for user");
           }

           this.allGames = data;
        }

    }

    async updateAccountData(email: string, userName: string) {
        if (!this.session) {
            return;
        }

        try {
            const response = await fetch("/api/update-account", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.session.access_token}`,
                },
                body: JSON.stringify({
                    email,
                    userName
                })
            });

            if (response.ok) {
                this.userName = userName;
            }
        } catch (error) {
            console.log("Failed to update account:", error);
        }
    }

    async deleteAccount() {
        if (!this.session) {
            return;
        }

        try {
            const response = await fetch("/api/delete-account", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.session.access_token}`,
                },
            });

            if (response.ok) {
                await this.logout();
                goto("/");
            }

        } catch (error) {
            console.log("Failed to delete account:", error);
        }
    }

    async logout() {
        console.log("LOGGIGN OUT!!!");
        await this.supabase?.auth.signOut();
        goto("/");
    }
}

// Nekaj kar vedno vrne unique???
const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
    return setContext(USER_STATE_KEY, new UserState(data))
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}