import { Sendable } from './sendable'
import { SendableType } from '../types/sendable-types'
import { TypingStateType } from '../types/typing-state-type'

export class TypingState extends Sendable {

    constructor(type?: TypingStateType) {
        super()
        this.type = SendableType.TypingState
        if (type) {
            this.setBodyType(type)
        }
    }

    public getBodyType(): TypingStateType {
        return new TypingStateType(super.getBodyType())
    }

    static fromSendable(sendable: Sendable): TypingState {
        return sendable.copyTo(new TypingState())
    }

}