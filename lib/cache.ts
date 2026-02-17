import AsyncStorage from '@react-native-async-storage/async-storage'

export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>
    saveToken: (key: string, token: string) => Promise<void>
    clearToken?: (key: string) => void
}

export const tokenCache = {
    async getToken(key: string) {
        try {
            return await AsyncStorage.getItem(key)
        } catch (error) {
            console.error('AsyncStorage get item error: ', error)
            return null
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return AsyncStorage.setItem(key, value)
        } catch (err) {
            return
        }
    },
}
