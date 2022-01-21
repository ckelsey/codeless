export interface CreateOptions {
    tag: string;
    properties?: {
        [key: string]: any;
    };
    evaluatedProperties?: {
        [key: string]: Function;
    };
    attributes?: {
        [key: string]: string;
    };
    events?: {
        [key: string]: (event: Event) => void;
    };
    subscriptions?: {
        [key: string]: Function;
    };
    children?: HTMLElement[];
}
export default function Create({ tag, properties, evaluatedProperties, attributes, subscriptions, children }: CreateOptions): HTMLElement | undefined;
