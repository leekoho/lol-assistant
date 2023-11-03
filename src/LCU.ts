import { http, invoke } from '@tauri-apps/api'

export interface Credentials {
  port: string
  password: string
}

export class LCU {
  credentials: Credentials = {
    port: '',
    password: '',
  }

  constructor() {}

  async authenticate() {
    this.credentials = await invoke<Credentials>('authenticate')
  }

  request<T>(
    method: http.HttpVerb,
    endpoint: string,
    body: Record<string, any>,
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      if (!this.credentials.password) {
        await this.authenticate()
        console.log(this.credentials)
      }

      http
        .fetch<T>(`https://127.0.0.1:${this.credentials.port}${endpoint}`, {
          method,
          body: http.Body.json(body),
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`riot:${this.credentials.password}`)}`,
          },
        })
        .then(({ status, data }) => {
          if (status >= 200 && status < 300) {
            return resolve(data)
          }

          reject(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
