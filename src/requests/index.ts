import { IpcMainInvokeEvent } from 'electron'

export const requests = {
  async sendRequest(_: IpcMainInvokeEvent, url: string): Promise<string> {
    console.log(`fetching ${url}`)
    return 'foo bar'
  }
}
