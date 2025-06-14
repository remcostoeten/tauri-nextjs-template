import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export const useAuth = () => {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const isAuthenticated = status === "authenticated"
    const isLoading = status === "loading"

    const signOut = useCallback(async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" })
            router.push("/auth/login")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }, [router])

    const updateProfile = useCallback(async (data: any) => {
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            const result = await response.json()
            await update() // Refresh session data
            return result
        } catch (error) {
            console.error("Error updating profile:", error)
            throw error
        }
    }, [update])

    return {
        session,
        isAuthenticated,
        isLoading,
        signOut,
        updateProfile,
    }
} 