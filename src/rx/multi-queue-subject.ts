import { Observable, Observer, Subject, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs'
import { QueueingSubject } from 'queueing-subject'
import { Relay } from 'rxrelayjs'

/**
 * The MultiQueueSubject is a versatile events object. It has a number of options:
 * The main function of this events is to cache events until there is a consumer available to
 * consume them. This means that if a new emitter is added, unconsumed events will be
 * emitted once and then new events will be emitted as they arise. For example:
 *
 * In these examples, A and B are observers
 *
 * Events: 1, [A added], 2, [B added], 3
 * Output A: 1, 2, 3
 * Output B: 3
 * B only received the latest event because no events were cached because a was observing
 *
 * In this case:
 *
 * Events: 1, [A added], 2, [A disposed], 3, [B added], 4
 * Output A: 1, 2
 * Output B: 3, 4
 *
 * This means that events are never missed.
 *
 * This class also has some other options:
 *
 * By calling {@link #newEvents()} the observer will only receive new events:
 *
 * Events: 1, 2, [A added], 3, 4
 * Output: 3, 4
 *
 * Only events that happened after the observer was added are emitted
 *
 * By calling {@link #pastAndNewEvents()} the observer receive all events past and new:
 *
 * Events: 1, 2, [A added], 3, 4
 * Output: 1, 2, 3, 4
 *
 * All events are emitted
 *
 * By calling {@link #currentAndNewEvents()} the observer receive the last event and all new events
 *
 * Events: 1, 2, [A added], 3, 4
 * Output: 2, 3, 4
 *
 * The previous event and then all new events will be emitted
 *
 * @param <T> the object type that will be emitted
 */
export class MultiQueueSubject<T> extends Observable<T> implements Observer<T> {

    protected queueSubject = new QueueingSubject<T>()
    protected publishRelay = new Relay<T>()

    protected publishSubject = new Subject<T>()
    protected behaviorSubject = new BehaviorSubject<T | null>(null)
    protected replaySubject = new ReplaySubject<T>()

    protected queueDisposable?: Subscription

    // @Override
    // protected void subscribeActual(Observer<? super T> observer) {
    //     boolean hasObservers = publishRelay.hasObservers();
    //     publishRelay.subscribe(observer);
    //     if (!hasObservers) {
    //         queueDisposable = queueSubject.subscribe(publishRelay);
    //     }
    // }

    // @Override
    // public void onSubscribe(Disposable d) {
    //     queueSubject.onSubscribe(d);
    // }

    next(value: T) {
        if (this.publishRelay.observers.length > 0 && this.queueDisposable == null) {
            this.queueDisposable = this.queueSubject.subscribe(this.publishRelay);
        }
        if (this.publishRelay.observers.length === 0 && this.queueDisposable != null) {
            this.queueDisposable?.unsubscribe()
        }
        this.queueSubject.next(value)

        // Allow them to only subscribe to new events
        this.publishSubject.next(value)

        // Allow them to get a behavour subject too
        this.behaviorSubject.next(value)

        // Allow them to replay all events
        this.replaySubject.next(value)
    }

    error(err: any) {
        this.queueSubject.error(err)
    }

    complete() {
        this.queueSubject.complete()
    }

    /**
     * Get a events of only new events. For example in the sequence: 1, 2, [subscribed], 3, 4,
     * only 3 and 4 would be emitted to teh observer
     * @return a events of new events
     */
    newEvents(): Observable<T> {
        return this.publishSubject
    }

    /**
     * Get a events of all events. For example in the sequence: 1, 2, [subscribed], 3, 4,
     * 1, 2, 3, 4 would be emitted
     * @return a events of all events past and future
     */
    public pastAndNewEvents(): Observable<T> {
        return this.replaySubject
    }

    /**
     * Get a events of the last and all future events. For example in the sequence: 1, 2, [subscribed], 3, 4,
     * 2, 3, 4 would be emitted
     * @return a events of the last emitted event and all future events
     */
    public currentAndNewEvents(): Observable<T | null> {
        return this.behaviorSubject
    }

}
