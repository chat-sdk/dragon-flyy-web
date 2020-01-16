import { Observable } from 'rxjs'

import { User } from '../chat/user'
import { UserEvent } from '../events/user-event'
import { MultiQueueSubject } from '../firebase/rx/multi-queue-subject'
import { Message } from '../message/message'
import { FireStreamUser } from '../namespace/firestream-user'
import { DeliveryReceiptType } from '../types/delivery-receipt-type'
import { RoleType } from '../types/role-type'
import { TypingStateType } from '../types/typing-state-type'
import { IAbstractChat } from './abstract-chat'
import { Consumer } from './consumer'
import { IJsonObject } from './json'
import { ISendable } from './sendable'

/**
 * This interface is just provided for clarity
 */
export interface IChat extends IAbstractChat {

    /**
     * The unique chat id
     * @return id string
     */
    getId(): string

    /**
     * Remove the user from the chat's roster. It may be preferable to call
     * @see IFireStream#leaveChat(IChat)
     * @return promise
     */
    leave(): Promise<void>

    /**
     * Get the chat name
     * @return name string
     */
    getName(): string

    /**
     * Set the chat name
     * @param name new name
     * @return promise
     */
    setName(name: string): Promise<void>

    /**
     * Get the group image url
     * @return image url string
     */
    getImageURL(): string

    /**
     * Set the chat image url
     * @param url of group image
     * @return promise
     */
    setImageURL(url: string): Promise<void>

    /**
     * Get any custom data associated with the chat
     * @return custom data object
     */
    getCustomData(): IJsonObject

    /**
     * Associate custom data with the chat - you can add your own
     * data to a chat - topic, extra links etc...
     * @param data custom data to write
     * @return promise
     */
    setCustomData(data: IJsonObject): Promise<void>

    /**
     * Get a list of members of the chat
     * @return list of users
     */
    getUsers(): User[]

    /**
     * Get a list of users with the FireStreamUser namespace
     * These are exactly the same users but may be useful if
     * your project already has a User class to avoid a clash
     * @return list of FireStreamUsers
     */
    getFireStreamUsers(): FireStreamUser[]


    /**
     * Add users to the chat
     * @param sendInvite should an invitation message be sent?
     * @param users users to add, set the role of each user using user.setRoleType()
     * @return promise
     */
    addUsers(sendInvite: boolean, users: User[]): Promise<void>

    /**
     * Add a user to the chat
     * @param sendInvite should an invitation message be sent?
     * @param users user to add, set the role using user.setRoleType()
     * @return promise
     */
    addUser(sendInvite: boolean, user: User): Promise<void>

    /**
     * Update users in the chat
     * @param users users to update
     * @return promise
     */
    updateUsers(users: User[]): Promise<void>

    /** Update a user in the chat
     * @param user user to update
     * @return promise
     */
    updateUser(user: User): Promise<void>

    /**
     * Remove users from a chat
     * @param users users to remove
     * @return promise
     */
    removeUsers(users: User[]): Promise<void>

    /**
     * Remove a user from the chat
     * @param user user to remove
     * @return promise
     */
    removeUser(user: User): Promise<void>

    /**
     * Send an invite message to users
     * @param users to invite
     * @return promise
     */
    inviteUsers(users: User[]): Promise<void>

    /**
     * Set the role of a user
     * @param user to update
     * @param roleType new role type
     * @return promise
     */
    setRole(user: User, roleType: RoleType): Promise<void>

    /**
     * Get the users for a particular role
     * @param roleType to find
     * @return list of users
     */
    getUsersForRoleType(roleType: RoleType): User[]

    /**
     * Get the role for a user
     * @param user to who's role to find
     * @return role of user in the chat
     */
    getRoleType(user: User): RoleType

    /**
     * Get a list of roles that this user could be changed to. This will vary
     * depending on our own role level
     * @param user to test
     * @return list of role types
     */
    getAvailableRoles(user: User): RoleType[]

    /**
     * Get an observable which emits new values when ever the name changes
     * @return observable
     */
    getNameChangeEvents(): Observable<string>

    /**
     * Get an observable which emits new values when ever the chat image changes
     * @return observable
     */
    getImageURLChangeEvents(): Observable<string>

    /**
     * Get an observable which emits new values when ever the custom data associated with the
     * chat is updated
     * @return observable
     */
    getCustomDataChangedEvents(): Observable<IJsonObject>

    /**
     * Get an observable which emits new values when ever a user is added, removed or updated
     * @return observable
     */
    getUserEvents(): MultiQueueSubject<UserEvent>

    /**
     * Send a message with custom data
     * @param body custom message data
     * @param newId message's new ID before sending
     * @return promise
     */
    sendMessageWithBody(body: IJsonObject, newId?: Consumer<String>): Promise<void>

    /**
     * Send a message with custom data
     * @param body custom message data
     * @return promise
     */
    sendMessageWithBody(body: IJsonObject): Promise<void>

    /**
     * Send a text message
     * @param text message text
     * @param newId message's new ID before sending
     * @return promise
     */
    sendMessageWithText(text: string, newId?: Consumer<String>): Promise<void>

    /**
     * Send a text message
     * @param text message text
     * @return promise
     */
    sendMessageWithText(text: string): Promise<void>

    /**
     * Send a typing indicator message
     * @param type typing state
     * @param newId message's new ID before sending
     * @return promise
     */
    sendTypingIndicator(type: TypingStateType, newId?: Consumer<String>): Promise<void>

    /**
     * Send a typing indicator message. An indicator should be sent when starting and stopping typing
     * @param type typing state
     * @return promise
     */
    sendTypingIndicator(type: TypingStateType): Promise<void>

    /**
     * Send a delivery receipt to a user. If delivery receipts are enabled,
     * a 'received' status will be returned as soon as a message is delivered
     * and then you can then manually send a 'read' status when the user
     * actually reads the message
     * @param type receipt type
     * @param newId message's new ID before sending
     * @return promise
     */
    sendDeliveryReceipt(type: DeliveryReceiptType, messageId: string, newId?: Consumer<String>): Promise<void>

    /**
     * Send a delivery receipt to a user. If delivery receipts are enabled,
     * a 'received' status will be returned as soon as a message is delivered
     * and then you can then manually send a 'read' status when the user
     * actually reads the message
     * @param type receipt type
     * @return promise
     */
    sendDeliveryReceipt(type: DeliveryReceiptType, messageId: string): Promise<void>

    /**
     * Send a custom sendable
     * @param sendable to send
     * @param newId message's new ID before sending
     * @return promise
     */
    send(sendable: ISendable, newId?: Consumer<String>): Promise<void>

    /**
     * Send a custom sendable
     * @param sendable to send
     * @return promise
     */
    send(sendable: ISendable): Promise<void>

    /**
     * Delete a sendable
     * @param sendable to delete
     * @return promise
     */
    deleteSendable(sendable: ISendable): Promise<void>

    /**
     * Mark a message as received
     * @param message to mark as received
     * @return promise
     */
    markReceived(message: Message): Promise<void>

    /**
     * Mark a message as read
     * @param message to mark as read
     * @return promise
     */
    markRead(message: Message): Promise<void>

}
