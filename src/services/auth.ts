// https://developers.google.com/api-client-library/javascript/features/authentication
// https://github.com/google/google-api-javascript-client

const gapi = (window as any).gapi;

class Auth {
    showLogin = false
    doc = (window as any).codeless.document
    upload = (window as any).codeless.upload
    domain = (window as any).codeless.domain
    docData: any = {}
    isSignedIn = false
    user: any = null
    isWriter = false
    docUpdatedSubscribers: Function[] = []
    authSubscribers: Function[] = []

    onUpdate(cb: Function) {
        this.docUpdatedSubscribers.push(cb)
    }

    onAuth(cb: Function) {
        this.authSubscribers.push(cb)
    }

    login() {
        gapi.auth2.getAuthInstance().signIn()
    }

    logout() {
        gapi.auth2.getAuthInstance().signOut()
    }

    sendEmail(data: any) {
        return new Promise((resolve, reject) => {
            if (!data.emails) {
                return reject()
            }

            const callback = (res: any) => {
                console.log(res)
                resolve(res)
            }

            const message = `To: ${data.emails}\r\nFrom: ${gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()}\r\nSubject: ${data.title}\n\r${data.message}`
            const base64EncodedEmail = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');
            
            var request = gapi.client.gmail.users.messages.send({
                'userId': 'me',
                'resource': {
                    'raw': base64EncodedEmail
                }
            });
            request.execute(callback);
        })
    }

    getDirectoryFiles() {
        return gapi.client.drive.files.list({ q: `'${this.upload}' in parents` })
            .then((res: any) => {
                return res.result.files
            })
    }

    getFileUrl(id: string) {
        return `https://drive.google.com/a/${this.domain}/uc?id=${id}&export=download`
    }

    updateSigninStatus(isSignedIn: boolean) {
        this.isSignedIn = isSignedIn

        if (isSignedIn) {

            if (this.showLogin) {
                window.location.pathname = `/`
            }

            this.user = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId()

            return gapi.client.drive.permissions.list({
                fileId: this.doc
            })
                .then(() => {
                    this.isWriter = true
                    this.triggerAuthUpdate()
                })
                .catch(() => {
                    this.isWriter = false
                    this.triggerAuthUpdate()
                })
        }

        this.user = null
    }

    triggerAuthUpdate() {
        this.authSubscribers.forEach(cb => {
            if (cb && typeof cb === `function`) {
                (cb as any)(this.isWriter);
            }
        })
    }

    triggerUpdate() {
        this.docUpdatedSubscribers.forEach(cb => {
            if (cb && typeof cb === `function`) {
                (cb as any)(this.docData);
            }
        })
    }

    updateDoc(content?: string) {
        if (!content) {
            content = JSON.stringify({ testKey: 'test value' })
        }

        return new Promise((resolve, reject) => {
            if (!this.isWriter) {
                return reject(`not permitted`)
            }

            const boundary = '-------314159265358979323846'
            const delimiter = "\r\n--" + boundary + "\r\n"
            const close_delim = "\r\n--" + boundary + "--"
            const contentType = "application/vnd.google-apps.document"
            const base64Data = btoa(content || ``)
            const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim

            const request = gapi.client.request({
                'path': '/upload/drive/v2/files/' + this.doc,
                'method': 'PUT',
                'params': { 'uploadType': 'multipart', 'alt': 'json' },
                'headers': {
                    'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            })

            const callback = (res: any) => {
                resolve(res)
            }

            request.execute(callback)
        })
    }

    uploadFile(fileData: any) {
        return new Promise((resolve, reject) => {
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            const reader = new FileReader();
            reader.readAsBinaryString(fileData);
            reader.onload = (e) => {
                var contentType = fileData.type || 'application/octet-stream';
                var metadata = {
                    title: fileData.name || `Uploaded file for Codeless`,
                    mimeType: contentType,
                    userPermission: { type: `anyone` },
                    parents: [{ id: this.upload }]
                };

                if (reader.result) {
                    var base64Data = btoa(reader.result as any);
                    var multipartRequestBody =
                        delimiter +
                        'Content-Type: application/json\r\n\r\n' +
                        JSON.stringify(metadata) +
                        delimiter +
                        'Content-Type: ' + contentType + '\r\n' +
                        'Content-Transfer-Encoding: base64\r\n' +
                        '\r\n' +
                        base64Data +
                        close_delim;

                    var request = gapi.client.request({
                        'path': '/upload/drive/v2/files',
                        'method': 'POST',
                        'params': { 'uploadType': 'multipart' },
                        'headers': {
                            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                        },
                        'body': multipartRequestBody
                    });

                    const callback = function (file: any) {
                        resolve(file)
                    }

                    request.execute(callback);
                }
            }
        })
    }

    getDoc() {
        return new Promise((resolve, reject) => {
            return gapi.client.drive.files.export({
                fileId: this.doc,
                mimeType: `text/plain`
            })
                .then((res: any) => {
                    let doc
                    try {
                        doc = JSON.parse(res.body.trim())

                        if (doc) {
                            this.docData = doc
                            return resolve(this.docData)
                        }
                    } catch (error) {
                        return reject()
                    }
                })
                .catch(reject)
        })
    }

    init() {
        this.updateSigninStatus = this.updateSigninStatus.bind(this)

        if (location.pathname === `/login`) {
            this.showLogin = true
        }

        return new Promise((resolve, reject) => {
            const start = () => {
                gapi.client.init({
                    apiKey: 'AIzaSyBWyofYdqqWW1fdFBbe3GjYwunoMi_tP5Q',
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                    clientId: '679670526531-po28kjn9kdk5h93k8uf6n2i26harqedr.apps.googleusercontent.com',
                    scope: 'profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send'
                }).then(() => {
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus)

                    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())

                    return this.getDoc()
                        .then(res => {
                            this.triggerUpdate()
                            resolve()
                        })
                        .catch(reject)
                })
            }

            gapi.load('client', start)
        })
    }
}

export default new Auth()