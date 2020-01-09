import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { FirebaseChatHandler } from '../service/firebase-chat-handler'
import { RxFirestore } from './rx-firestore'
import { Ref } from './ref'
import { Paths } from '../service/paths'
import { Path } from '../service/path'
import { User } from '../../chat/user'
import { Keys } from '../service/keys'
import { Chat } from '../../chat/chat'
import { IJson } from '../../interfaces/json'
import { Consumer } from '../../interfaces/consumer'

export class FirestoreChatHandler extends FirebaseChatHandler {

    leaveChat(chatId: string): Promise<void> {
        return new RxFirestore().delete(Ref.document(Paths.userGroupChatPath(chatId)))
    }

    joinChat(chatId: string): Promise<void> {
        return new RxFirestore().set(Ref.document(Paths.userGroupChatPath(chatId)), User.dateDataProvider().data())
    }

    updateMeta(chatPath: Path, meta: IJson): Promise<void> {
        return new RxFirestore().update(Ref.document(chatPath), meta)
    }

    metaOn(path: Path): Observable<Chat.Meta> {
        // Remove the last path because in this case, the document ref does not include the "meta keyword"
        return new RxFirestore().on(Ref.document(path)).pipe(map(snapshot => {
            const meta = new Chat.Meta()

            const base = Keys.Meta + '.'

            meta.name = snapshot.get(base + Keys.Name)
            meta.created = snapshot.get(base + Keys.Created)
            meta.imageURL = snapshot.get(base + Keys.ImageURL)

            return meta
        }))
    }

    async add(path: Path, data: IJson, newId?: Consumer<string>): Promise<string> {
        return new RxFirestore().add(Ref.collection(path), data, newId)
    }

}
