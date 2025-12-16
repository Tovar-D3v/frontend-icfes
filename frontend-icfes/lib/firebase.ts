// Mock Firebase configuration
export const FIREBASE_CONFIG =
  typeof window !== "undefined" && (window as any).__firebase_config
    ? (window as any).__firebase_config
    : {
        apiKey: "demo-api-key",
        authDomain: "demo.firebaseapp.com",
        projectId: "demo-project",
      }

// Simulated Firebase Firestore
class MockFirestore {
  private data: Record<string, any> = {}

  collection(path: string) {
    return {
      doc: (docId: string) => ({
        get: async () => {
          const key = `${path}/${docId}`
          return {
            exists: () => !!this.data[key],
            data: () => this.data[key] || null,
          }
        },
        set: async (data: any) => {
          const key = `${path}/${docId}`
          this.data[key] = { ...this.data[key], ...data }
        },
        collection: (subPath: string) => this.collection(`${path}/${docId}/${subPath}`),
      }),
      add: async (data: any) => {
        const id = Date.now().toString()
        const key = `${path}/${id}`
        this.data[key] = { ...data, id }
        return { id }
      },
      get: async () => {
        const docs = Object.entries(this.data)
          .filter(([key]) => key.startsWith(path + "/"))
          .map(([_, value]) => ({ data: () => value }))
        return { docs }
      },
    }
  }
}

export const mockFirestore = new MockFirestore()
export const mockUserId = "demo-user-" + Math.random().toString(36).substr(2, 9)
