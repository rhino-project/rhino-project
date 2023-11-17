import { DirectUpload } from '@rails/activestorage';
import { API_ROOT_PATH } from 'rhino/config';

const END_POINT = `${API_ROOT_PATH}/rails/active_storage/direct_uploads`;

export default class Uploader {
  constructor(uploadable, file, notify) {
    this.uploadable = uploadable;
    this.file = file;
    this.notify = notify;

    this.begin = this.begin.bind(this);
    this.directUploadDidProgress = this.directUploadDidProgress.bind(this);
  }

  begin() {
    const directUploader = new DirectUpload(this.file, END_POINT, this);
    return new Promise((resolve, reject) => {
      directUploader.create((error, blob) => {
        if (error) {
          reject(error);
        } else {
          resolve(blob);
        }
      });
    });
  }

  directUploadWillCreateBlobWithXHR(request) {
    request.withCredentials = true;
  }

  directUploadWillStoreFileWithXHR(request) {
    request.upload.addEventListener('progress', (event) =>
      this.directUploadDidProgress(event)
    );
  }

  directUploadDidProgress(event) {
    let uploadable = { ...this.uploadable };
    uploadable = this.updateUploadable(event, uploadable);
    this.notify(uploadable);
  }

  updateUploadable(event, uploadable) {
    uploadable.progress = this.progress(event);
    uploadable.timeLeftInMinutes = this.timeLeftInMinutes(event);

    if (event.loaded >= event.total) {
      uploadable.isUploaded = true;
      uploadable.progress = 100;
      uploadable.timeLeftInMinutes = undefined;
    }

    return uploadable;
  }

  progress(event) {
    return (event.loaded / event.total) * 100;
  }

  timeLeftInMinutes(event) {
    const timeRunningInSeconds = event.timeStamp / 1000;
    const kbps = event.loaded / timeRunningInSeconds / 1024;
    const kbpsLeft = (event.total - event.loaded) / 1024;

    return (kbpsLeft / kbps / 60).toFixed(0);
  }
}
