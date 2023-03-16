import { getFirestore, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore'

const FirestoreDatabase = {
  createCountdown: async function (countdownData: Record<string, unknown>): Promise<string> {
    countdownData['eventName'] = (countdownData.eventName as string).trim().replace(/\s\s+/g, ' ')
    countdownData['eventPreviewName'] = (countdownData.eventPreviewName as string)
      .trim()
      .replace(/\s\s+/g, ' ')

    const db = getFirestore()

    let collectionName = 'countdowns'
    if (import.meta.env.VITE_FIRESTORE_DB_BASE_PATH) {
      collectionName = `${import.meta.env.VITE_FIRESTORE_DB_BASE_PATH}/${collectionName}`
    }

    const docId = doc(collection(db, collectionName)).id
    await setDoc(doc(db, collectionName, docId), {
      ...countdownData,
      createdAt: serverTimestamp(),
      countdownId: docId
    })
    return docId
  }
}

export { FirestoreDatabase }