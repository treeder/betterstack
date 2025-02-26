import api from "api"

export class BetterstackLogger {
  constructor(options = {}) {
    if (!options.url) {
      if (options.host) {
        options.url = `https://${options.host}`
      } else {
        throw new Error("BetterstackLogger: missing url")
      }
    }
    if (!options.token) {
      throw new Error("BetterstackLogger: missing token")
    }
    this.options = options
    this.messages = [] // for sending in batches
  }
  log(...params) {
    console.log(...params)
    let data = {
      level: "info"
    }
    let err = null
    // for (let p of params) {
    //   if (p instanceof Error) {
    //     err = p
    //   }
    // }
    let last = params[params.length - 1]
    if (last instanceof Error) {
      err = last
      params.pop()
    } else if (typeof last == "object") {
      // then data object
      if (params.length > 1) {
        data.data = last
      } else {
        data = { ...data, ...last }
      }
      params.pop()
    }
    if (err) {
      data.message = err.message
      data.level = "error" // betterstack entry
      data.error = {
        message: err.message,
        stack: err.stack,
        status: err.status,
        cause: err.cause,
      }
    }
    if (params.length > 0) { // already popped
      data.message = params.map(p => {
        if (p instanceof Error) {
          return p.message
        }
        if (p instanceof Object) {
          return JSON.stringify(p)
        }
        if (typeof p == "object") {
          return JSON.stringify(p)
        }
        return p
      }).join(" ")
    }
    if (!data.message) data.message = "no message"
    // console.log("betterstack data:", data)
    this.messages.push(data)
  }
  async flush() {
    let body = this.messages
    // console.log(body)
    let r = await api(`${this.options.url}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${this.options.token}` },
      body: body,
      raw: true,
    })
    if (!r.ok) {
      console.error("BETTERSTACK ERROR:", r.status, r.statusText)
    }
  }

}