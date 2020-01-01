export enum DatabaseType {
    Firestore,
    Realtime
}

export class Config {

    /**
     * Should the framework automatically send a delivery receipt when
     * a message is received
     */
    deliveryReceiptsEnabled = true

    /**
     * Are chat chat invites accepted automatically
     */
    autoAcceptChatInvite = true

    /**
     * If this is enabled, each time a message is received, it will be
     * deleted from our inbound message queue childOn Firestore. Even if this
     * is set to false, typing indicator messages and presence messages will
     * always be deleted as they don't have any use in the message archive
     */
    deleteMessagesOnReceipt = false

    /**
     * How many historic messages should we retrieve?
     */
    messageHistoryLimit = 100

    /**
     * This will be the root of the Firefly Firebase database i.e.
     * /root/[sandbox]/users
     */
    root = 'pepe'

    /**
     * This will be the sandbox of the Firefly Firebase database i.e.
     * /root/[sandbox]/users
     */
    sandbox = 'firefly'

    /**
     * Which database to use - Firestore or Realtime database
     */
    database = DatabaseType.Firestore

}