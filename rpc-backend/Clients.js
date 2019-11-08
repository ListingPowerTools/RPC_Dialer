class Clients {
  constructor() {
    this.clientList = {}
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this)
  }

  set(username, client) {
    this.clientList[username] = client
  }

  get(username) {
    return this.clientList[username] || false
  }

  delete(username) {
    delete this.client[username]
  }
}

module.exports = Clients