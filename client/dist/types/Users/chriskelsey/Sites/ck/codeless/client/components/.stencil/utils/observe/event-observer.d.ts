import { ObserverInstance, ObserverOptions } from './observer';
export interface EventObserverOptions extends ObserverOptions {
  useCapture?: boolean;
  preventDefault?: boolean | ((e: Event) => any);
  stopPropagation?: boolean | ((e: Event) => any);
}
export default function EventObserver(element: Element | Window, eventName: string, options?: EventObserverOptions): ObserverInstance;
