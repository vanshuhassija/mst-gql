import * as fs from "fs"

import { RootStore } from "./models"

export const typeDefs = fs.readFileSync(__dirname + "/schema.graphql", "utf8")

const store = RootStore.create()

export const resolvers = {
  Query: {
    messages: (_, { offset, count, replyTo }) =>
      store.allMessages(offset, count, replyTo),
    message: (_, { id }) => store.getMessage(id),
    me: () => store.users.get("mweststrate").serialize()
  },
  Subscription: {
    newMessages: {
      subscribe: () => store.getPubSub().asyncIterator("newMessages")
    }
  },
  Mutation: {
    changeName: (root, { id, name }, context) => {
      const user = store.users.get(id)
      user.setName(name)
      return user.serialize()
    },
    like: (root, { msg, user }) => store.like(msg, user),
    postTweet: (root, { text, user, replyTo }) =>
      store.postTweet(text, user, replyTo)
  }
}

module.exports = {
  typeDefs,
  resolvers,
  context: (headers, secrets) => {
    return {
      headers,
      secrets
    }
  }
}
