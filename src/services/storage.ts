import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile } from 'vuefire'

const StorageService = {
  uploadPicture: async function (imageBlob: Blob): Promise<string> {
    const storage = useFirebaseStorage()
    const filename = `background_images/${Math.random().toString(36).slice(2)}.jpg`
    const fileRef = storageRef(storage, filename)

    const {
      url,
      // gives you a percentage between 0 and 1 of the upload progress
      uploadProgress,
      uploadError,
      // firebase upload task
      uploadTask,
      upload
    } = useStorageFile(fileRef)

    await upload(imageBlob)
    return filename
  }
}

export { StorageService }
